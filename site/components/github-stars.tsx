import { Suspense } from "react";

async function StarCount() {
  try {
    const res = await fetch("https://api.github.com/repos/tushaarmehtaa/tushar-skills", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const stars: number = data.stargazers_count;
    return (
      <span className="tabular-nums">
        {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
      </span>
    );
  } catch {
    return null;
  }
}

export function GithubStars() {
  return (
    <Suspense fallback={null}>
      <StarCount />
    </Suspense>
  );
}
