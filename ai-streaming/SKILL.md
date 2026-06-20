---
name: ai-streaming
description: Wire streaming AI responses end-to-end. Vercel AI SDK useChat/useCompletion, SSE from route handlers, loading states, error handling, abort on unmount. Use when building any chat, generation, or streaming AI feature in Next.js.
category: ai
tags: [ai, streaming, vercel-ai-sdk, sse, chat, generation, llm]
author: tushaarmehtaa
---

Wire streaming AI responses from model to browser. Uses the Vercel AI SDK — the right abstraction for Next.js AI apps. Reads the project first, wires into existing auth and model config.

## Four things that silently break AI streaming

1. **Wrong runtime on the route handler.** Streaming requires the Edge runtime or a Node.js runtime with proper response handling. Without `export const runtime = 'edge'` or proper streaming setup, the response buffers entirely and "streams" all at once at the end.
2. **No abort handling.** If the user navigates away mid-generation, the model keeps running and spending tokens. Always pass `abortSignal` from an `AbortController` and clean up on component unmount.
3. **Auth check after the stream starts.** Once you call `streamText`, headers are sent. You can't return a 401 after streaming begins. Auth must be checked and validated before calling any SDK method.
4. **Missing error boundaries on the client.** If the stream errors mid-response, `useChat` surfaces it in the `error` state — but if you don't render it, the UI freezes silently with partial output.

## Phase 1: Detect the Project

```bash
cat package.json | grep -E "ai|anthropic|openai|@ai-sdk"
```

- **`ai` package present?** → Vercel AI SDK installed, go to Phase 3
- **`@anthropic-ai/sdk` only?** → add Vercel AI SDK on top
- **`openai` only?** → add Vercel AI SDK on top
- **Nothing?** → install from scratch

Check for existing AI routes:
```bash
find . -name "*.ts" -path "*/api/*" | xargs grep -l "streamText\|createOpenAI\|anthropic" 2>/dev/null
```

## Phase 2: Install

```bash
npm install ai @ai-sdk/anthropic
# or for OpenAI:
npm install ai @ai-sdk/openai
```

Add to `.env.example`:
```
ANTHROPIC_API_KEY=
# or
OPENAI_API_KEY=
```

## Phase 3: The Route Handler

Create the streaming API route. Auth check must come first — before any SDK call:

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export const runtime = 'edge';  // required for true streaming

export async function POST(req: Request) {
  // 1. Auth — must happen before streamText
  const user = await getAuthUser(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Credits / rate limit check (if applicable)
  if (user.credits <= 0) {
    return Response.json({ error: 'No credits remaining', upgradeUrl: '/pricing' }, { status: 402 });
  }

  // 3. Parse the request
  const { messages } = await req.json();

  // 4. Stream
  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    messages,
    system: 'You are a helpful assistant.',
    maxTokens: 1024,
    abortSignal: req.signal,  // propagate client abort
    onFinish: async ({ usage }) => {
      // Deduct credits after completion
      await deductCredits(user.id, usage.totalTokens);
    },
  });

  return result.toDataStreamResponse();
}
```

**For single-turn generation (not chat):**

```typescript
// app/api/generate/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export const runtime = 'edge';

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { prompt } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    prompt,
    abortSignal: req.signal,
  });

  return result.toDataStreamResponse();
}
```

## Phase 4: The Client Hook

**Chat interface (multi-turn):**

```tsx
'use client';
import { useChat } from 'ai/react';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, stop } = useChat({
    api: '/api/chat',
    onError: (err) => console.error('Chat error:', err),
  });

  return (
    <div>
      <div>
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <p>{m.content}</p>
          </div>
        ))}
        {isLoading && <p className="text-muted animate-pulse">Thinking...</p>}
        {error && <p className="text-red-500">Something went wrong. Try again.</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          disabled={isLoading}
        />
        {isLoading ? (
          <button type="button" onClick={stop}>Stop</button>
        ) : (
          <button type="submit">Send</button>
        )}
      </form>
    </div>
  );
}
```

**Single-turn generation:**

```tsx
'use client';
import { useCompletion } from 'ai/react';

export function Generator() {
  const { completion, input, handleInputChange, handleSubmit, isLoading, error, stop } = useCompletion({
    api: '/api/generate',
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea value={input} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>Generate</button>
        {isLoading && <button type="button" onClick={stop}>Stop</button>}
      </form>

      {error && <p className="text-red-500">{error.message}</p>}
      {completion && <div className="whitespace-pre-wrap">{completion}</div>}
    </div>
  );
}
```

## Phase 5: Streaming Loading States

Three states to handle, all distinct:

```tsx
// 1. Not started — show the input
// 2. Loading (model thinking, no tokens yet) — show spinner
// 3. Streaming (tokens arriving) — show partial text

function StreamingOutput({ isLoading, completion }: { isLoading: boolean; completion: string }) {
  if (!isLoading && !completion) return null;

  return (
    <div>
      {isLoading && !completion && (
        // Model is thinking — no tokens yet
        <div className="flex gap-1">
          <span className="animate-bounce">·</span>
          <span className="animate-bounce delay-100">·</span>
          <span className="animate-bounce delay-200">·</span>
        </div>
      )}
      {completion && (
        // Tokens arriving
        <p className="whitespace-pre-wrap">
          {completion}
          {isLoading && <span className="animate-pulse">▋</span>}
        </p>
      )}
    </div>
  );
}
```

## Phase 6: Wire Credits Into the Stream

If the project uses a credits system (from `/ship-credits`), deduct after the stream finishes — not before:

```typescript
// In the route handler onFinish callback:
onFinish: async ({ usage, finishReason }) => {
  if (finishReason === 'stop' || finishReason === 'length') {
    const cost = Math.ceil(usage.totalTokens / 100);  // define your credit cost
    await db.update(users)
      .set({ credits: sql`credits - ${cost}` })
      .where(eq(users.id, user.id));
  }
},
```

Never deduct before the stream — if the model errors on token 1, the user lost credits for nothing.

## Verify

```
[ ] Route handler exports runtime = 'edge'
[ ] Auth check happens before any streamText call
[ ] req.signal passed as abortSignal to streamText
[ ] useChat/useCompletion renders error state (not just isLoading)
[ ] Stop button shown when isLoading — lets user cancel
[ ] Credits deducted in onFinish, not before the stream
[ ] Partial text renders during stream (not only after complete)
[ ] Test: start generation, navigate away — confirm model call aborts in server logs
[ ] Test: trigger an error — confirm error state renders, not a frozen UI
```

See [references/guide.md](references/guide.md) for tool calling patterns, multi-modal (image) inputs, and streaming with structured output.
