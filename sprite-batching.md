Title: perf(renderer): batch entity sprites into instanced draws

Before: every sprite layer of every entity is its own `drawArrays`, with about a dozen uniform uploads in front of it (about 2.5 draws per wolf on pay_fild02, shadow included).

After: the entity pass records its sprites and draws runs of them with `drawArraysInstanced`. A crowd of one monster kind takes two draws: all the shadows, then all the bodies.

## How

New `src/Renderer/SpriteBatch.js` with `SpriteBatch.vs/.fs`. It is registered in AGENTS.md.

- `EntityManager.render` opens a batch around its entity loop. Inside it, `SpriteRenderer.render` writes the values it used to upload as uniforms into an instance buffer. Consecutive sprites that share texture, palette, blend and depth state become one run. Runs are drawn in recorded order, so blending and depth come out as before.
- The per-sprite values that used to be uniforms are now instance data. That covers position, zIndex, offset, size, colour, angle, depth, shadow and `ignoreDepthMinCap`, so none of them splits a run. The batch shaders are `SpriteRenderer.vs/.fs` with those uniforms read from the instance.
- Every frame of a sprite file is packed into one atlas texture. It is built the first time an entity draws from that file, and `MemoryManager` frees it with the file.
  - RGBA frames get a 1px copy of their edge, so LINEAR sampling matches `CLAMP_TO_EDGE`.
  - Palette frames are read with `texelFetch` in the frame's own texel space, so the palette shader's bilinear sampling matches the per-frame texture.
  - The atlas packs the compiled frame data, the centred power-of-two buffers that `SPR.compile()` produces. It works the same whether `compile()` took the WASM path or the JS fallback. Nothing in `Loaders/` or the `.wat` files changes.
- Shadows go into a queue drawn before the other sprites. This is the one intended visual difference: a body standing behind another entity is drawn over that entity's shadow, not under it.
- While a batch is open, `runWithDepth` only tracks depth state. STR attachments flush the batch before they draw with their own program.
- Players and NPCs are made of several sprite files with their own palettes, so they still break runs between layers. A follow-up PR shares one atlas and one palette texture across files.

**Turning it off:** set `spriteBatching: false` in the client config (`Configs`) to draw every sprite on its own, as before.

## Measured (before the rebase onto current master)

These numbers were measured on an RTX 3060 (headless Chromium, 1920×1080), on an earlier base, before this branch was rebased onto current `master`. They were not re-measured after the rebase.

| Scene | Draws/frame base → batch | Work avg (ms) | FPS |
|---|---|---|---|
| pay_fild02 + 60 wolves | 150–155 → 35–39 | 0.36 → 0.30 | ~1380 → ~1535 |
| pay_fild02 + 200 wolves | 308–317 → 92–113 | 0.78 → 0.61 | ~875 → ~1000 |
| pay_fild02 + 200 wolves, CPU 4× | ~310 → ~100–135 | 3.4–4.3 → 2.9–3.6 | +5–10% |
| Prontera (3 NPCs in view) | 226 → 223 | no change | no change |

Screenshots taken then showed no visible difference. Prontera was pixel-identical apart from 296 px that were off by 1/255.

## On this rebased branch

- This rebased branch was not run on a GPU or in a browser.
- The new SpriteBatch shaders compile and link under WebGL2 in headless Chromium (SwiftShader). Nothing was drawn with them there.

## Tests

- New `tests/renderer/SpriteBatch.test.js`: run merging, recorded order, blend per run, depth state left as found, flush in the middle of the pass, `ignoreDepthMinCap` per instance, the atlas, and the off switch.
- `tests/renderer/EntityManager.culling.test.js`: mocks the two new SpriteRenderer calls.
- `npx vitest run`: 98 files, 959 tests passed.
- `npx eslint` on the changed files: 0 errors. One warning was already on master: `Water` is imported and unused in `EntityManager.js`.
- `npx prettier --check` on the changed files: clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
