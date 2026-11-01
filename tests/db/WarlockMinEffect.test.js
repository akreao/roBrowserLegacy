import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Under /mineffect (low-effects option 229) the kRO 2025-07-16 client loads the mineffect\ copy of these
// Warlock registry effects: Hell Inferno 1550-1552, Soul Expansion 1587 / 1588 / 1591 / 1592, Chain
// Lightning 1635 / 1636 / 1638. Tetra Vortex, Crimson Rock and Comet have no copy.

const table = effectTableSource().replace(/\r\n/g, '\n');

function part(id) {
	const at = table.indexOf(`(${id}): CEZ2STREffect`);
	expect(at, String(id)).toBeGreaterThan(0);
	return table.slice(at, table.indexOf('\n\t\t}', at));
}

describe('Warlock /mineffect copies', () => {
	it('loads the mineffect copy, with its own texture folder', () => {
		for (const id of [1550, 1551, 1552, 1587, 1588, 1591, 1592, 1635, 1636, 1638]) {
			const row = part(id);
			const file = row.match(/file: '([^']*)'/)[1];
			const textures = row.match(/texturePath: '([^']*)'/)[1];
			expect(row, String(id)).toContain(`min: 'mineffect/${file}'`);
			expect(row, String(id)).toContain(`minTexturePath: 'mineffect/${textures}'`);
		}
	});

	it('leaves the rows without a copy alone', () => {
		for (const id of [1274, 1413, 1421]) {
			expect(part(id), String(id)).not.toContain('min:');
		}
	});
});
