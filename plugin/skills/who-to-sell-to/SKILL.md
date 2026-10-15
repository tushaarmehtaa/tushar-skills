---
name: who-to-sell-to
description: Find your ideal customer profile from real paid and lost deals, with a report of triggers, disqualifiers and a 90-day plan. Use when deciding who to sell to, or why deals stall or don't renew.
license: MIT
compatibility: Works best with web search or page fetching to research the company and named customers. Without it, the skill asks the founder for those facts. The HTML report needs filesystem access; chat-only runs publish the report as a doc or page.
---

# Who to sell to

Turn a founder's actual deals into an ICP they can sell against. The interview is the product: one topic at a time, evidence before opinions, a pattern named after every answer. The report is the record of what the interview found.

An ICP built from guesses describes who the founder wishes would buy. One built from paid, renewed and lost deals describes who actually buys and when. Keep pulling the conversation back to the second kind.

## Choose the mode

State the mode you picked in one line, so the founder can correct it.

- **Interview** (default): no ICP exists, or the founder wants a fresh start.
- **Fast path**: the founder pastes a deals list, CRM export, invoice list or notes. Build the evidence table from it, then ask only about the gaps (usually why deals were lost and who approved the money).
- **Review**: the founder shares an existing ICP or positioning doc. Read it, then ask only the questions that test its weakest claims.
- **Refresh**: an earlier `icp-report.html` or ICP doc exists. Ask which deals happened since, update the evidence table, and say which ICP lines changed and why.

## Before the first question

1. **Read what is already there**: the conversation, attached files, the working directory (an earlier report, a pricing page, a deals file), memory and connected tools. Never ask for something you can find.
2. **Check for web access.** If you have web search or page fetching, research the company and every customer or prospect the founder names before asking about them: what they do, who their users are, stage and funding. Scrape only public pages. Never fetch a private page or log in on the founder's behalf.
   - Without web access, say so in one line and ask for the three facts you need instead: what the company sells, to whom, and the names of its last paying customers.
   - Label anything researched as "found online" and anything told as "you said". Research can be stale or wrong; the founder corrects it.
3. **Read [references/frameworks.md](references/frameworks.md) once**, so follow-ups draw on the right ideas.
4. **Open with a short briefing, then ask question 1.** In one message: what you found about the company (two to four lines, so the founder can fix it), how this works (about 10 to 15 questions, one at a time, a designed report at the end, 20 to 30 minutes), and the shortcut ("paste a deals list or CRM export any time and I'll skip ahead"). If something found online contradicts what the founder says, ask before assuming either is right.

## Run the interview

Use [references/question-bank.md](references/question-bank.md). Adapt it to what you already know and skip what is answered, but keep the stage order: paying customers, then triggers, lost deals and buyers, then acquisition, then the second ICP if there is one, then content, then goals and capacity.

After every answer:

1. **Name the pattern** in two to four sentences, tied to the specific deal. For example: "They loved the pilot and still didn't renew, and the person who signed it left the company a month later. That's your sharpest filter: the buyer has to be someone who stays."
2. **Show the running ICP** once there is enough to state it, as a compact card of the five fields. Update it as answers change it.
3. **Ask one question.** Several sub-parts about the same deal are fine. Two different topics are not.

### Make it easy to answer

- Offer two to four short options where the answer is a choice (excited, polite, still deciding), with room for "something else".
- Say which question this is and how far along you are ("Question 4 of about 12").
- Accept rough numbers, voice-note style rambling and "I don't know". Turn "I don't know" into a named open question and move on.
- When the founder says "skip", skip. When they say "that's enough", go to the report.

### Rules that make the interview work

- **One topic per turn.** A list of questions gets a list of shallow answers.
- **Evidence over opinion.** Ask what happened, not what they think would happen. Money paid, renewals, introductions and urgency count. "They loved it" counts only when something followed it.
- **Push back on vague answers, kindly and specifically.** "AI companies" or "SMBs" is a category, not an ICP. Name what is missing and ask for it.
- **Say so when the founder is wrong, with their own evidence.** If they say contact level doesn't matter, show the deal that stalled with a junior contact.
- **Separate proven from assumed.** Mark claims with no evidence yet as hypotheses in the report, with what would prove them.
- **When the founder gives context instead of an answer**, acknowledge it, say what it adds, and ask the question again.
- **Watch the quiet details**: who approved the money, how the first meeting happened, what happened right before they bought. Those usually decide the ICP.
- **Do not invent.** Never fill a field with a plausible guess. Write the open question.

### When to stop

Stop once every field of the ICP card has evidence or a named open question, and you know the 90-day goal and weekly hours. That is usually 10 to 15 questions. If the founder stops early, write the report with what you have and list the gaps.

## Deliver the report

Read [references/report-guide.md](references/report-guide.md) before writing. It defines each section and what makes it good.

Choose the format by environment:

- **Filesystem available** (Claude Code, Codex, Cursor): copy `assets/icp-report.html` to `icp-report.html` in the working directory, or a path the founder names. Replace every example value with this founder's content. Open it in the browser if you can.
- **Chat only** (Claude app, no files): create a doc or publish a page with the same sections. If the founder wants a file, produce the HTML.

Working with the HTML template:

- It is a finished example report for a fictional company called **Fieldwork**. Keep the structure, classes and styles. Replace all content. Add or remove table rows and list items as needed.
- The page opens on the ICP card and a short "This week" box. Every other section is a collapsed `<details>` row whose summary line is that section's one-sentence conclusion. Deals, sales-plan blocks and content channels nest one level deeper. Write every summary line as a finding, never a label.
- Delete any section with no content rather than leaving placeholders. The ICP card at the top is required.
- Keep the inline expand-all script at the bottom. The page must still read correctly with it removed.
- When finished, search the file for `Fieldwork`, `Example` and `data-example`. Any hit means example content is left. Replace it.
- Keep it self-contained: inline CSS only, no external fonts, scripts or images, so it renders the same everywhere and prints cleanly to PDF.

### Check before handing over

1. **Traceability.** Every ICP card line points to a deal in the evidence table, or carries "(to test)".
2. **Confidentiality.** Point out anything sensitive: customer names with prices, lost deals named, salaries, someone else's personal details. Offer an anonymized copy if the founder will share it publicly.
3. **Rendered output.** If you can open the file, check that it loads, the card reads at phone width, and no example text remains.

## After the report

End with one short paragraph naming the single most important thing to do this week. Then offer to refine a section or run the next step, such as a target list built from the ICP's triggers or outreach drafted with the `cold-outreach` skill.
