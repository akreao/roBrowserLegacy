Title: perf(MapLoader): ask for the ground, models and textures as soon as their names are known

Before: entering a map loaded the `.rsw`, then the `.gat`, then the `.gnd`, then the ground textures, then the models, each step asking for its files only once the step before had finished. Over a remote link every step began with a round trip on an idle connection, and the ground textures only started after the ground had been compiled.

After: once the `.rsw` is parsed, the `.gnd` and `.gat` are requested together; as soon as the `.gnd` arrives its textures are requested, then the models. Measured on a 10 Mbps / 100 ms link, the map starts about 3 s earlier, and the ground textures start 0.09 s after the `.gnd` instead of 1.05 s. The map load is now limited by bandwidth rather than by round trips. The steps still run, and hand on their data, in the same order.

How: `MapLoader` keeps one promise per filename for each load (`request()`), and each loader step reuses what was already asked for, so nothing is fetched twice. A step takes the early answer out of the shared map when it uses it (`take()`), and a later step that needs the same file asks again and gets its own blob URL. That matters because `Texture.load` revokes a blob URL once its image has loaded: a texture shared by the ground and a model must not hand both the same URL, or the model's meshes never draw (walls missing in Prontera).

Tests: new `tests/loaders/MapLoader.test.js` covers the request order, the order results are handed on, a missing `.gat`, and a texture the ground and a model share (it fails without `take()`). `npx vitest run`: 98 files, 954 tests passed. `npx eslint src/Loaders/MapLoader.js`: clean (the test file is under ESLint's existing ignore pattern). `npx prettier --check src/Loaders/MapLoader.js tests/loaders/MapLoader.test.js`: clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
