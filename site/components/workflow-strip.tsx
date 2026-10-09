import { CanvasIcon } from "./canvas-icon";
export function WorkflowStrip({ steps }: { steps: readonly string[] }) {
  return <div className="guide-flow" aria-label="Workflow overview">{steps.map((step, index) => <div key={step}><CanvasIcon name={index === 0 ? "file" : index === steps.length - 1 ? "check" : "arrow"} /><span>{step}</span></div>)}</div>;
}
