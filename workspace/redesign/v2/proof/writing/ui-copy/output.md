I rewrote all the copy in `src/InviteTeam.tsx` so it describes what `api.ts` actually does. The repo has no build setup or tests, so I haven't typechecked or rendered any of it.

| Where | Before | After |
|---|---|---|
| Heading | Team Management | Invite your team |
| Intro | Please enter the emails of users… | We'll email each person an invite. Invites expire after 7 days, and you're only billed for a seat when someone accepts. |
| Input | placeholder "Enter emails", no label | A visible "Email addresses" label, an example placeholder, and a hint: separate addresses with commas or spaces, up to 20 at a time |
| Seat count | 3 seats remaining (said "1 seats" when one was left) | 3 seats left on your plan / 1 seat left on your plan |
| Button | Submit / Loading... | Send invites / Send 3 invites (counts as you type) / Sending invites… |
| Success | Success! | Sent 3 invites. They expire in 7 days. (`sentCount` was stored before but never shown) |
| Too many addresses | Error: Invalid input. | You've entered 24 addresses. You can send up to 20 at a time, so remove some and send the rest afterward. |
| Not enough seats | Oops! Something went wrong. | Not enough seats. You're inviting 5 people, but your plan has 3 seats left. No invites were sent. Remove some addresses or add seats to your plan. |
| Any other failure | An error has occurred. Please try again later. | Couldn't send invites. If any address isn't valid, none are sent, so check the list and try again. Your addresses are still here. |
| Empty state | No data. | Removed. It showed before anything was typed and told people nothing; the label and hint now cover that state. |

**One behaviour change:** the last error message used to appear only for the code `UNKNOWN`. `api.ts` says nothing is sent if any address fails validation, but it doesn't say what error code that returns. Before, any code other than the three handled ones showed no message at all, so the screen went silent. The fallback message now covers every error that isn't too-many or seats-exceeded.

**Accessibility:** the success message is announced to screen readers when it appears and errors are announced immediately (`role="status"` and `role="alert"`), and the hint is linked to the text box.

**To confirm before shipping:**
- "No invites were sent" for the seats error assumes the server rejects the whole batch. The comment in `api.ts` ("would exceed") suggests this but doesn't say it outright.
- "Add seats to your plan" assumes users can do that. If there's an upgrade page, a link there would help.
- The button can still be pressed with no addresses entered. The label just says "Send invites" in that case; you may want to disable it.