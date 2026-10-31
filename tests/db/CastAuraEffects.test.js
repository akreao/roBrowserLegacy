import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The aura a caster stands in while a skill with a cast time charges: one per
// element (Entity.js, onEntityCastSkill). Each grows over its first second and
// then holds its size for the rest of the cast, so one that does not spin sits
// still: Energy Coat's 5 s Neutral cast looked frozen for 4 of them. The
// official client builds 12 (Neutral) with the same rings as 58 and 454.
//
// Read as text: the effect tables import the renderer, which does not load
// without a canvas, and what is being checked is what the tables say.
const effectTable = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8').replace(/\r\n/g, '\n');

function cylinders(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	const end = effectTable.indexOf('\n\t],', start);
	return effectTable
		.slice(start, end)
		.split('\n\t\t{')
		.slice(1)
		.filter(layer => /type: 'CYLINDER'/.test(layer));
}

const CAST_AURAS = {
	12: 'EF_BEGINSPELL (Neutral)',
	54: 'EF_BEGINSPELL2 (Water)',
	55: 'EF_BEGINSPELL3 (Fire)',
	56: 'EF_BEGINSPELL4 (Earth)',
	57: 'EF_BEGINSPELL5 (Wind)',
	58: 'EF_BEGINSPELL6 (Holy, Ghost)',
	59: 'EF_BEGINSPELL7 (Poison)',
	454: 'EF_DARKCASTING (Shadow, Undead)'
};

describe('cast auras', () => {
	for (const [id, name] of Object.entries(CAST_AURAS)) {
		it(`${name} spins for the whole cast`, () => {
			const layers = cylinders(id);
			expect(layers.length).toBeGreaterThan(0);
			for (const layer of layers) {
				expect(layer).toMatch(/rotate: true/);
			}
		});
	}

	// The official client (kRO 2025-07-16) swap table 0xd85ee0: water 54, earth 56, fire 55, wind 57, poison 59, holy 58.
	it('gives earth casts 56 and wind casts 57, as the official client', () => {
		const entity = readFileSync(join(process.cwd(), 'src/Engine/MapEngine/Entity.js'), 'utf8').replace(/\r\n/g, '\n');
		expect(entity).toMatch(/case 2:\n\t+EF_Init_Par\.effectId = EffectConst\.EF_BEGINSPELL4;/);
		expect(entity).toMatch(/case 4:\n\t+EF_Init_Par\.effectId = EffectConst\.EF_BEGINSPELL5;/);
	});
});
