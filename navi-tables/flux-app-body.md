**Needed before the roBrowserLegacy pin moves past MRANTARES_PR**

That PR fixes the navigation tables in roBrowserLegacy itself. It makes the same two changes `scripts/patch-navigation-client.cjs` makes to the built bundle: the six `Navi*Table`s become arrays, and the Lua array check counts keys. The patch looks for the old text, so on a client with the fix it stops with `Unexpected initialization: NaviMapTable` and the client build fails. That will happen as soon as an upstream sync brings the fix into the fork.

**Change:** each of those two steps is skipped when the bundle already has the fix. The other steps (escaping, charpage decode, English names, the UI) don't change.

**Checked:** I built `Online.js` from the current pin and from MrAntares master with the fix, and ran the patch on each:

| Bundle | Patch on main | This PR |
|---|---|---|
| current pin (Flux159/roBrowserLegacy 771f517) | OK | OK, output byte-for-byte the same |
| MrAntares master + the fix | fails: `Unexpected initialization` | OK |

`node --test tests/navigation-names.test.cjs`: 3 pass.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01BrdhL7bmKiKybCTsCGig2s
