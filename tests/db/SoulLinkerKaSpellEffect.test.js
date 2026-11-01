import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Kaizel 462, Kaahi 463, Kaupe 464 and Kaite 465: the official client casts them with the blue aura
// 441 and, when the use packet succeeds, plays the skill's sound at the player and its effects on
// the target (kRO 2025-07-16): Kaizel priest_resurrection.wav + 543 + 590, Kaahi T_보조마법.wav + 543,
// Kaupe T_치잉.wav + 542, Kaite T_마법반사.wav + 419 + 542 (419 is played from the Kaite status instead, which
// removes and relaunches it). 543 and 590 have no sound of their own.
// Spec: effect-port/soul-linker-skills.md.

const table = effectTableSource();

function row(name) {
	const start = table.indexOf(`\t${name}: [`);
	expect(start).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\t],', start));
}

describe('Soul Linker Ka-spell effects', () => {
	it.each([
		['SL_KAIZEL', 'sl_kaizel_sound', [543, 590]],
		['SL_KAAHI', 'sl_kaahi_sound', 543],
		['SL_KAUPE', 'sl_kaupe_sound', 542],
		['SL_KAITE', 'sl_kaite_sound', 542]
	])('%s: blue cast aura, sound and effects only on success', (name, sound, effects) => {
		expect(SkillEffect[SK[name]]).toEqual({
			castAuraEffectId: 441,
			successEffectIdOnCaster: sound,
			successEffectId: effects
		});
	});

	it.each([
		['sl_kaizel_sound', 'priest_resurrection'],
		['sl_kaahi_sound', 't_\\\\xba\\\\xb8\\\\xc1\\\\xb6\\\\xb8\\\\xb6\\\\xb9\\\\xfd'],
		['sl_kaupe_sound', 't_\\\\xc4\\\\xa1\\\\xc0\\\\xd7'],
		['sl_kaite_sound', 't_\\\\xb8\\\\xb6\\\\xb9\\\\xfd\\\\xb9\\\\xdd\\\\xbb\\\\xe7']
	])('%s plays %s at once', (name, wav) => {
		const sound = row(name);
		expect(sound).toMatch(new RegExp(`wav: 'effect/${wav}',`));
		expect(sound).not.toMatch(/delayWav/);
	});

	it('543 and 590 carry no sound', () => {
		expect(table).not.toMatch(/\n\t543: \[/);
		expect(table).not.toMatch(/\n\t590: \[/);
	});
});
