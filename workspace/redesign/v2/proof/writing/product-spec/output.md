I've written the spec for shared folders and saved it as `docs/shared-folders-spec.md`. It isn't committed. The repo has no Quillnote code in it, so all the architecture details (stack, routes, existing tables) are assumptions. The eng lead needs to confirm them in week 1.

**Calls I made:**
- **No copies.** There's one real folder, and members get access to it. So "what happens to other people's copies" goes away: deleting the folder removes it for everyone. Support can restore it for 30 days, and members can copy any note into their own notes beforehand.
- **No more "last write wins" for shared notes.** Each save checks which version of the note it started from. If someone else saved in between, the later save becomes a "conflicted copy" next to the original, so no edit is ever lost. Silently losing someone's meeting notes would be the worst way this feature could fail.
- **"Edits show up for everyone" means within about 30 seconds, not real-time.** The app refreshes when you switch back to it and checks for changes while a shared note or folder is open. Real-time co-editing is explicitly left out. If conflicted copies go above 5% of saves, that's the signal to build it.
- **Roles:** owner, editor and viewer. Only the owner manages members or deletes the folder.
- **Web launches first; iOS doesn't block it.** Older iOS versions won't show shared folders at all, so they can't overwrite shared notes. The iOS update would need to go to App Store review by 11/11.
- **Who pays is a setting, not code.** It's built as "owner must be Pro, invitees free" for now and can be changed without a release.

**Plan:**
- **Week 1:** groundwork.
- **Week 2:** sharing works read-only.
- **Week 3:** safe co-editing.
- **Week 4:** managing members and deleting folders.
- **Week 5:** hardening, then the 3 accounts that asked get access on Fri 11/13.
- **Week 6:** top 20 accounts, then everyone if nothing breaks.

There's an on/off switch per account, and turning it off deletes nothing.

**Decisions I couldn't make (owners and deadlines are in §11):**
- **Who pays (founder and sales, by 10/23).** Sales' "free for invitees" idea is untested. The spec tracks how many invitees are new signups so you'll have evidence.
- **Deleting a shared folder (founder, by 10/30).** Is "gone for everyone" acceptable, or should members get a grace period?
- **Owner drops Pro (founder, by 11/6).** The working assumption is that existing shares keep working but no new invites are allowed.
- **iOS staffing and team size (eng lead, by 10/14).** The timeline depends on this. If there's only one backend engineer, the cuts come from the week 4 extras, not from conflict safety.
- **Architecture facts (eng lead, week 1).** Whether subfolders, attachments, export, search or storage limits exist. Each one adds places where shared-note access has to be checked.
- **Member limits (sales, week 2).** The working default is 50 members per folder.
- **Bigger question (founder and sales, before GA).** Do these accounts actually want a full team workspace with admin and billing? I'd validate that during the beta rather than build it now.

The biggest risk is people taking notes in the same meeting at the same time and ending up with lots of conflicted copies. The spec watches that number and treats it as the trigger for real-time editing.