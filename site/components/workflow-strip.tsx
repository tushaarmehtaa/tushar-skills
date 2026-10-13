/** Numbered steps, same [1] [2] [3] marks as the homepage strip. */
export function WorkflowStrip({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="guide-flow" aria-label="Workflow overview">
      {steps.map((step, index) => (
        <li key={step}>
          <b aria-hidden="true">[{index + 1}]</b>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}
