import { describe, expect, it } from 'vitest';

// Plant Cultivation (CR_CULTIVATION, skill 491): the official client launches 58 (EF_BEGINSPELL6, the holy
// cast aura) on the caster from the ground packet, for its table lifetime of 40 ticks. kRO 2025-07-16.
// Spec: effect-port/creator-skills.md.

const { default: SkillEffect } = await import('DB/Skills/SkillEffect.js');
const { default: SK } = await import('DB/Skills/SkillConst.js');
const { default: EffectTable } = await import('DB/Effects/EffectTable.js');

describe('Plant Cultivation', () => {
	it('plays the holy cast aura on the caster', () => {
		expect(SkillEffect[SK.CR_CULTIVATION]).toEqual({ effectIdOnCaster: '58_cultivation' });
	});

	it('is 58 for 40 ticks', () => {
		const { duration, ...look } = EffectTable['58_cultivation'][0];
		expect(duration).toBeCloseTo(40 * (1000 / 60), 6);
		expect(look).toEqual(EffectTable[58][0]);
	});
});
