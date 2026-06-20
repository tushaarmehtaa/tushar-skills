---
name: file-upload
description: Wire file uploads end-to-end. Presigned URLs for Vercel Blob, Cloudflare R2, or AWS S3. File type validation, size limits, upload progress, frontend state. Use when adding file upload to any Next.js app.
category: infrastructure
tags: [file-upload, vercel-blob, r2, s3, storage, presigned-urls]
author: tushaarmehtaa
---

Wire file uploads using presigned URLs — client uploads directly to storage, your server never touches the bytes. Reads the project first, picks the right storage provider.

## Four things that silently break file uploads

1. **CORS not configured on the bucket.** The browser makes a direct PUT to R2/S3. Without CORS rules allowing your origin, every upload fails with a CORS error. Vercel Blob handles this automatically — R2 and S3 don't.
2. **MIME type validation on the client only.** The `accept` attribute on `<input>` is cosmetic — users can bypass it. Always validate the MIME type server-side when generating the presigned URL, not just on the client.
3. **No file size check before generating the presigned URL.** If you generate a presigned URL and then the user uploads a 500MB file, it succeeds. Set a `ContentLengthRange` condition on S3/R2 presigned URLs, or check `Content-Length` on the initial request.
4. **Storing the presigned URL path as the permanent file URL.** Presigned URLs expire. Store the permanent public URL (or your own proxy route), not the presigned URL.

## Phase 1: Detect the Project

```bash
cat package.json | grep -E "@vercel/blob|@aws-sdk|@cloudflare"
```

- **`@vercel/blob`** → Vercel Blob (simplest for Vercel-hosted apps)
- **`@aws-sdk/client-s3`** → AWS S3
- **`@cloudflare/workers-types` or Wrangler** → Cloudflare R2
- **None** → ask the user (default: Vercel Blob if on Vercel)

## Phase 2: Ask the User

```
I'll wire file uploads for your [framework] app.

Quick decisions:

1. Storage provider?
   a) Vercel Blob — simplest, no CORS config needed (default if on Vercel)
   b) Cloudflare R2 — S3-compatible, free egress
   c) AWS S3 — most flexible

2. What file types? (e.g., "images only", "PDF and images", "any")

3. Max file size? (default: 10MB for images, 50MB for documents)

4. Public or private files?
   a) Public — direct URL access, no auth required (avatars, product images)
   b) Private — serve through your API with auth check (user documents, invoices)
```

## Phase 3: Provider Setup

### Option A: Vercel Blob (recommended for Vercel apps)

```bash
npm install @vercel/blob
```

Add to `.env.example`:
```
BLOB_READ_WRITE_TOKEN=
```

Get from Vercel Dashboard → Storage → Blob → your store → Settings.

### Option B: Cloudflare R2

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Add to `.env.example`:
```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=        # your r2.dev URL or custom domain
```

Configure CORS in Cloudflare dashboard → R2 → your bucket → Settings → CORS:
```json
[{
  "AllowedOrigins": ["https://yoursite.com", "http://localhost:3000"],
  "AllowedMethods": ["PUT", "GET"],
  "AllowedHeaders": ["Content-Type", "Content-Length"],
  "MaxAgeSeconds": 3600
}]
```

### Option C: AWS S3

Same packages as R2. Add:
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```

## Phase 4: The Upload API Route

Generate a presigned URL server-side. Validate here — not on the client.

**Vercel Blob:**
```typescript
// app/api/upload/route.ts
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Auth check
        const user = await getAuthUser(req);
        if (!user) throw new Error('Unauthorized');

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          tokenPayload: JSON.stringify({ userId: user.id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const { userId } = JSON.parse(tokenPayload ?? '{}');
        // Store blob.url in your database
        await db.update(users).set({ avatarUrl: blob.url }).where(eq(users.id, userId));
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
```

**R2 / S3 (presigned URL approach):**
```typescript
// app/api/upload/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { filename, contentType, size } = await req.json();

  // Validate server-side
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
  }
  if (size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
  }

  const key = `uploads/${user.id}/${randomUUID()}-${filename}`;

  const presignedUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 } // 5 minutes
  );

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return NextResponse.json({ presignedUrl, publicUrl, key });
}
```

## Phase 5: The Upload Component

```tsx
// components/file-upload.tsx
'use client';
import { useState, useRef } from 'react';

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  url: string | null;
  error: string | null;
}

export function FileUpload({
  onUploadComplete,
  accept = 'image/*',
  maxSizeMB = 10,
}: {
  onUploadComplete?: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}) {
  const [state, setState] = useState<UploadState>({
    status: 'idle', progress: 0, url: null, error: null,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    // Client-side size check (real check is server-side)
    if (file.size > maxSizeMB * 1024 * 1024) {
      setState({ status: 'error', progress: 0, url: null, error: `Max size is ${maxSizeMB}MB` });
      return;
    }

    setState({ status: 'uploading', progress: 0, url: null, error: null });

    // Get presigned URL
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setState({ status: 'error', progress: 0, url: null, error });
      return;
    }

    const { presignedUrl, publicUrl } = await res.json();

    // Upload directly to storage with progress
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setState((s) => ({ ...s, progress: Math.round((e.loaded / e.total) * 100) }));
        }
      };
      xhr.onload = () => (xhr.status === 200 ? resolve() : reject(new Error('Upload failed')));
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });

    setState({ status: 'success', progress: 100, url: publicUrl, error: null });
    onUploadComplete?.(publicUrl);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={state.status === 'uploading'}>
        {state.status === 'uploading' ? `uploading ${state.progress}%` : 'upload file'}
      </button>
      {state.status === 'uploading' && (
        <div style={{ width: `${state.progress}%`, height: 4, background: '#000' }} />
      )}
      {state.status === 'success' && state.url && (
        <img src={state.url} alt="uploaded" style={{ maxWidth: 200 }} />
      )}
      {state.status === 'error' && <p>{state.error}</p>}
    </div>
  );
}
```

## Verify

```
[ ] File type validation happens in the API route (not just the <input accept> attribute)
[ ] File size check happens in the API route before generating presigned URL
[ ] Auth check happens before generating presigned URL
[ ] CORS configured on R2/S3 bucket (allow your domain + PUT method)
[ ] Presigned URL is not stored — only the permanent public URL is saved to DB
[ ] Presigned URL expires in ≤ 5 minutes
[ ] Upload progress shown to user (not just a spinner)
[ ] Error state renders with the specific error message
[ ] Test: upload a .exe file — confirm it's rejected server-side
[ ] Test: upload a 50MB file — confirm it's rejected before presigned URL is generated
```
