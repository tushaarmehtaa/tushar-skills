"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export function ResultsBack() {
  const [href, setHref] = useState("/");
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("skills-return");
      if (saved && (saved === "/" || saved.startsWith("/?"))) setHref(saved);
    } catch {}
  }, []);
  return (
    <Link href={href} className="text-button mb-6">
      ← Back to results
    </Link>
  );
}
