import { getVercelOidcToken } from "@vercel/functions/oidc";

const SOURCE = "tushaarmehtaa/tushar-skills";
const ENDPOINT = `https://www.skills.sh/api/v1/skills?source=${SOURCE}&per_page=500`;

export type InstallStats = { total: number; bySlug: Record<string, number> };

async function token(): Promise<string | null> {
  try {
    return await getVercelOidcToken();
  } catch {
    return process.env.VERCEL_OIDC_TOKEN ?? null;
  }
}

// Install counts come from skills.sh telemetry. Requires a Vercel OIDC token,
// which exists on Vercel and after `vercel env pull`. Anywhere else this
// returns null and the UI omits the count.
export async function getInstallStats(): Promise<InstallStats | null> {
  const bearer = await token();
  if (!bearer) return null;
  try {
    const res = await fetch(ENDPOINT, {
      headers: { Authorization: `Bearer ${bearer}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: Array<{ slug: string; installs: number }> };
    if (!Array.isArray(body.data)) return null;
    const bySlug: Record<string, number> = {};
    let total = 0;
    for (const row of body.data) {
      if (typeof row.installs !== "number") continue;
      bySlug[row.slug] = row.installs;
      total += row.installs;
    }
    return { total, bySlug };
  } catch {
    return null;
  }
}

export function formatInstalls(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}
