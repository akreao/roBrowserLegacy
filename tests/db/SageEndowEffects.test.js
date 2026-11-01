import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Sage endows (Endow Blaze / Tsunami / Tornado / Quake, effects 255-258): the official client
// plays the endow STR from the first tick and _enemy_hit_wind1.wav (data/wav/, not
// data/wav/effect/) on tick 10. Spec: effect-port/sage-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

const TICK = 1000 / 60;

describe('Sage endow effects', () => {
	const files = { 255: 'enc_fire', 256: 'enc_ice', 257: 'enc_wind', 258: 'enc_earth' };
	for (const [id, file] of Object.entries(files)) {
		it(`${id} plays ${file}.str and the wind hit sound 10 ticks in`, () => {
			const [effect] = row(id);
			expect(effect).toMatchObject({ type: 'STR', file, wav: '_enemy_hit_wind1', attachedEntity: true });
			expect(Math.round(effect.delayWav / TICK)).toBe(10);
		});
	}
});
