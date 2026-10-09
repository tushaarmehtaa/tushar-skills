import { CanvasIcon } from "./canvas-icon";
import { SKILL_DISPLAY } from "@/lib/canvas";

/** Illustrative concepts, never presented as results from a skill run. */
export function SkillVisual({ slug, detail = false }: { slug: string; detail?: boolean }) {
  const kind = slug === "interface-design" ? "interface" : slug === "ai-product-development" ? "ai" : slug === "user-insights" ? "research" : "workflow";
  const display = SKILL_DISPLAY[slug];
  return <div className={`skill-visual visual-${kind}${detail ? " visual-detail" : ""}`} aria-hidden="true">
    <div className="visual-scene">
      {kind === "interface" ? <div className="example-workspace">
        <div className="example-nav"><b>morrow</b><span>Workspace / Projects</span><i>AL</i></div>
        <div className="example-heading"><div><strong>A little more focus.</strong><p>Make room for your best work.</p></div><span>New project +</span></div>
        <div className="example-panels"><div><b>Website refresh</b><p>Design in progress</p><div className="example-progress"><i /></div></div><div><b>This week</b><p>○ Review onboarding</p><p>○ Share the prototype</p></div></div>
      </div> : kind === "ai" ? <div className="example-chat"><div className="example-question">What did we learn from the interviews?</div><div className="example-answer">People want a clear next step.<br />The biggest friction is getting started.<div><span>↗ Interview 03</span><span>↗ Interview 07</span></div></div></div> : kind === "research" ? <div className="example-research"><span>Research brief / 01</span><strong>Who needs this<br />enough to switch?</strong><div><p>Audience<br />Independent product teams</p><p>Next step<br />Test the riskiest assumption</p></div><small>Evidence before investment</small></div> : <div className="example-flow"><CanvasIcon name={display?.icon ?? "file"} /><div>{(display?.flow ?? "Context → Workflow").split(" → ").map((step, index) => <span key={step}>{index > 0 && <CanvasIcon name="arrow" />}<b>{step}</b></span>)}</div></div>}
    </div>
    <div className="visual-thumbnail">
      {kind === "interface" ? <svg viewBox="0 0 96 96"><rect x="13" y="19" width="70" height="57" rx="5" fill="white" stroke="#aabbb0"/><path d="M13 32h70" stroke="#aabbb0"/><rect x="21" y="40" width="25" height="26" rx="3" fill="#dce5d0"/><rect x="51" y="40" width="23" height="8" rx="2" fill="#345847"/><path d="M51 55h23m-23 7h16" stroke="#9cab9d"/></svg> : kind === "ai" ? <svg viewBox="0 0 96 96"><rect x="12" y="18" width="62" height="26" rx="8" fill="#52667e"/><path d="M21 28h42m-42 7h30" stroke="white"/><rect x="25" y="51" width="59" height="29" rx="8" fill="white"/><path d="M34 61h40m-40 7h29" stroke="#52667e"/></svg> : kind === "research" ? <svg viewBox="0 0 96 96"><g transform="rotate(-7 48 48)"><rect x="22" y="13" width="55" height="72" rx="2" fill="white"/><path d="M30 28h31m-31 9h38m-38 7h34m-34 10h36" stroke="#69745e" strokeWidth="2"/><rect x="30" y="64" width="33" height="9" fill="#dce5bf"/></g></svg> : <CanvasIcon name={display?.icon ?? "file"} />}
    </div>
  </div>;
}
