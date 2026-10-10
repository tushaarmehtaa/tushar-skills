import { Suspense } from "react";

async function StarCount({ min }: { min: number }) {
  try {
    const res = await fetch("https://api.github.com/repos/tushaarmehtaa/tushar-skills", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const stars: number = data.stargazers_count;
    if (stars < min) return null;
    return (
      <span className="tabular-nums">
        {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
      </span>
    );
  } catch {
    return null;
  }
}

/** Renders nothing below `min`, so a small count never reads as a weak signal. */
export function GithubStars({ min = 0 }: { min?: number }) {
  return (
    <Suspense fallback={null}>
      <StarCount min={min} />
    </Suspense>
  );
}
