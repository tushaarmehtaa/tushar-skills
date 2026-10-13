"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const KEY_EVENT = "slashskills:key";
const ROUTES: Record<string, string> = { g: "/guides", r: "/compatibility", c: "/changelog" };

/** Single-key navigation. Never animated: keyboard actions repeat hundreds of times. */
export function KeyNav() {
  const router = useRouter();
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.matches?.("input,textarea,select,[contenteditable]")) return;
      const k = e.key.toLowerCase();
      const home = location.pathname === "/";
      const skills = document.getElementById("skills");
      if (k === "/") {
        e.preventDefault();
        if (home && skills) {
          skills.scrollIntoView({ behavior: "auto" });
          window.dispatchEvent(new CustomEvent(KEY_EVENT, { detail: { type: "search" } }));
        } else router.push("/?search=1#skills");
      } else if (k === "s") {
        if (home && skills) skills.scrollIntoView({ behavior: "auto" });
        else router.push("/#skills");
      } else if (ROUTES[k]) router.push(ROUTES[k]);
      else if (home && k === "l") window.dispatchEvent(new CustomEvent(KEY_EVENT, { detail: { type: "load" } }));
      else if (home && /^[1-5]$/.test(k)) window.dispatchEvent(new CustomEvent(KEY_EVENT, { detail: { type: "demo", index: +k - 1 } }));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);
  return null;
}
