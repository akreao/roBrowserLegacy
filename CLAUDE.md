# Working in this repository

This is **Flux159/roBrowserLegacy**, the roBrowserLegacy fork that [Ragnarok Offline](https://github.com/Flux159/ragnarokoffline.app) builds its game client from. It is not upstream (MrAntares/roBrowserLegacy). For the codebase itself (layout, subsystems, conventions), read [AGENTS.md](AGENTS.md), which comes from upstream.

**On `master` right now?** That's upstream plus this file. The fork's code is on `ragnarokoffline`: run `git switch ragnarokoffline` before you change anything.

## Pull requests go to `ragnarokoffline`, not `master`

| Branch | What it is | Open PRs against it? |
|---|---|---|
| `ragnarokoffline` | The fork's own branch. The app pins commits on it (`config/VENDOR_PINS` in the app repo). | **Yes. Every PR goes here.** |
| `master` | A mirror of upstream's `master`. | **No.** |

GitHub may suggest `master` as the base, because that is the repository's default branch. Change it to `ragnarokoffline` before you open the PR. A PR against `master` drags in every upstream commit that `ragnarokoffline` hasn't merged yet.

How to work:
- Branch from `ragnarokoffline`: `git fetch origin && git switch -c my-change origin/ragnarokoffline`.
- Keep a PR to one change.
- `ragnarokoffline` only moves forward. Releases pin commits on it, so it refuses force-pushes and is never rebased. Newer upstream comes in as a merge of `master` into it, in its own PR.
- To bring your branch up to date, merge or rebase onto `origin/ragnarokoffline`, never onto `master`.
- **Never open PRs to upstream (MrAntares)** from this fork.

## Where upstream comes from

Upstream is **MrAntares/roBrowserLegacy `master`**, merged in directly. Flux159/roBrowserLegacy's `ragnarokoffline` is a second source: merge it too when it has moved, but it no longer carries MrAntares for us.

- `git remote add mra https://github.com/MrAntares/roBrowserLegacy && git fetch mra master`, then merge `mra/master` into a branch off `origin/ragnarokoffline` and open the PR to `ragnarokoffline`.
- Most of what comes back is our own work, squash-merged upstream. Where an effect or skill file conflicts, the fork's copy is usually newer: keep it, and take upstream's review fixes on top.
- Players are drawn as one composed sprite (`Renderer/Entity/EntityComposer.js`), so the order of the `renderElement` calls in `EntityRender.js` is what layers them, not `zIndex`. Carts are entities of their own (`Entity.TYPE_CART`).

## What belongs here

Fixes to the client, and **hook points** that let code outside the client draw or take part:
- `src/Renderer/MapHooks.js`: drawing inside the map renderer (passes, depth, lights, model replacement);
- `src/UI/ScreenHooks.js`: replacing the login, server list, character select and character creation screens;
- `src/UI/ExitHooks.js`: the Esc menu's character select and exit actions;
- `src/UI/UIScale.js`: drawing chosen windows larger or smaller (a global factor times each window's own). Its `SCALABLE` list names the windows whose code has been checked to work scaled; window code turns screen distances into window distances with `component.scale`.

Effects, screens and features themselves (Graphics+, autologin, the client API `api.*`) are **not** here. They live in the app repo, in its mods and its client patches (`patches/client/`, applied by `scripts/patch-client.sh`). Add a hook here, small and upstream-neutral, and keep the behaviour in a mod.

## Conventions

- **Files use CRLF line endings** (`.gitattributes`: `eol=crlf`). Keep them, and never produce a whole-file diff. A diff that rewrites every line means something changed the line endings.
- **Hooks follow the MapHooks pattern:** `register()` returns an undo function, a hook that throws is switched off and the stock behaviour comes back, and with no hook registered nothing changes.

## Checking a change

- `npm ci`, `npx vitest run`, `npx eslint <files>`, `npx prettier --check <files>`.
- `npm run build:all` builds the client. To test inside the app, point its `config/VENDOR_PINS` at your commit. The app's CI applies its client patches to the pinned commit and builds it, so a hook the patches rely on must keep its name and shape.
