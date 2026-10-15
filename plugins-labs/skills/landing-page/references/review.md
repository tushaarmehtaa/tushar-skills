# Landing-page review

Use this reference for audit mode or the final implementation review.

## Inspect the rendered page

Review the live or locally rendered page at representative widths and states. When rendering is unavailable, label visual findings provisional.

Record for each finding:

- route, viewport, state, and evidence;
- the visitor question that remains unanswered;
- the source component or content owner when known;
- the likely consequence for comprehension, trust, action, accessibility, or performance;
- the smallest coherent repair and how to verify it.

## Review lenses

### Comprehension

- Can the intended visitor identify the product, consequence, and next step from the first viewport?
- Does terminology match the product and the visitor's language?
- Does each section add a new claim, mechanism, proof, objection answer, or action?

### Trust

- Is every statistic, testimonial, comparison, badge, and availability claim traceable?
- Does product evidence show realistic content and limitations?
- Are pricing, privacy, compatibility, and operational constraints visible where they affect the decision?

### Action

- Is there one clear primary action with an honest destination?
- Are form requirements, commitment, success, failure, and recovery states clear?
- Do secondary paths help the same decision rather than compete with it?

### Interface

- Does the hierarchy follow the page argument rather than a stock section pattern?
- Does the page preserve the existing brand and component language?
- Do narrow layouts, keyboard use, zoom, contrast, focus, and reduced motion remain usable?

### Performance and discovery

- Is the primary content server-rendered or otherwise reliably available to the intended audience?
- Is the likely LCP element identified and measured rather than guessed?
- Are title, description, canonical, share preview, structured data, and analytics accurate for this route?

## Severity

- **Blocker:** prevents the primary action, makes a consequential claim unsafe, or causes a serious accessibility failure.
- **High:** obscures the proposition, proof, price, commitment, or conversion path.
- **Medium:** adds friction, weakens hierarchy, or creates avoidable uncertainty.
- **Low:** polish whose repair does not displace higher-value work.

## Audit output

Lead with the verdict and the top three causes. Provide an evidence table, preserve strong existing decisions, and end with a sequenced repair plan. Do not rewrite or redesign unless the user requested changes.
