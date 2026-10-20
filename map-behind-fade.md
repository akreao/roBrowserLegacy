Title: perf(MapRenderer): start the new map behind the closing fade

**Depends on {warp-fade-loading}.** This branch is based on it, so the diff shows that commit too until it merges.

Before: when a map finished loading, the client faded the loading image to black (500 ms) and only then ran `onLoad` (which sends NOTIFY_ACTORINIT) and drew its first frame. The map faded in empty and its actors popped in a round trip later.

After: the map is set up, the server has been told and the game is drawing during the fade to black, hidden under the loading image, so the map fades in with its actors already there. Measured headless (two runs per map, ms from a GM warp): NOTIFY_ACTORINIT is now sent 501–518 ms before the reveal on every warp instead of at it; Prontera over a 10 Mbps / 100 ms link showed 11 actors at the reveal instead of 0; the longest frame in the second after the reveal was 16.8 ms on every warp, against 33 ms on Prontera in 3 of 4 runs before. No recording showed the map or its windows over the loading image.

How: `onMapComplete` runs `onLoad`, the sky and map-flag effects and the render loop straight away. `Background.remove`'s callback only hands over the mouse, and runs a `setMap` the server sent during the fade: the server may move the player as soon as NOTIFY_ACTORINIT is sent, so that move now waits in `_nextMap` instead of being lost. `cancelLoad` clears it. `Background.remove` raises the loading image and its canvas above the game canvas and its windows (z-index 998/999; the black overlay stays at 1000) for the fade.

Tests: `tests/renderer/MapRenderer.test.js` gains cases for the map started behind the fade with a deferred move, and for a cancel during that fade dropping the deferred move. `npx vitest run`: 98 files, 956 tests passed. `npx eslint src/Renderer/MapRenderer.js src/UI/Background.js`: clean (test files are under ESLint's existing ignore pattern). `npx prettier --check` on the three changed files: clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
