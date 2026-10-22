Title: fix(DB): show the weapon in Doram and Druid attacks

Before: Doram and Druid-line characters showed their weapon while standing in combat, and it vanished for every normal attack.

After: the weapon stays drawn through the attack.

Neither the Doram jobs nor the Druid line had a `WeaponAction` entry, so `getWeaponAction` returned 0 and every attack played ATTACK1. In kRO's sprites that action is the unarmed swing: these jobs' weapon `.act` files leave it empty and draw the weapon only in READYFIGHT, ATTACK2 and ATTACK3.

**How:**
- **Doram:** rods and foxtails (which resolve to ROD) use ATTACK2. The 4-frame Doram attack slice now applies only when unarmed, so an armed swing plays the whole 9-frame ATTACK2 instead of stopping with the rod raised.
- **Druid, Karnos, Alitea:** daggers use ATTACK2; axes, two-handed axes and clubs use ATTACK3.

**Tests:** new cases in `tests/db/SkillAction.test.js`, which fail without the change. `npx vitest run`: all pass. ESLint and Prettier are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
