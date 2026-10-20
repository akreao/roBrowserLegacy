Title: perf(renderer): share one sprite atlas and one palette atlas across sprite files

**Depends on {sprite-batching}.** This branch carries that commit too, so the diff here shows it until it merges.

Before: with sprite batching, each sprite file has its own atlas and each palette its own texture. A player is several files (body, head, headgear, weapon), each with its own palette, so the batch breaks at every layer. Crowded towns gain little.

After: the frames of every sprite file go into one shared atlas, and every palette goes into one palette texture. A mixed crowd draws in a few instanced calls. Runs now break only on blend mode, depth state, or a frame or palette that doesn't fit the atlas. In a Prontera crowd, the sprite pass dropped from 425 draws to 5. That was measured before the rebase; see below.

## How

- New `src/Renderer/SpriteAtlas.js`, registered in AGENTS.md. The first time a file is drawn, it packs that file's frames in shelves: palette frames into an R8 texture array, RGBA frames into an RGBA8 array.
- Palettes go into a 256×512 texture, one row each.
- Each sprite's instance values carry its source, its atlas layer and its palette row.
- When `MemoryManager` frees a file, the atlas gets the file's space back. A layer is reused once nothing else lives on it.
- The arrays grow up to a limit and copy what they hold. When the palette texture fills, it starts over between frames.
- Frames and palettes that don't fit keep their own textures, as before.
- Colour 255 of a palette reads colour 0, as it does on the palette's own REPEAT texture.
- The atlas is filled from the compiled frame data, which is the same whether `SPR.compile()` took the WASM path or the JS fallback. Nothing in `Loaders/` or the `.wat` files changes.
- It uses texture units 5–7, which nothing else binds.

**Turning it off:** `spriteBatching: false` in `Configs` still draws every sprite on its own.

## Bench (before the rebase onto current master)

These numbers were measured on an RTX 3060 (1080p, uncapped, 10 s windows, 2 rounds), on an earlier base, before this branch was rebased onto current `master`. They were not re-measured after the rebase. "Base" there means the sprite batching PR alone.

The scenes with level-99 auras on are left out. That base drew auras with different code from current `master`, so their draw counts don't carry over.

| Scene | CPU | Draws/frame base → atlas | Work p50 base → atlas (ms) | FPS base → atlas |
|---|---|---|---|---|
| Prontera + 90 players, aura off | 1× | 644 → 224 | 1.1 → 1.0 | 633 → 719 |
| Prontera + 90 players, aura off | 4× | 644 → 224 | 4.7 → 4.1 | 154 → 164 |
| 200 wolves | 1× | ~105 → 35 | 0.65 → 0.6 | ~1010 → ~1090 |
| 60 / 200 wolves | 4× | 35–110 → 35 | within noise | within noise |

Pixel checks at that time:
- Headless WebGL2 (SwiftShader): 24 entities × 4 layers rendered pixel-identical to the batching PR's output, with draws down from 88 to 27.
- On the GPU: no layering differences against unbatched drawing, apart from the shadows-first order the batching PR introduces.

## On this rebased branch

- This rebased branch was not run on a GPU or in a browser.
- The new SpriteBatch shaders compile and link under WebGL2 in headless Chromium (SwiftShader). Nothing was drawn with them there.

## Tests

- `tests/renderer/SpriteBatch.test.js` gains tests for:
  - files with different palettes sharing one draw;
  - RGBA frames drawn from the atlas;
  - recorded order kept around a frame too big for the atlas;
  - a full palette texture, and its reset on the next frame;
  - a freed file's space reused;
  - the atlas growing.
- `npx vitest run`: 98 files, 964 tests passed.
- `npx eslint` on the changed files: 0 errors. One warning was already on master: `Water` is imported and unused in `EntityManager.js`.
- `npx prettier --check` on the changed files: clean.
- `npm run build:online`: bundles.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
