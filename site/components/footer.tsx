import { RuntimeLogo } from "./runtime-logo";
import { PageFrame } from "./page-frame";

export function Footer() {
  return (
    <footer className="px-6 py-10">
      <PageFrame className="border-t border-[var(--color-border)] pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
            <p>
              built by{" "}
              <a
                href="https://tushaarmehtaa.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="-my-2 inline-flex min-h-8 items-center py-2 text-[var(--color-text)] transition-colors hover:text-[var(--color-heading)]"
              >
                @tushaarmehtaa
              </a>
            </p>
            <a
              href="https://tushaarmehtaa.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="-my-2 flex min-h-8 items-center py-2 text-[var(--color-text)] transition-colors hover:text-[var(--color-heading)]"
            >
              I build things on the internet →
            </a>
            <a
              href="https://agentskills.io"
              target="_blank"
              rel="noopener noreferrer"
              className="-my-2 flex min-h-8 items-center gap-2 py-2 transition-colors hover:text-[var(--color-heading)]"
            >
              <RuntimeLogo runtime="agent-skills" tone="current" decorative className="h-3.5 w-3.5" />
              <span>Agent Skills specification ↗</span>
            </a>
          </div>
          <div className="flex items-center gap-4 font-[family-name:var(--font-mono)] text-xs">
            <a href="/compatibility" className="-my-2 inline-flex min-h-8 items-center py-2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]">
              Compatibility
            </a>
            <a
              href="https://github.com/tushaarmehtaa/tushar-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="-my-2 inline-flex min-h-8 items-center py-2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]"
            >
              MIT license · GitHub
            </a>
          </div>
        </div>
      </PageFrame>
    </footer>
  );
}
