import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Eswoo 470, Eske 471 and Eska 472: the official client casts them with the blue aura 441 and, when
// the use packet succeeds, plays the skill's sound at the player and its effects on the target
// (kRO 2025-07-16): Eswoo T_슈웃.wav + 420 + 589, Eske T_공격력.wav + 427, Eska T_방어형.wav, a screen
// quake, 254 + 1132 + 261. 589 and 254 have no sound of their own. Spec: effect-port/soul-linker-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

function row(name) {
	const start = table.indexOf(`\t${name}: [`);
	expect(start).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\t],', start));
}

describe('Eswoo, Eske and Eska effects', () => {
	it.each([
		['SL_SWOO', 'sl_swoo_sound', [420, 589]],
		['SL_SKE', 'sl_ske_sound', 427],
		['SL_SKA', ['sl_ska_sound', 'quake'], [254, 1132, 261]]
	])('%s: blue cast aura, sound and effects only on success', (name, onCaster, effects) => {
		expect(SkillEffect[SK[name]]).toEqual({
			castAuraEffectId: 441,
			successEffectIdOnCaster: onCaster,
			successEffectId: effects
		});
	});

	it.each([
		['sl_swoo_sound', 't_\\\\xbd\\\\xb4\\\\xbf\\\\xf4'],
		['sl_ske_sound', 't_\\\\xb0\\\\xf8\\\\xb0\\\\xdd\\\\xb7\\\\xc2'],
		['sl_ska_sound', 't_\\\\xb9\\\\xe6\\\\xbe\\\\xee\\\\xc7\\\\xfc']
	])('%s plays %s at once', (name, wav) => {
		const sound = row(name);
		expect(sound).toMatch(new RegExp(`wav: 'effect/${wav}',`));
		expect(sound).not.toMatch(/delayWav/);
	});

	it('589 shows m_ef07 without a sound, 254 has no sound row', () => {
		expect(row('589')).toMatch(/file: 'm_ef07',/);
		expect(row('589')).not.toMatch(/wav:/);
		expect(table).not.toMatch(/\n\t254: \[/);
	});
});
