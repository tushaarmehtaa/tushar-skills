export function Footer() {
  return (
    <footer className="px-6 py-10">
      <div className="mx-auto max-w-3xl border-t border-[var(--color-border)] pt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--color-muted)]">
            built by{" "}
            <a
              href="https://twitter.com/tushaarmehtaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text)] transition-colors hover:text-[var(--color-heading)]"
            >
              @tushaarmehtaa
            </a>
          </p>
          <a
            href="https://github.com/tushaarmehtaa/tushar-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]"
          >
            open source
          </a>
        </div>
      </div>
    </footer>
  );
}
