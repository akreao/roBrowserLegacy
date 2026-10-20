Title: perf(ui): fetch window art when each element is first drawn

Before: entering the map prepares about fifty windows (cash shop, bank, rodex, refining, navigation and others) and appends several of them hidden. Each one fetches all of its art at once, through `data-*` attributes and the `<ui-button>`/`<ui-image>` elements, whether or not the player ever opens it. In a recorded game entry, 505 of roughly 960 requests were UI textures; on a throttled 10 Mbps / 100 ms connection up to 466 requests sat queued at once, ahead of the map's own files. The world map also downloaded its 1.3 MB image at entry while hidden.

After: a window element fetches its art the first time it is drawn on screen. Hidden windows, and tabs that are not shown, fetch nothing until they appear. Measured on the same 10/100 connection (headless Chromium, RTX 3060 desktop, on a tree a few weeks behind current master): game entry dropped from 913 to 492 requests, UI textures fetched at entry from 505 to about 150 (what remains belongs to windows on screen at entry), the most requests waiting at once from 466 to 56, and the median time to first byte from 1543 ms to 151 ms. Window art still appears in the world map, equipment, inventory, cash shop and bank windows, with no errors in the console. The deferred art is fetched during the first warp or the first time a window opens, so that first open can show its frame a moment later than before.

How:
- New `src/UI/WhenDrawn.js` runs a callback once, the first time an element is drawn. It uses one shared `IntersectionObserver` (module-scoped, no globals) and runs the callback at once where `IntersectionObserver` is missing, so behaviour there is unchanged. Registered in AGENTS.md's UI layer.
- `GUIComponent.prepare()` still sets `data-text` immediately; each node's `data-background`/`-hover`/`-down`/`-active`/`-preload` waits for `whenDrawn(node)`.
- `GUIComponent.processDataAttrs(node)` behaves as before for every existing caller and gains an optional `{ text, images }`.
- `<ui-button>` waits for itself to be drawn; `<ui-image>` waits for its parent, since that is the element it paints.
- `WorldMap.onAppend` selects the map only when the window is visible; `toggle()` already selects it when the window is shown.

Still fetched at entry: explicit `Client.loadFile(s)` calls in components' `init()` (cash shop banners, carts, emoticons, Laphine, PvP fonts and others). A follow-up PR moves several of those over.

Tests: `npx vitest run` — 99 files, 957 tests pass, including new `tests/ui/WhenDrawn.test.js` and `tests/ui/GUIComponentLazyImages.test.js` (jsdom has no IntersectionObserver, so both mock one and say which elements are drawn). `npx eslint` on the changed files: no errors (only the usual "file ignored" warnings for the two test files, which the repo's eslint config excludes). `npx prettier --check` on the changed files: clean. `npm run build` succeeds. Line endings stay CRLF.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
