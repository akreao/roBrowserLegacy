Title: perf(MapRenderer): load the next map while the screen fades to the loading image

Before: on every map change the client spent the 500 ms fade to the loading screen doing nothing, and only asked the worker for the new map in the fade's callback. On a local warp the map change packet arrived at ~50 ms and the `.rsw` request went out at ~565 ms; a 10 Mbps / 100 ms link showed the same fixed ~505 ms gap.

After: the worker starts on the new map as soon as the map change arrives, so the download and parsing overlap the fade. The `.rsw` goes out within 1 ms of the overlay appearing. Measured from the warp command to the new map's first frame (RTX 3060 desktop, two runs per map), every map change got about 0.45 s faster locally (e.g. pay_fild02 1495/1551 ms → 1050/1065 ms, a cached prontera 1511/1491 → 1077/1078 ms); over the slow link the first visit to a map is still bound by its downloads. The fade and loading screen look the same.

How: `MapRenderer.setMap` hooks the worker events and sends `LOAD_MAP` straight away instead of in `Background.setLoading`'s callback. Whatever the worker sends back (progress, world, ground, altitude, models, the completion callback) is held until that callback has run, which still frees the old map and removes the canvas first, so the order of free and set-up is unchanged. The existing load cancellation is kept as is: every event still goes through `loadEvent`/`loadStep`, so a load cancelled during the fade is dropped, and the held events are discarded.

Fades: loading during the fade means a map can be ready before the fade to the loading image ends. `Background.remove` then ran inside that fade's own callback, and both transitions animated the same overlay, so many fast warps ended in a hard cut instead of a fade. `transition()` now carries on from the overlay's current opacity when another transition is under way (skipping the fade-in only when the screen is already black), and the outer transition leaves the fade back to the inner one.

Tests: `tests/renderer/MapRenderer.test.js` gains a case for the early `LOAD_MAP` with its results held until the fade, and the cancel-before-loading-screen case now checks that a worker already started is ignored; new `tests/ui/Background.fadeTakeover.test.js` covers both fade cases. All three fail without the change. `npx vitest run`: 98 files, 954 tests passed. `npx eslint src/Renderer/MapRenderer.js src/UI/Background.js`: clean (test files are under ESLint's existing ignore pattern). `npx prettier --check` on all four changed files: clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
