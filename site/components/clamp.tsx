"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Shows the top of long content with a fade, and opens fully on request or when a hash targets something inside. */
export function Clamp({ children, label }: { children: ReactNode; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function reveal() {
      const id = decodeURIComponent(location.hash.slice(1));
      if (id && ref.current?.querySelector(`[id="${CSS.escape(id)}"]`)) setOpen(true);
    }
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);

  return (
    <div className="clamp" data-open={open} ref={ref}>
      <div className="clamp-body" inert={!open || undefined}>{children}</div>
      {!open && (
        <button type="button" className="clamp-open" onClick={() => setOpen(true)}>
          {label}
        </button>
      )}
    </div>
  );
}
