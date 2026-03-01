export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] px-6 py-12 mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="gradient-line mb-8" />
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)]">
              <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold text-[var(--color-accent)]">
                /
              </span>
            </div>
            <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-heading)]">
              slashskills
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
            <span>
              Built by{" "}
              <a
                href="https://twitter.com/tushaarmehtaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-heading)] transition-colors hover:text-[var(--color-accent)]"
              >
                @tushaarmehtaa
              </a>
            </span>
            <span className="text-[var(--color-border)]">|</span>
            <a
              href="https://github.com/tushaarmehtaa/tushar-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-heading)] transition-colors hover:text-[var(--color-accent)]"
            >
              Open source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
