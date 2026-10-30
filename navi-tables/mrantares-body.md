**Bug:** routes to another map in the Navigation window always fail, and NPC and monster searches find nothing.

`DBManager.js` declares the six navigation tables as plain objects (`const NaviLinkTable = {};`) and copies each loaded Lua array into one with `Object.assign`. That keeps the entries but not `.length`. `MapPathFinder.findPathBetweenMaps` and the NPC and monster searches all loop on `.length`. So `findPathBetweenMaps` returns `null` at its `!naviLinkTable.length` check, and the searches loop zero times.

**Fix:**
- The six tables are arrays. They are filled through `fillNaviTable`, which empties the array (same reference) before copying the loaded one in. `LoginEngine` runs `DB.init()` again after a server switch, so a shorter table from the next archive would otherwise keep the previous one's rows.
- The Lua-to-JSON array check in `loadLuaValue` counts keys (an array is integer keys 1..n with none missing) instead of expecting `pairs()` to visit 1, 2, 3 in order. Lua doesn't promise that order for keys in a table's hash part, so an array could come out as an object keyed `"1"`, `"2"`...

**Tests:** new `tests/db/NavigationTables.test.js` checks that the tables are arrays and keep their length, and that a two-portal table routes from prontera to prt_fild08. Both tests fail without the fix. `npx vitest run tests/db/NavigationTables.test.js tests/ui`: 474 passed. `npx eslint src/DB/DBManager.js`: no errors. `npx prettier --check` on both files: clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01BrdhL7bmKiKybCTsCGig2s
