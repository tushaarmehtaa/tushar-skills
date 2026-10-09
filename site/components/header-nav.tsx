"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CanvasIcon } from "./canvas-icon";
export function HeaderNav({ installs }: { installs: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="site-nav" ref={ref}>
        <Link href="/" className="wordmark" aria-label="Slashskills home">
          /skills
        </Link>
        <button
          ref={trigger}
          className="icon-button menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(!open)}
        >
          <CanvasIcon name={open ? "close" : "menu"} />
        </button>
        <nav
          id="primary-navigation"
          aria-label="Primary"
          className={open ? "primary-navigation is-open" : "primary-navigation"}
        >
          {[
            ["/", "Skills"],
            ["/guides", "Guides"],
            ["/compatibility", "Requirements"],
            ["/changelog", "Changelog"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          {installs && (
            <a
              href="https://www.skills.sh/tushaarmehtaa/tushar-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-installs"
              title="Installs tracked by skills.sh"
            >
              <span className="tabular-nums">{installs}</span> installs
            </a>
          )}
          <a
            href="https://github.com/tushaarmehtaa/tushar-skills"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <CanvasIcon name="external" width="15" height="15" />
          </a>
        </nav>
      </div>
    </header>
  );
}
