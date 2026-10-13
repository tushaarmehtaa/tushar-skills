"use client";

import { ExcerptViz, ImgWipe, MfViz, OgPair, Pane, SingleFrame, SlopViz, VerdictViz, type Reason } from "./visuals";

export interface SkillRunProps {
  slug: string;
  request: string;
  headline: string;
  chips: string[];
  meta: string[];
  images: { before: string; after: string } | null;
  reasons: Reason[];
  excerpt: string[];
}

/** The recorded run, shown the way the homepage shows its five: request, skill, changes, visible result. */
export function SkillRun(p: SkillRunProps) {
  const viz = (go: boolean) =>
    p.slug === "remove-ai-slop" ? <SlopViz ctl={{ active: go }} />
    : p.slug === "mobile-first" ? <MfViz />
    : p.slug === "deploy-check" ? <VerdictViz reasons={p.reasons} go={go} />
    : p.images ? <ImgWipe before={p.images.before} after={p.images.after} tl={p.slug === "image-editing" ? "your banner" : "before"} tr={p.slug === "image-editing" ? "the result" : "after"} ctl={{ active: go }} />
    : p.slug === "social-sharing" ? <OgPair a="/proof/social-sharing/og-home.jpg" b="/proof/social-sharing/og-pricing.jpg" />
    : p.slug === "demo-video" ? <SingleFrame src="/proof/demo-video/frame.jpg" />
    : <ExcerptViz items={p.excerpt} />;
  return (
    <div className="stage sk-stage">
      <Pane on project="tallyroom" d={{ slug: p.slug, ask: p.request, said: p.headline, ok: p.chips, meta: p.meta, viz }} />
    </div>
  );
}
