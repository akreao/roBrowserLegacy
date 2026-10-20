Title: perf(ui): fetch hidden windows' own art when they are first drawn

**Depends on {lazy-window-art}**, which adds `UI/WhenDrawn.js`. This branch is stacked on it, so its diff shows that commit too until it merges.

Before: entering the map still sent about 81 requests (~650 KB) for art in windows nobody had opened: the cash shop banners and banner dots, the cart decoration and change-cart sprites, the emoticons, the Laphine scrollbars, and the PvP counter and timer fonts. Each window loads these with `Client.loadFile(s)` in `init()` or `onAppend()`, which the `data-*`/custom-element change does not cover.

After: those windows fetch their art the first time they are drawn on screen, and windows that receive data before their art arrives draw it once it does.

How: each of these windows wraps its file loads in `whenDrawn(this._host, …)` (the cash shop banners wait for the slide container, the dots for the dot list). Where data can now arrive first, the load callback catches up: Emoticons skips building its list until the sprite has loaded (the load callback already rebuilds it); PvPCount draws the ranking it was sent while its font loaded; PvPTimer draws the running time and plays its first-show "time attack" banner once its fonts are in, instead of silently skipping it. Reputation is left as it is, because its entries can be built before its art loads.

Tests: `npx vitest run` — 99 files, 957 tests pass. `npx eslint` and `npx prettier --check` on the eight changed files: clean. `npm run build` succeeds. Line endings stay CRLF.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
