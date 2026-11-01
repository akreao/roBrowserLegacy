import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Spiral Pierce 397: the official client (kRO 2025-07-16) casts it with the cast aura 502
// (EF_PIERCEBODY), plays 339 on the target as each damage packet arrives (permeter_attack.wav on
// tick 20, EF_MagnumBreak.wav on tick 30) and gives the hit no flash, only the hit-map effect 81
// (the Pierce cone band) with the first hit. Spec: effect-port/lord-knight-skills.md.

const table = effectTableSource();

function row(name) {
	const start = table.indexOf(`\t${name}: [`);
	expect(start).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\t],', start));
}

describe('Spiral Pierce effects', () => {
	it('cast aura 502, 339 on the target as the packet arrives, 81 on the first hit', () => {
		expect(SkillEffect[SK.LK_SPIRALPIERCE]).toEqual({
			castAuraEffectId: 502,
			damageEffectIdOnTarget: 339,
			firstHitEffectId: 81
		});
	});

	it('339 plays its two sounds on ticks 20 and 30', () => {
		const pierce = row('339');
		expect(pierce).toMatch(/wav: 'permeter_attack',\r?\n\t\t\tdelayWav: 20 \* \(1000 \/ 60\),/);
		expect(pierce).toMatch(/wav: 'effect\/ef_magnumbreak',\r?\n\t\t\tdelayWav: 30 \* \(1000 \/ 60\),/);
	});

	it('drops the guessed cast flash and the extra spear hit sound', () => {
		expect(table).not.toMatch(/339_beforecast/);
		expect(table).not.toMatch(/spear_hit_sound/);
	});
});
