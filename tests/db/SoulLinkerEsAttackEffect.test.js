import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Estin 467, Estun 468 and Esma 469: the official client casts them with the blue aura 441 and plays
// nothing on the use packet; as each damage packet arrives it plays 547 / 555 / 553 on the caster and
// 550 / 429 / 425 + 431 + 554 on the target (kRO 2025-07-16). 547 plays T_바람마법.wav on tick 10, 555
// T_에너지방출.wav at once, 553 T_날라차기.wav on ticks 5, 20, 35, 50 and 65.
// Spec: effect-port/soul-linker-skills.md.

const table = effectTableSource();

function row(name) {
	const start = table.indexOf(`\t${name}: [`);
	expect(start).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\t],', start));
}

describe('Estin, Estun and Esma effects', () => {
	it.each([
		['SL_STIN', 547, 550],
		['SL_STUN', 555, 429],
		['SL_SMA', 553, [425, 431, 554]]
	])('%s: blue cast aura, effects as the damage packet arrives', (name, onCaster, onTarget) => {
		expect(SkillEffect[SK[name]]).toEqual({
			castAuraEffectId: 441,
			damageEffectIdOnCaster: onCaster,
			damageEffectIdOnTarget: onTarget
		});
	});

	it('547 plays the wind sound on tick 10', () => {
		expect(row('547')).toMatch(/wav: 'effect\/t_\\xb9\\xd9\\xb6\\xf7\\xb8\\xb6\\xb9\\xfd',/);
		expect(row('547')).toMatch(/delayWav: 10 \* \(1000 \/ 60\),/);
	});

	it('555 plays the energy sound at once', () => {
		expect(row('555')).toMatch(/wav: 'effect\/t_\\xbf\\xa1\\xb3\\xca\\xc1\\xf6\\xb9\\xe6\\xc3\\xe2',/);
		expect(row('555')).not.toMatch(/delayWav/);
	});

	it('553 plays the kick sound five times, 15 ticks apart from tick 5', () => {
		const esma = row('553');
		expect(esma).toMatch(/duplicate: 5,/);
		expect(esma).toMatch(/timeBetweenDupli: 15 \* \(1000 \/ 60\),/);
		expect(esma).toMatch(/delayWav: 5 \* \(1000 \/ 60\),/);
	});

	it('drops the guessed stun STR', () => {
		expect(table).not.toMatch(/ef_sl_stun/);
	});
});
