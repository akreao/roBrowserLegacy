import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Cicada Skin Shed (NJ_UTSUSEMI, skill 531): when the shed blocks a hit the server sends effect 462
// (EF_STORMKICK4); the official client plays t_회피.wav on its tick 15, with dust.
// Spec: effect-port/ninja-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\t],', table.indexOf(`\t${id}: [`)));

describe('Cicada Skin Shed dodge', () => {
	it('plays t_회피.wav 15 ticks into effect 462', () => {
		const r = row(462);
		expect(r).toContain("wav: 'effect/t_\\xc8\\xb8\\xc7\\xc7',");
		expect(r).toContain('delayWav: 15 * (1000 / 60)');
	});
});
