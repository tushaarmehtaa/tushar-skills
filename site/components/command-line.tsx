import { CopyButton } from "./copy-button";

export function CommandLine({
  command,
  agent,
  skill,
  trackInstall = false,
}: {
  command: string;
  agent: string;
  skill: string;
  trackInstall?: boolean;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-[family-name:var(--font-mono)] text-xs sm:grid-cols-[auto_minmax(0,1fr)_auto]">
      <span className="select-none text-[var(--color-accent)]">$</span>
      <code className="min-w-0 break-all leading-relaxed text-[var(--color-heading)]">{command}</code>
      <CopyButton
        text={command}
        className="col-start-2 w-fit sm:col-start-auto"
        analytics={trackInstall ? { name: "install_copy", properties: { agent, skill } } : undefined}
      />
    </div>
  );
}
