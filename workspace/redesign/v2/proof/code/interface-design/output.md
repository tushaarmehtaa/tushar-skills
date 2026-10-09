The dashboard now works as the flat's home screen. It shows what you owe or are owed, the payments that would clear all balances, each member's balance, and recent activity grouped by date. The build passes and every flow worked in Chrome at 1280, 820 and 375 px wide. Nothing is committed.

**Sample data, not real.** The old page showed "You owe ₹1,842 / You are owed ₹710", which didn't follow from its own expense list, and "3 ways" didn't say who split the bill. I moved the expenses into `lib/flat-fixture.js` and gave each one an explicit list of who shares it. Past payments are stored as separate records instead of a "Settled" flag. All figures are now calculated from that data. The page is labelled "Sample data — viewing as Kabir", and changes are lost when you reload.

**What's on the page**
- **Your position:** "You owe ₹1,365.87", followed by the action that clears it ("Pay Arjun ₹1,365.87"). Owing is shown in amber and being owed in green, and the words say which it is, so the colour isn't the only signal.
- **To settle:** the fewest payments needed to clear everyone's balances, each with a **Record payment** button. A one-line note explains that balances are combined, which is why you might pay someone you never directly owed.
- **Balances:** one line per member, such as "gets back ₹4,915.62" or "owes ₹2,544.88".
- **Recent activity:** expenses and payments together, newest first, grouped by day. Each expense shows what it means for you ("your share ₹710.12", "you lent ₹884.25"). The first 8 entries show, with a "Show all" button for the rest.
- **Add expense:** a pop-up form with description, amount, date, who paid, and checkboxes for who splits it. It blocks submission if nobody is ticked to share the expense.
- **Undo:** recording a payment, deleting an expense and adding one all show a message with Undo, so nothing needs a confirmation step.
- **Empty states:** "You're settled up", "Everyone's square. Nothing to settle." and a first-expense prompt.

The existing purple stays as the colour for buttons and actions. The rest is plain and neutral so the amounts stand out, and numbers line up in columns.

**What I tested**
- The numbers are correct. The four balances sum to zero. Adding ₹4,000 paid by Kabir correctly moves him from −₹1,365.87 to +₹1,634.13.
- **Keyboard:**
  - After recording a payment, focus moves to Undo; after undoing, it moves to the message.
  - The form opens with focus on the first field, Esc closes it, and focus returns to the Add expense button.
  - Screen-reader labels are specific, e.g. "Record ₹1,365.87 paid by you to Arjun".
- **Layout:** no sideways scrolling at any of the three widths.
- **No browser errors** except one 404, which is probably the missing favicon.

**Changes outside the dashboard**
- I removed the old `.stats`, `.ledger` and `.icon-btn` styles, which only the old dashboard used.
- I let the top nav scroll sideways on narrow screens; before, it pushed the whole page 500 px wider on phones.
- The money logic is in `lib/ledger.js` and works in paise, so shares always add up exactly.

**Still missing**
- Nothing is saved, and there's no login. "You" is a fixture setting until real accounts exist.
- Expenses can be deleted but not edited, and only equal splits are supported.
- On phones, Delete takes its own line under each expense, which uses a lot of space.
- I didn't do a screen-reader pass or test 200% zoom.

**Problems I found elsewhere (not changed)**
- `public/vendor/support-widget.js` loads in the page head and blocks the browser for 350 ms before every page appears. Its fixed chat button also covers content on smaller screens; on tablet it covered an expense's Delete button.
- `lib/checkout.js` puts the first seven characters of `STRIPE_SECRET_KEY` into a link, and that file is loaded by a component that runs in the browser. It's a placeholder for now, but it should be fixed before the real key is set.