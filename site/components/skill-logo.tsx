import {
  siSupabase,
  siStripe,
  siVercel,
  siGithub,
  siGoogle,
  siPosthog,
  siAnthropic,
  siClerk,
  siNextdotjs,
  siDodopayments,
  siResend,
  siMixpanel,
} from "simple-icons";

type IconDef = { path: string; hex: string };

const LOGOS: Record<string, { icon: IconDef; color?: string }> = {
  "deploy-check":            { icon: siVercel,       color: "#ffffff" },
  "add-analytics":           { icon: siPosthog },
  "ship-credits":            { icon: siStripe },
  "dodo-webhook":            { icon: siDodopayments },
  "ship-email":              { icon: siResend },
  "readme":                  { icon: siGithub,       color: "#ffffff" },
  "changelog":               { icon: siGithub,       color: "#ffffff" },
  "model-audit":             { icon: siAnthropic },
  "seo-ready":               { icon: siGoogle,       color: "#4285f4" },
  "aeo-ready":               { icon: siGoogle,       color: "#4285f4" },
  "wire-auth":               { icon: siClerk },
  "supabase":                { icon: siSupabase },
  "init-claude-md":          { icon: siAnthropic },
  "debug-perf":              { icon: siNextdotjs,    color: "#ffffff" },
  "pricing-page":            { icon: siStripe },
  "segment-users":           { icon: siMixpanel },
  "mvp-spec":                { icon: siAnthropic },
  "product-brief":           { icon: siAnthropic },
  "make-skill":              { icon: siAnthropic },
  "economics":               { icon: siAnthropic },
};

const FAVICON_LOGOS: Record<string, string> = {
  "remotion-video": "https://www.remotion.dev/img/logo-small.png",
};

export function SkillLogo({
  slug,
  className = "h-3.5 w-3.5",
}: {
  slug: string;
  className?: string;
}) {
  const favicon = FAVICON_LOGOS[slug];
  if (favicon) {
    return (
      <img
        src={favicon}
        alt=""
        aria-hidden="true"
        className={className}
        style={{ objectFit: "contain" }}
      />
    );
  }

  const match = LOGOS[slug];
  if (!match) return null;

  const color = match.color ?? `#${match.icon.hex}`;

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={color}
      aria-hidden="true"
    >
      <path d={match.icon.path} />
    </svg>
  );
}
