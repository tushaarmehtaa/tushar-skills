import Link from "next/link";
import { GithubStars } from "./github-stars";
import { PageFrame } from "./page-frame";

export function Header() {
  return (
    <header className="animate-fade-in px-6 py-5">
      <PageFrame className="flex items-center justify-between">
        <Link
          href="/"
          className="group -my-2 flex min-h-11 items-center gap-2 py-2"
        >
          <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent)]">/</span>
          <span className="font-[family-name:var(--font-mono)] text-sm font-semibold tracking-tight text-[var(--color-heading)] transition-colors group-hover:text-[var(--color-accent)]">
            slashskills
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/compatibility"
            className="-my-2 inline-flex min-h-11 items-center py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]"
          >
            compatibility
          </Link>
          <Link
            href="/changelog"
            className="-my-2 hidden min-h-11 items-center py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)] sm:inline-flex"
          >
            changelog
          </Link>
          <a
            href="https://github.com/tushaarmehtaa/tushar-skills"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="slashskills on GitHub"
            className="-my-2 -mr-2 flex min-h-11 min-w-8 items-center justify-center gap-1.5 px-2 py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)] sm:-mr-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">github</span>
            <span className="hidden text-[var(--color-accent)] sm:inline">
              <GithubStars />
            </span>
          </a>
        </nav>
      </PageFrame>
    </header>
  );
}
