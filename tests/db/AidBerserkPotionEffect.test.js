import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BERSERK_POTION, planThrow } from '../../src/Renderer/Effects/ThrownStoneSim.js';
import { berserkPotionThrowEffect } from '../../src/DB/Effects/ThrowStoneEffect.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Aid Berserk Potion (AM_BERSERKPITCHER, skill 446): when the use packet has the result set, the official
// client launches 541 (EF_THROWITEM5) on the caster, aimed at the target (버서크포션.bmp in the bottle
// flight, colour 4 = white), then 220 (EF_POTION_BERSERK) on the target. 220 plays ac_concentration.wav and
// quakes the screen on tick 18. kRO 2025-07-16. Spec: effect-port/alchemist-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();

describe('Aid Berserk Potion', () => {
	it('throws 541 from the caster and plays 220 on the target when the skill succeeds', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.AM_BERSERKPITCHER\] = \{ successEffectIdOnCaster: 541, successEffectId: 220 \};/
		);
		expect(table).toMatch(/541: berserkPotionThrowEffect,/);
	});

	it('throws the untinted berserk potion in the bottle flight', () => {
		expect(BERSERK_POTION.texture).toBe(
			'\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xb9\xf6\xbc\xad\xc5\xa9\xc6\xf7\xbc\xc7.bmp'
		);
		expect(BERSERK_POTION.color).toBeUndefined();
		expect(planThrow([0, 0, 0], [30, 0, 0], BERSERK_POTION).ticks).toBe(26);
		const spawned = [];
		berserkPotionThrowEffect[0].func.call(
			{ spamEffect: p => spawned.push(p) },
			{
				Init: { ownerEntity: { position: [0, 0, 0] }, otherEntity: { position: [3, 0, 0] } },
				Inst: { startTick: 0 }
			}
		);
		expect(spawned).toHaveLength(4);
		expect(spawned[0].Inst.effectID).toBe(541);
	});

	it('plays 220 sound and quake on tick 18', () => {
		const row = table.slice(table.indexOf('//EF_POTION_BERSERK\t'), table.indexOf('//EF_POTIONPILLAR'));
		expect(row).toMatch(/wav: 'effect\/ac_concentration',\s+delayWav: 300,/);
		expect(row).toMatch(/startTick \+ 18 \* \(1000 \/ 60\);/);
		expect(row.match(/wav:/g)).toHaveLength(1);
	});
});
