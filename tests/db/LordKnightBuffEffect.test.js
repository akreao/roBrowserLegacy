import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Aura Blade 355, Parry 356, Concentration 357, Frenzy 359 and Fury 360: the official client
// (kRO 2025-07-16) plays their effects on the caster only when the use packet's result is set:
// 367 (Aura Blade, with its sound), 336 (Parry's guard, also on every parried hit), 369
// (Concentration: knight_twohandquicken.wav, no STR), 368 + screen quake (Frenzy, Fury).
// Spec: effect-port/lord-knight-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

function row(name) {
	const start = table.indexOf(`\t${name}: [`);
	expect(start).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\t],', start));
}

describe('Lord Knight buff effects', () => {
	it.each([
		['LK_AURABLADE', 367],
		['LK_PARRYING', 336],
		['LK_CONCENTRATION', 369],
		['LK_BERSERK', [368, 'quake']],
		['LK_FURY', [368, 'quake']]
	])('%s: effects on the caster on success only', (name, effects) => {
		expect(SkillEffect[SK[name]]).toEqual({ successEffectIdOnCaster: effects });
	});

	it('Tension Relax plays nothing', () => {
		expect(SkillEffect[SK.LK_TENSIONRELAX]).toEqual({});
	});

	it('369 plays the quicken sound without the Two-Hand Quicken STR', () => {
		expect(row('369')).toMatch(/wav: 'effect\/knight_twohandquicken',/);
		expect(row('369')).not.toMatch(/type: 'STR'/);
	});
});
