# Responsive standards and evidence

Consult these sources before claiming accessibility or performance compliance. Re-check maintained sources when a release depends on the exact requirement.

## Accessibility

- [WCAG 2.2 — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): Level AA expects content to work at a 320 CSS-pixel equivalent without two-dimensional scrolling, except content such as data tables, diagrams, maps, and interfaces whose meaning requires two dimensions. Contain exceptions so unrelated content still reflows.
- [WCAG 2.2 — Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): Level AA requires a 24×24 CSS-pixel target or a qualifying spacing/equivalent/inline/user-agent/essential exception.
- [WCAG 2.2 — Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html): Level AAA uses 44×44 CSS pixels with exceptions. A project may adopt 44×44 as an ergonomic target without mislabeling smaller qualifying controls as AA failures.
- [WCAG 2.2 — Contrast](https://www.w3.org/TR/WCAG22/#contrast-minimum): Level AA requires 4.5:1 for ordinary text and 3:1 for large-scale text, with defined exceptions.
- [WCAG 2.2 — Focus Not Obscured](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum): sticky and fixed UI must not entirely hide the keyboard-focused component.

## Platform behavior

- [MDN viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Values_and_units): `svh`, `lvh`, and `dvh` represent different viewport states. Select the unit from the interaction instead of replacing `vh` mechanically.
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion): respect the user's operating-system motion preference and preserve a complete static state.

## Usability evidence

- [Nielsen Norman Group iPad usability report](https://media.nngroup.com/media/reports/free/iPad_App_and_Website_Usability_2nd_Edition.pdf): contained horizontal browsing can work when its affordance is clear. Treat this as historical usability evidence, not a mandate for carousels.
- [GOV.UK design principles](https://www.gov.uk/guidance/government-design-principles): start with user needs, design with data, understand context, and remain consistent without forcing uniformity.

## Provenance

This package reconstructs Tushar Mehta's earlier `mobile-first` draft. It retains the useful “choose a mobile-appropriate primitive” thesis and measurement discipline while removing universal carousel, fixed-CTA, and page-height prescriptions and restoring the missing audit, patterns, and standards resources.
