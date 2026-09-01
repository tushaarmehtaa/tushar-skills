# Responsive layout patterns

Use these as candidate transformations after measurement. Choose from content relationships; none is a universal mobile replacement.

## Multi-column content

- **Stack** when items form a sequence or each needs full-width reading.
- **Wrap into fewer columns** when cards are independent and comparison is not essential.
- **Contained browse row** when a small set is independently meaningful and partial next-item visibility can communicate scrollability.
- **Selector plus one detail panel** when many options share a large detail body.
- **Compact comparison** when differences must remain simultaneous; reduce decoration before removing information.

Avoid turning ordered instructions, accessibility-critical content, or more than a small browseable set into a swipe-only carousel.

## Tables and dense data

Preserve the table when row-to-column relationships matter. First try concise headers, sensible column priorities, wrapping, sticky row labels, and a contained scroll region. Provide a stacked or detail view only when it preserves the same meaning and actions.

Name scroll regions, make them keyboard reachable when needed, retain visible focus, and give touch and keyboard users a cue that more content exists. Never let a minimum-width table expand unrelated page content.

## Split layouts and heroes

Choose mobile order from the task, not DOM convenience. Product evidence may belong before supporting copy when recognition is the main uncertainty; the action may belong before media when the visitor already understands the product.

Keep source order semantic. Use CSS visual reordering sparingly because keyboard and assistive-technology order generally follows the DOM.

## Navigation

Keep essential destinations and the current location available. A compact menu is valid when it has an accessible name, visible trigger state, focus management, escape behavior, and a usable open layout.

A persistent bottom action is appropriate only when the action remains relevant throughout the task, does not obscure content or focus, accounts for safe areas, and has product approval. It is not required merely because the navigation collapsed.

## Viewport height and fixed UI

- Use ordinary document flow when content should define height.
- Use `100svh` when a panel must fit within the smallest viewport with browser chrome present.
- Use `100dvh` when live toolbar resizing is intended and tested for jank.
- Use safe-area environment insets for edge-fixed controls on devices that expose them.

Test dialogs, drawers, onboarding panels, and input screens with browser chrome and the software keyboard visible.

## Intrinsic CSS repairs

Before adding a breakpoint, check:

- grid tracks that need `minmax(0, 1fr)`;
- flex or grid children that need `min-width: 0`;
- long strings that need `overflow-wrap: anywhere` or an appropriate code scroller;
- media missing `max-width: 100%` and intrinsic dimensions;
- fixed widths that should be capped with `min()`, `max()`, or `clamp()`;
- absolute positioning that detached content from document flow;
- component containers that could use container queries instead of page-level device assumptions.
