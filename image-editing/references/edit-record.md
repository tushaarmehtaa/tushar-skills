# Edit record

Use this record for a sequence of edits. Paths below are illustrative; replace them with the supplied files. Keep the original and every approved intermediate output.

```yaml
identity_reference: references/product-original.png
edit_base: outputs/revision-01-approved.png
style_reference: null
requested_change: Replace the background with warm gray.
preserve:
  - Bottle silhouette and cap geometry
  - Label placement and all existing text
  - Previously approved front-facing composition
exact_text: "NORTH / 250 ml"
output: outputs/revision-02.png
approval: pending
```

For each returned image, record:

| Check | Result | Evidence |
| --- | --- | --- |
| Requested change | pass / fail / unchecked | What changed in the actual image |
| Identity | pass / fail / unchecked | Comparison with original reference |
| Exact copy | pass / fail / unchecked | Visual check and optional OCR |
| Prior edits | pass / fail / unchecked | Comparison with approved base |

A useful-looking draft can still fail a required constraint. Keep it labeled as a draft; do not use it as the next approved base. An inspection pass is not user approval.
