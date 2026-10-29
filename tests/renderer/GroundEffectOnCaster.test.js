import { beforeEach, describe, expect, it, vi } from 'vitest';

// groundEffectIdOnCaster: an effect on the caster (following it) from the ground packet only. The ground
// packet's position is the target cell, so effectIdOnCaster would leave the effect at the cell.

const { default: EffectManager } = await import('Renderer/EffectManager.js');
const { default: SkillEffect } = await import('DB/Skills/SkillEffect.js');
const { default: SK } = await import('DB/Skills/SkillConst.js');

describe('groundEffectIdOnCaster', () => {
	let spam;
	beforeEach(() => {
		spam = vi.spyOn(EffectManager, 'spam').mockImplementation(() => {});
	});

	it('plays on the caster, without the cell, from the ground packet', () => {
		EffectManager.spamSkill(SK.CR_SLIMPITCHER, 7, [12, 10, 0], 1000, 7, 3);
		const call = spam.mock.calls.find(([p]) => p.effectId === SkillEffect[SK.CR_SLIMPITCHER].groundEffectIdOnCaster);
		expect(call[0]).toEqual({ effectId: 'ef_slim_pitcher_sound', ownerAID: 7, startTick: 1000, otherAID: 7 });
		spam.mockRestore();
	});

	it('does nothing without a ground position', () => {
		EffectManager.spamSkill(SK.CR_SLIMPITCHER, 7, null, 1000, 7, 3);
		expect(spam.mock.calls.some(([p]) => p.effectId === 'ef_slim_pitcher_sound')).toBe(false);
		spam.mockRestore();
	});
});
