import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Soul Unity (SP_SOULUNITY, skill 2605): the official client's hard-coded use case (result set, target known)
// launches 1210 (not ported) on the target, told the caster's id, then 407 (EF_SOULCHANGE) on the target.
// EFST_SOULUNITY (1055) keeps 1222 (CSoulUnityEffect, not ported) on the actor. kRO 2025-07-16.
// Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Soul Unity', () => {
	it('plays 407 on the target on success', () => {
		expect(SkillEffect[SK.SP_SOULUNITY]).toMatchObject({ successEffectId: 407 });
		expect(EffectTable[407]).toBeDefined();
	});
});
