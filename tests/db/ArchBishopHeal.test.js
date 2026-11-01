import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Coluceo Heal (AB_CHEAL 2043) and Highness Heal (AB_HIGHNESSHEAL 2051): the use packet runs the Heal case: by the healed
// amount (the packet's level field) 325 / 313 / 312 / 7 on the target, each with _heal_effect.wav.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Coluceo Heal and Highness Heal pick the heal effect by amount, like Heal', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_CHEAL]).toEqual({ successEffectId: SkillEffect[SK.AL_HEAL].successEffectId });
		expect(SkillEffect[SK.AB_HIGHNESSHEAL]).toEqual({ successEffectId: SkillEffect[SK.AL_HEAL].successEffectId });
		const pick = SkillEffect[SK.AB_HIGHNESSHEAL].successEffectId;
		expect([pick(4000), pick(2000), pick(1999), pick(200), pick(199)]).toEqual([325, 313, 312, 312, 7]);
	});
});
