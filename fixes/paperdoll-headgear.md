Title: fix(Equipment): draw headgear received this session on the paperdoll

Before: equipping a headgear or garment received after login (picked up, from an NPC, or traded) showed it on the character on the map, but not on the equipment window's paperdoll until the next map change or relog.

After: it is drawn on the paperdoll at once.

The equip window draws headgear and garments from `wItemSpriteNumber`, which only the inventory lists sent at login and on map change carry. Items received later arrive in the pickup packet as `look`. The equip ack carries the same number as its view id (0 for slots that are not drawn), so it is set on the item before it reaches the window.

**Tests:** new `tests/engine/MapEngine.Item.Equip.test.js`, which fails without the change. `npx vitest run`: all pass. ESLint and Prettier are clean.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01PAhEJtjNehjoQDZAu7js6M
