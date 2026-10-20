Title: perf(renderer): pace the FPS limit to whole display refreshes

Before: `Renderer._render` limits FPS by skipping rAF callbacks until `1000 / fpslimit` ms have passed. rAF fires once per display refresh, so unless the limit divides the refresh rate, some refreshes are skipped and others aren't. At the default limit of 60 on a 75 Hz monitor, one frame in four stays on screen for two refreshes: frame times alternate between 13.3 and 26.7 ms all the time. The average is 60, but motion stutters. 144 Hz and 165 Hz displays get the same uneven pacing. The FPS window also judges its colour against the raw limit, so a 120 limit on a 60 Hz display shows a perfectly steady 60 as orange.

After: when a whole number of refreshes per frame gives a rate at or under the limit and within 10% of it, every frame lasts exactly that many refreshes, so 60 on 120 Hz is an even 60 and 60 on 165 Hz an even 55. When none does (60 on 75 Hz would be 37.5, on 144 Hz 48), the limit is applied by time exactly as before. A limit is a ceiling and is never exceeded; players set one for heat and power.

| Limit | 60 Hz | 75 Hz | 120 Hz | 144 Hz | 165 Hz |
|---|---|---|---|---|---|
| none (-1) | 60 | 75 | 120 | 144 | 165 |
| 30 | 30 even | 30 by time | 30 even | 28.8 even | 27.5 even |
| 60 | 60 even | 60 by time | 60 even | 60 by time | 55 even |
| 90 | 60 | 75 | 90 by time | 90 by time | 82.5 even |
| 120 | 60 | 75 | 120 | 120 by time | 120 by time |

"By time" is today's limiter: the cap holds, unevenly. A plain number means every refresh.

How:
- New `src/Renderer/FramePacer.js` (module-scoped state, no globals; registered in AGENTS.md's Renderer layer). `sample(now)` records every rAF timestamp, rendered or not; the refresh interval is the trimmed mean of the last 31 intervals, ignoring gaps over 100 ms (hidden tab, stalls). 1% of slack lets a 59.94 / 119.88 Hz display count as 60 / 120. Until 8 intervals are seen, or when rAF is not steady, the limit applies by time.
- `Renderer._render`: one `FramePacer.sample(now)` call, and the throttle block asks `FramePacer.next()` instead of computing the interval itself. The forced 60 cap on screens without a map (`!Session.Playing`) is unchanged and is paced the same way.
- The FPS window (`UI/Components/FPS/FPS.js`, including the new lowest-FPS readout from #1511) is unchanged in what it counts. Its colour now compares against `FramePacer.targetRate(limit)`, the rate the limit actually gives on this display (55 for 60 on 165 Hz, 60 for 120 on a 60 Hz display, the display rate with no limit), and falls back to the highest rate seen while the refresh rate is not known yet, as before. Note that with pacing the lowest-FPS readout can legitimately show 55 for a 60 limit on a 165 Hz display.
- Second commit: `fpslimit` defaults to `-1`, and the `-1` option is labelled "Match display" instead of "Unlimited", since rAF never runs faster than the display. The Graphics preferences version is unchanged, so saved settings keep their value.

Measured headed in Chromium on a 74.97 Hz display (RTX 3060), on a tree a few weeks behind current master; the pacing code is the same. Frame times in ms, from the probe in the companion PerfProbe PR:

| fpslimit | FPS | p50 | p95 | p99 |
|---|---|---|---|---|
| 60, before | 59.9 | 13.4 | 26.7 | 26.8 |
| none (-1), after | 74.8 | 13.3 | 13.4 | 13.5 |
| 60, after (by time on 75 Hz; cap held) | 59.9 | 13.4 | 26.7 | 26.8 |

The same held in a dungeon and in a field with 60 and 200 monsters on screen.

Tests: `npx vitest run` — 98 files, 959 tests pass, including new `tests/renderer/FramePacer.test.js` (8 tests, simulated rAF with timestamp jitter): even pacing at 60/59.94/120/119.88/165 Hz and 30 on 60 Hz; every refresh when the display is slower than the limit; the time fallback for 60 on 75 Hz and 60 on 144 Hz; a sweep over 59.94–240 Hz × limits 30/60/90/120 asserting the rendered rate never exceeds the limit and reaches it (or the display's rate) within 10%; the refresh estimate, `targetRate()`, the time-based start-up and hidden-tab gaps. Run against the old limiter's logic, the 75 Hz case fails. `npx eslint` on the changed files: no errors (only the "file ignored" warning for the test file, which the repo's eslint config excludes). `npx prettier --check` on the changed files: clean. `npm run build` succeeds. Line endings stay CRLF.

**Question for the maintainers:** the second commit changes the default `fpslimit` from 60 to "Match display" (`-1`), so on a display above 60 Hz the client would render at the refresh rate by default. Saved preferences keep their value. Do you want that default, or would you rather keep 60? The default is its own commit (`feat(graphics): default the FPS limit to "Match display"`) and can be dropped without touching the pacing change.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
