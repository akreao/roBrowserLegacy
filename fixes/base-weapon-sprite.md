Title: fix(EntityView): draw the base weapon type when a class has no sprite for the weapon's look

Before: some weapons drew nothing on Druid-line characters, for example the Paradise Dagger, Paradise Mace, and the Druid and Karnos Maces.

After: they draw with the class's sprite for the weapon's base type.

A weapon whose `ClassNum` is an expansion look (Main Gauche 31, Mace 62, and so on) is drawn from a sprite named after the look (`weapontable.lub`: `_1207`). The Druid line only has base-type sprites in kRO's data.grf, and the existing fallback asked for the same view id again. When that fallback gives the same path, it now falls back to the base type from `Expansion_Weapon_IDs`.

**Tests:** new `tests/renderer/EntityWeaponExpansion.test.js`, which fails without the change. `npx vitest run`: all pass. ESLint and Prettier are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
