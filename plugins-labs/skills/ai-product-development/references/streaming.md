# Vercel AI SDK streaming

Read this reference only for streamed chat/generation. Detect the installed `ai` and `@ai-sdk/react` major versions first; AI SDK UI changed substantially in v5, and older `ai/react`, input helpers, `maxTokens`, and data-stream examples should not be copied into current projects.

## Contents

- [Choose the protocol](#choose-the-protocol)
- [Server route](#server-route)
- [Client state](#client-state)
- [Cancellation and charging](#cancellation-and-charging)
- [Version migration](#version-migration)
- [Verification](#verification)

## Choose the protocol

- Use a UI-message stream for chat, tools, metadata, and resumable UI state.
- Use a text stream for simple single-output generation.
- Use a background job for work that outlives the request/runtime.

Node runtimes can stream; Edge is not universally required. Choose runtime from provider/SDK compatibility, duration, networking, and deployment limits.

## Server route

Current AI SDK patterns use `maxOutputTokens` and `toUIMessageStreamResponse()` for chat. Validate the request and convert UI messages according to the installed version.

```typescript
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const Body = z.object({ messages: z.array(z.custom<UIMessage>()).max(100) });

export async function POST(req: Request) {
  const user = await requireUser(req);
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const reservation = await reserveUsage(user.id, 'chat', req.headers.get('idempotency-key'));

  const result = streamText({
    model: anthropic(process.env.AI_MODEL!),
    messages: await convertToModelMessages(parsed.data.messages),
    maxOutputTokens: 1024,
    abortSignal: req.signal,
    onFinish: async ({ usage, finishReason }) => {
      await settleUsage(reservation.id, { usage, finishReason });
    },
    onAbort: async () => {
      await releaseOrSettlePartialUsage(reservation.id);
    },
  });

  return result.toUIMessageStreamResponse();
}
```

Adapt callback names/types to the installed SDK. Ensure settlement failures are observable and recoverable; provider callbacks must not be the only durable accounting record.

## Client state

Current `useChat` comes from `@ai-sdk/react`, uses transport-based configuration, does not own text-input state, and returns status such as `submitted`, `streaming`, `ready`, and `error`.

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const busy = status === 'submitted' || status === 'streaming';
  // Render message parts for the installed SDK, including tool and error parts.
  // Keep the Stop action available while busy and Retry/Regenerate after failure.
  return null;
}
```

Render `parts`, not a legacy flat `message.content`, when using current UI messages. Distinguish submitted/no-token state from active streaming and partial completion.

## Cancellation and charging

Pass the request abort signal upstream and expose Stop. Navigation/unmount alone may not provide durable accounting. For fixed-cost work, atomically reserve before starting and capture/release afterward. For metered work, settle actual usage, including partial/cancelled output, according to product policy. Concurrent requests must not overspend.

## Version migration

When an existing app uses `ai/react`, `handleInputChange`, `handleSubmit`, `isLoading`, `toDataStreamResponse`, or `maxTokens`, consult the installed-major migration guide. Do not perform a partial API migration that changes only imports.

## Verification

- Authorized and unauthorized requests are decided before stream creation.
- Invalid message shapes and oversized context are rejected.
- First-token delay, partial tokens, tool parts, finish, refusal, and error states render.
- Stop aborts upstream work; disconnect behavior is observed in server logs.
- Duplicate/concurrent requests respect idempotency and usage reservations.
- Settlement handles success, length, tool completion, cancellation, and provider error.
- Target runtime streams without buffering and passes lint/type/test/build.
