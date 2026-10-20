Title: feat(core): opt-in performance probe for frame time, draw calls and load times

Before: there is no way to measure the running client. The benchmark workflow (`.github/workflows/benchmark.yml`, `npm run bench`) times isolated functions such as palette conversion and sprite compilation under vitest in Node, which is the right tool for a WASM-vs-JS kernel, but it cannot say how long a frame takes in a real map, how many draw calls a scene costs, how long a map takes to load, or whether a change introduced hitches. Performance changes to the renderer or the loading path have nothing to be compared against.

After: with `perfProbe: true` in ROConfig, the client records, in the browser, while it plays:
- frame-to-frame time and the CPU time spent inside `Renderer._render`, as avg / p50 / p95 / p99 / max, plus hitches over 50 ms;
- draw calls and vertices per frame, by wrapping the context's `draw*` functions;
- map load time, `setMap` to ready and to the first frame drawn;
- page load to the first time the login window is shown;
- a log of frames over 33 ms (when, how long, work and draws), each also a `performance.measure` named `roPerf slow frame`, so it lines up with the Performance panel in a Chrome trace.

A small corner overlay shows the last second of frames. In game, `/perf` prints a summary in the chat and the whole stats object in the console, `/perf reset` starts a new measurement window, `/perf slow` prints the slow-frame log with `console.table`, and `/perf overlay on|off` toggles the overlay. Without the flag nothing changes: each hook is one boolean test, the context is not wrapped, no overlay is made and `/perf` is not registered.

It complements the benchmark workflow rather than replacing it: the bench measures kernels in CI on every PR, the probe measures the whole client on real hardware, GPU and display included, when someone is investigating. Neither needs the other.

How:
- New `src/Core/PerfProbe.js` (module-scoped ring buffers of 36,000 frames, no globals; registered in AGENTS.md's Core layer, with the flag under Debugging). It switches itself on in `Renderer.init` when `Configs.get('perfProbe')` is true, so the flag also works when the configuration arrives by `postMessage`.
- Nothing is put on `window`. Access goes through the existing chat command store in `Controls/ProcessCommand.js`, registered only with the flag, the same way the dev-only `/weather` command is (the registration reads the configuration when the module loads, so in `postMessage` mode the probe runs but `/perf` is not registered; the overlay and the `roPerf slow frame` measures are still available). Console output follows `development` / `enableConsole` as usual.
- Hooks, each guarded by `PerfProbe.enabled`: `Renderer.init` (attach to the context), `Renderer._render` (frame start after the FPS-limit check, so throttled rAF ticks are not frames; frame end before the next rAF), `MapRenderer.setMap` / `onMapComplete` (map load; the loop's pause while a map loads is not counted as a frame), `WinLoginCommon` `onAppend` (login shown).

Tests: `npx vitest run` — 99 files, 960 tests pass, including new `tests/core/PerfProbe.test.js` (off without the flag and the context untouched; switched on by `attach` with nothing on `window`; overlay toggle; draw and frame counting; the slow-frame log; map and login marks) and `tests/controls/ProcessCommand.perf.test.js` (`/perf`, `/perf reset`, `/perf slow`, `/perf overlay`, and the message when the probe is not running). `npx eslint` on the changed files: no errors (only the "file ignored" warnings for the two test files, which the repo's eslint config excludes, and for AGENTS.md). `npx prettier --check` on the changed files: clean. `npm run build` succeeds. Line endings stay CRLF.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
