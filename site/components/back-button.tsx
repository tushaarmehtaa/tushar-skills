"use client";

import { useRouter } from "next/navigation";

export function BackButton({ fallback = "/compatibility" }: { fallback?: string }) {
  const router = useRouter();

  function goBack() {
    const referrer = document.referrer;
    const isInternalReferrer = referrer.startsWith(window.location.origin);

    if (isInternalReferrer && window.history.length > 1) {
      router.back();
      return;
    }

    router.replace(fallback);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="back-link mb-10 -ml-3 inline-flex min-h-11 items-center gap-2 rounded px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    >
      ← back
    </button>
  );
}
