---
name: ui-copy
description: Audit, write, and implement interface language across actions, forms, states, errors, progress, and notifications. Use when product copy must match system behavior and voice.
license: MIT
---

# UI copy

Write interface language that tells people what state they are in, what changed, what is safe, and what they can do next. Match wording to actual product behavior and let tone vary appropriately with consequence.

## Choose mode and scope

- **Audit** — inventory and diagnose copy without editing unless asked.
- **Flow rewrite** — repair one journey across all states and channels.
- **Generate** — create a copy specification for new screens or behavior.
- **Implement** — update source strings, localization resources, or content models and verify the running product.

Define in-scope surfaces, routes, flows, locales, channels, and states. For broad work, sample low-risk routine interactions and high-risk account, permission, payment, privacy, and destructive flows before expanding coverage.

Inspect the codebase and product evidence before asking questions. Recover the primary user, domain terminology, existing voice, product behavior, localization setup, content ownership, and design constraints. Ask only for unresolved product decisions or voice choices that materially alter the copy.

Read [copy quality and state rules](references/copy-quality.md) before the final writing pass or whenever errors, progress, localization, destructive actions, or voice consistency are in scope.

## Build a copy manifest

Search components, route data, constants, locale files, CMS fixtures, server responses, form schemas, validation, toasts, notifications, emails, dialogs, empty states, accessible labels, and alt text.

Record each material source decision:

```text
Surface/channel and flow:
Route/component and source location:
State and audience:
Rendered text:
Message ID, locale, variables, plural/select branches, fallback:
Actual system behavior or destination:
Claim/cause provenance when consequential:
```

Distinguish unique source strings from rendered instances. Exclude tests, logs, and non-user-facing examples unless the request includes documentation copy.

## Model meaningful states

Use only states the product can reach, commonly including:

- initial and first use;
- populated;
- filtered zero results;
- permission-limited or unavailable;
- loading and measurable progress;
- validation and system error;
- partial success or retry;
- success and saved state;
- disabled;
- destructive confirmation and completion.

Do not write one generic empty state or error for semantically different conditions. State an error cause only when the system knows it. If the cause is unknown, name the failed action or object, what remains safe, and a useful recovery path.

## Calibrate voice from evidence

Identify several existing lines that sound right and record formality, warmth, directness, technical density, contractions, casing, humor, and preferred domain terms. Preserve useful quirks and calibrated uncertainty.

Do not default to casual, minimal, playful, or lowercase copy. Marketing warmth should not leak into security, payment, privacy, or destructive flows. Conventional labels such as Back, Close, Done, Retry, or Continue are valid when the surrounding flow makes their consequence clear.

## Write by job

### Actions and confirmations

Name the action and object when consequence matters. Confirmation copy should state the object, consequence, reversibility, and any effect on collaborators or data. Button text and surrounding context work as one unit.

### Errors and validation

State what failed, what remains safe, and what the user can do. Add a cause only when known and useful. Put field-specific validation beside the field and preserve entered data where the product does.

### Empty and unavailable states

Distinguish first use, no matching results, no permission, deleted content, sync delay, and true absence. Explain what normally appears and offer a next step only when one exists.

### Loading and progress

Describe progress only when the system can measure or truthfully identify it. Set expectations for long operations, safe navigation, cancellation, and completion notification when relevant. Skeletons and spinners are presentation choices, not substitutes for state copy.

### Success and status

Show success only after confirmation. Name what changed and the next action only when users benefit from it. Avoid celebratory language for routine or sensitive events.

### Onboarding and help

Guide the next useful action and reveal explanation at the point of need. Do not turn onboarding into a feature tour when the product can lead through a real first task.

## Output contract

### Audit

Deliver manifest coverage, prioritized findings, exact source locations, before/after repairs grounded in behavior, decisions to preserve, and states or channels that could not be inspected.

### Generate or flow rewrite

Organize copy by flow and state rather than a fixed list of fields:

```text
[Flow / screen / state]
Purpose and system behavior:
Visible copy:
Actions and destinations:
Accessible names or announcements:
Variables and localization notes:
Source/content owner:
```

### Implement

Update the correct source of truth, preserve unrelated strings, and report files changed, migrations or message-ID changes, rendered states checked, and unverified channels.

## Verify

1. Compare every consequential line with actual action, destination, system state, and recovery behavior.
2. Exercise representative states in the running product when feasible, including failures and destructive flows.
3. Confirm causes, progress, success, security, privacy, and availability claims are known rather than inferred.
4. Check terminology across navigation, forms, notifications, email, settings, documentation, and support surfaces in scope.
5. Test interpolation, escaping, missing variables, plural/select branches, locale fallback, and pseudo-localized or long translations where available.
6. Inspect wrapping, truncation, responsive overflow, focus order, accessible names, live announcements, and error associations.
7. Run relevant build, typecheck, tests, and localization validation.
8. Read key flows aloud and compare tone at routine versus high-stakes moments.
9. Confirm placeholder copy, TODOs, and fictional proof do not reach production surfaces.
10. Report exact coverage and limitations; do not imply a complete product audit from a partial string scan.
