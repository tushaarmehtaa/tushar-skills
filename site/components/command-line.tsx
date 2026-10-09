import { CommandBlock } from "./command-block";

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
  return <CommandBlock command={command} analytics={trackInstall ? { agent, skill } : undefined} className="command-inline" />;
}
