import {
  siSupabase,
  siGithub,
  siNextdotjs,
  siDodopayments,
  siResend,
  siAgentskills,
} from "simple-icons";

type IconDef = { path: string; hex: string };

const LOGOS: Record<string, { icon: IconDef; color?: string }> = {
  "payments-with-dodo":      { icon: siDodopayments },
  "email-with-resend":       { icon: siResend },
  "readme":                  { icon: siGithub,       color: "#ffffff" },
  "changelog":               { icon: siGithub,       color: "#ffffff" },
  "supabase":                { icon: siSupabase },
  "performance-diagnosis":   { icon: siNextdotjs,    color: "#ffffff" },
};

export function SkillLogo({
  slug,
  className = "h-3.5 w-3.5",
}: {
  slug: string;
  className?: string;
}) {
  if (slug === "demo-video") {
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
