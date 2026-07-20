import {
  siSupabase,
  siGithub,
  siClaudecode,
  siNextdotjs,
  siDodopayments,
  siResend,
  siAgentskills,
} from "simple-icons";

type IconDef = { path: string; hex: string };

const LOGOS: Record<string, { icon: IconDef; color?: string }> = {
  "dodo-webhook":            { icon: siDodopayments },
  "ship-email":              { icon: siResend },
  "readme":                  { icon: siGithub,       color: "#ffffff" },
  "changelog":               { icon: siGithub,       color: "#ffffff" },
  "supabase":                { icon: siSupabase },
  "init-claude-md":          { icon: siClaudecode },
  "debug-perf":              { icon: siNextdotjs,    color: "#ffffff" },
  "pricing-page":            { icon: siDodopayments },
};

export function SkillLogo({
  slug,
  className = "h-3.5 w-3.5",
}: {
  slug: string;
  className?: string;
}) {
  if (slug === "remotion-video") {
    return (
      <img
        src="/brands/remotion.svg"
        alt=""
        aria-hidden="true"
        className={className}
      />
    );
  }

  const match = LOGOS[slug] ?? { icon: siAgentskills, color: "#737373" };

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
