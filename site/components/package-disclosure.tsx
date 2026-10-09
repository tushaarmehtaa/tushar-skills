"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function PackageDisclosure({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function reveal() {
      if (location.hash === "#package-details" && ref.current) {
        ref.current.open = true;
        ref.current.querySelector("summary")?.focus({ preventScroll: true });
        ref.current.scrollIntoView({ block: "start" });
      }
    }
    const click = (event: MouseEvent) => {
      if ((event.target as Element).closest?.('a[href="#package-details"]')) {
        if (ref.current) ref.current.open = true;
      }
    };
    document.addEventListener("click", click);
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => {
      window.removeEventListener("hashchange", reveal);
      document.removeEventListener("click", click);
    };
  }, []);
  return (
    <details ref={ref} id="package-details" className="package-disclosure">
      <summary>Package details</summary>
      {children}
    </details>
  );
}
