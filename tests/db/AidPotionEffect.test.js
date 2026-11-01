import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { POTION_BOTTLE, planThrow, potionBottle, stoneAt } from '../../src/Renderer/Effects/ThrownStoneSim.js';
import { aidPotionEffect, stoneEffect } from '../../src/DB/Effects/ThrowStoneEffect.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Aid Potion (AM_POTIONPITCHER, skill 231): when the use packet has the result set, the official client
// launches 299 (EF_THROWITEM2) on the caster, aimed at the target, with the skill level as its colour:
// 빈포션병.bmp in the bottle flight (6 x 6 units, 30-unit arc, 25 ticks), tinted red, orange, yellow, white
// or blue for levels 1-5; 6 white and additive; 7-10 not drawn. kRO 2025-07-16.
// Spec: effect-port/alchemist-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();
const manager = readFileSync(join(process.cwd(), 'src/Renderer/EffectManager.js'), 'utf8');

const throwAt = level => {
	const spawned = [];
	aidPotionEffect[0].func.call(
		{ spamEffect: p => spawned.push(p) },
		{
			Init: {
				ownerEntity: { position: [10, 20, 0] },
				otherEntity: { position: [14, 20, 0] },
				skillLevel: level
			},
			Inst: { startTick: 0 }
		}
	);
	return spawned;
};

describe('Aid Potion', () => {
	it('throws 299 from the caster when the skill succeeds', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.AM_POTIONPITCHER\] = \{ successEffectIdOnCaster: 299 \};/);
		expect(table).toMatch(/299: aidPotionEffect,/);
	});

	it('hands the packet level to the caster success effects', () => {
		expect(manager).toMatch(/ownerAID: srcAID,\s+startTick: tick,\s+otherAID: destAID,\s+skillLevel: level/);
	});

	it('tints the bottle by level', () => {
		expect(potionBottle(1).color).toEqual([255, 135, 135]);
		expect(potionBottle(2).color).toEqual([255, 205, 135]);
		expect(potionBottle(3).color).toEqual([255, 255, 135]);
		expect(potionBottle(4).color).toEqual([255, 255, 255]);
		expect(potionBottle(5).color).toEqual([135, 135, 255]);
		expect(potionBottle(0).color).toEqual([255, 135, 135]);
		expect(potionBottle(undefined).color).toEqual([255, 135, 135]);
		expect(potionBottle(6)).toMatchObject({ blendMode: 2 });
		expect(potionBottle(6).color).toBeUndefined();
		expect(potionBottle(7)).toBeNull();
		expect(potionBottle(12)).toBeNull();
	});

	it('flies as a bottle: 26 updates, 30-unit arc', () => {
		const t = planThrow([0, 0, 0], [20, 0, 0], potionBottle(5));
		expect(t.ticks).toBe(26);
		expect(stoneAt(t, 13).up).toBeCloseTo(8 + 30);
		expect(POTION_BOTTLE.texture).toBe(
			'\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xba\xf3\xc6\xf7\xbc\xc7\xba\xb4.bmp'
		);
	});

	it('spawns the tinted bottle and its trail at the caster', () => {
		const spawned = throwAt(5);
		expect(spawned).toHaveLength(4);
		expect(spawned[0].Inst.effectID).toBe(299);
		expect(spawned[0].effect.file).toBe(POTION_BOTTLE.texture);
		expect(spawned[0].effect.blue).toBe(1);
		expect(spawned[0].effect.red).toBeCloseTo(135 / 255);
		expect(spawned[0].effect.track(26).x).toBeCloseTo((20 * 26) / 25 / 5);
		expect(throwAt(8)).toHaveLength(0);
	});

	it('draws level 6 additive', () => {
		const t = planThrow([0, 0, 0], [20, 0, 0], potionBottle(6));
		expect(stoneEffect(t, -1).blendMode).toBe(2);
	});
});
