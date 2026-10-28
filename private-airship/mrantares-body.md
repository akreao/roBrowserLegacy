Adds the Private Airship to the Navigation window, the way the official client does it.

In the official client, the Navigation window's **Move** button opens a payment popup. Paying with a World Tour Ticket (25464) or Nyangvine Fruit (6909) sends `CZ_PRIVATE_AIRSHIP_REQUEST` (0x0a49: the map name with `.gat`, and the item id), and the server answers with `ZC_PRIVATE_AIRSHIP_RESPONSE` (0x0a4a). rAthena already handles both on renewal servers with `feature.privateairship: on`.

## What changes

- `DB/Map/PrivateAirship.js` reads the maps a flight may start and end on, and the items that pay for it, from `System/PrivateAirplane_True.lub` (`InsertStartableMap`, `InsertEndableMap`, `InsertNeedItem`). `DBManager` loads it.
- `PacketStructure.js` / `PacketRegister.js`: the two packets. The item id is 4 bytes from 20181121, 2 bytes before.
- `UI/Components/PrivateAirship/`: the payment window, as in the official client: one "Use <item>" button per payment item, a red notice line for checks that fail before the request and for the server's answer, and a no-refund confirmation for Nyangvine Fruit. Texts come from the msgstringtable.
- `Navigation`: a Move button under the map. It is shown for client dates from 20180321 and enabled whenever there is a navigation target. As in the official client, the map checks (start map, end map, same map, dead character) run in the payment window, which shows the reason and greys out the item buttons. It flies to the map's real name (`izlude_a`, not `izlude`). A refresh keeps the stored target; picking a new target replaces it.
- `src/UI/AGENTS.md` and `src/DB/AGENTS.md` list the new modules.

## Tests

- `tests/db/PrivateAirship.test.js`: reading the lub tables.
- `tests/network/PrivateAirship.test.js`: packet layout on both sides of 20181121.
- `tests/ui/PrivateAirship.test.js`, `tests/ui/Navigation.airship.test.js`: the window, the button's states and the client-date gate.

`npx vitest run`: 149 files, 1348 tests pass. ESLint and Prettier are clean on the changed files.

Tested in game against rAthena: paying with a World Tour Ticket flies to the target map.

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
