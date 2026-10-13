import logos from "@/lib/brand-logos.json";

type Props = { className?: string; fill?: string };

export const ClaudeCodeMark = ({ className, fill = "#D97757" }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill={fill} d={logos.cc} /></svg>
);
export const CursorMark = ({ className, fill = "currentColor" }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill={fill} d={logos.cu} /></svg>
);
export const OpenAIMark = ({ className, fill = "currentColor" }: Props) => (
  <svg className={className} viewBox="146.694 227.042 267.198 264.812" aria-hidden="true"><path fill={fill} d={logos.oa} /></svg>
);
export const GitHubMark = ({ className, fill = "#0A0A0A" }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill={fill} d={logos.gh} /></svg>
);
export const XMark = ({ className, fill = "#0A0A0A" }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path fill={fill} d={logos.x} /></svg>
);

export function AgentMark({ agent, className }: { agent: "claude-code" | "codex" | "cursor"; className?: string }) {
  if (agent === "claude-code") return <ClaudeCodeMark className={className} />;
  if (agent === "codex") return <OpenAIMark className={className} />;
  return <CursorMark className={className} />;
}

export function SlashMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0A0A0A" />
      <path d="M10.5 24.5 L21.5 7.5" stroke="#F59E0B" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}
