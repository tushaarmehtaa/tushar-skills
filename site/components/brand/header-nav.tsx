"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SlashMark } from "./logos";
import { InstallMenu } from "./install-menu";

const LINKS = [
  { key: "s", label: "Skills", href: "/#skills" },
  { key: "g", label: "Guides", href: "/guides" },
  { key: "r", label: "Requirements", href: "/compatibility" },
  { key: "c", label: "Changelog", href: "/changelog" },
];

export function HeaderNav({ slugs }: { slugs: string[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="nav">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="slashskills home">
          <SlashMark />
          slashskills
        </Link>
        <nav className="links" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              data-key={l.key}
              aria-current={l.href !== "/#skills" && pathname.startsWith(l.href) ? "page" : undefined}
              className={l.href !== "/#skills" && pathname.startsWith(l.href) ? "on" : undefined}
            >
              <b>[{l.key.toUpperCase()}]</b>
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          ref={button}
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="menu-panel"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <InstallMenu slugs={slugs} />
        <nav id="menu-panel" className="menu-panel" aria-label="Menu" hidden={!open}>
          {LINKS.map((l) => (
            <Link key={l.key} href={l.href} onClick={() => setOpen(false)}>
              <b>[{l.key.toUpperCase()}]</b>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
