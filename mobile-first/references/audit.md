# Responsive audit

Use this procedure before repairing an existing interface and again afterward. Adapt the matrix to the product's supported environments.

## Measurement matrix

Capture at least 320px, 375px, 768px, and 1440px widths when the application supports the web. Record browser, device scale, theme, authentication state, and whether the data is real or fixture content.

At each relevant width inspect:

1. document `scrollWidth` versus viewport width;
2. total page height as context, not a pass/fail score;
3. each section or major region's height and dominant content;
4. clipped, overlapping, truncated, or off-screen elements;
5. line wrapping for headings, controls, URLs, code, and long labels;
6. navigation, dialogs, menus, forms, errors, and software-keyboard interaction;
7. fixed or sticky elements that obscure content or focused controls.

## Distinguish overflow correctly

- **Document-level overflow:** normally a defect for reading content. Identify the exact element expanding the layout.
- **Contained two-dimensional region:** potentially valid for a table, diagram, comparison, or browseable panels. The container must stay within the viewport and expose an understandable scroll affordance.
- **Decorative bleed:** acceptable only when it cannot create a scrollbar, hide information, or capture interaction.

Do not flag descendants of a correctly contained scroll region merely because their bounding boxes extend past the viewport.

## Interaction and accessibility

List custom buttons, links outside running prose, form controls, and icon controls that are smaller than 24×24 CSS pixels or fail the WCAG spacing test. Separately identify controls below the project's ergonomic target, often 44×44, without calling that WCAG AA failure.

Measure text contrast against the background that actually renders. Test keyboard order, visible focus, focus not obscured by sticky UI, names and states, 200% text resize, and the 320 CSS-pixel reflow condition.

Emulate `prefers-reduced-motion: reduce`. List animations and verify that content remains visible and every essential state change remains understandable.

## Content and action inventory

Record:

- distinct CTA labels and destinations;
- content whose order changes by breakpoint;
- content hidden at any width and the alternative access path;
- dense regions that stack into long repetition;
- tasks that require comparison, scanning, or simultaneous context.

## Output table

| Finding | Width/state | Measurement | User consequence | Source | Repair | Verification |
| --- | --- | --- | --- | --- | --- | --- |

Rank findings by task failure, information loss, inaccessible interaction, unintended document overflow, obscured focus, and then avoidable friction. Do not rank purely by page height.
