The blank pause comes from the SupportDesk chat widget script. It's loaded in the page `<head>` and freezes the browser for about 350ms before anything can be drawn. Removing it in a test cut the time to first content roughly in half.

**The cause.** Commit `c47d313` ("Add SupportDesk chat widget", Oct 5) added `<script src="/vendor/support-widget.js">` to `app/layout.jsx:7`. It's a plain script tag with no `async` or `defer`, so the browser stops building the page until the script finishes. The script itself (`public/vendor/support-widget.js:6-9`) then deliberately loops for 350ms before it does anything:

```js
while (Date.now() - start < 350) { ... }
```

All it does after that is add a chat button once the page has loaded. Because it's in the root layout, every page pays this cost, not just the homepage.

**How I measured it.** I ran a production build and loaded the homepage in headless Chrome set up like a phone: 390px wide screen, CPU slowed 4×, network limited to about 1.6 Mbps. I loaded it 5 times per setup and took the middle result (times in ms):

| Setup | First content on screen | Main content on screen | HTML parsed | Fully loaded |
|---|---|---|---|---|
| Current site | **788** | 780 | 755 | 16,758 |
| Widget script blocked | **404** | 404 | 394 | 16,747 |
| Hero image blocked | 768 | 768 | 756 | 1,218 |

- Blocking the widget cut first paint by about 385ms. The browser's slow-task log showed a single 350ms task that goes away when the widget is blocked.
- The server isn't the problem. The homepage is pre-built as a static page and the server responded in about 13ms.

**A second, smaller problem: the hero screenshot.** `public/hero-dashboard.png` is a 3.1 MB PNG (2000×1250), added in `a0ab97a` and used as a plain `<img>` in `app/page.jsx:20`. On a phone it sits below the first screen, so it doesn't cause the blank pause. But it takes most of the 16.7s full load and uses up the bandwidth on a slow connection. Blocking it brought full load down from 16.7s to 1.2s.

**Fixes, in priority order (I haven't changed anything):**
1. In `app/layout.jsx`, load the widget with `next/script` and `strategy="lazyOnload"` (or at least `afterInteractive`) instead of a plain tag in `<head>`. Separately, ask SupportDesk about the 350ms wait in their loader, which still costs time after the page appears.
2. Serve the screenshot through `next/image` with a `sizes` setting so phones get a small WebP/AVIF version, or at least re-export it as a compressed WebP at a sensible width.

**How confident I am.** I'm confident the widget is the main cause: it's the only thing in the 350ms slow task, and blocking it alone halved first paint. These numbers come from a simulated phone, not real users. Field data from real phones would confirm the effect, and I'd re-run the same measurement after fix #1.

The working tree is unchanged. The measurement script is in `/tmp/tr-perf/measure.js`, and the build output is in the ignored `.next/` folder.