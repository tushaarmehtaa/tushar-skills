"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ComponentProps, MouseEvent } from "react";

type LinkProps = ComponentProps<typeof Link>;

export function TrackedLink({
  eventName,
  agent,
  skill,
  onClick,
  ...props
}: LinkProps & {
  eventName: "skill_open" | "guide_open" | "zip_download" | "guide_skill_open";
  agent: string;
  skill: string;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    track(eventName, { agent, skill });
    onClick?.(event);
  }

  return <Link {...props} onClick={handleClick} />;
}
