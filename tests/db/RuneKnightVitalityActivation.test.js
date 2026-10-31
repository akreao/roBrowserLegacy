import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Vitality Activation (RK_VITALITYACTIVATION 2016): use packet (result set): 309 (EF_FIRSTAID) on the caster.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Vitality Activation', () => {
	it('plays the official use effects on success', () => {
		expect(SkillEffect[SK.RK_VITALITYACTIVATION]).toMatchObject({ successEffectIdOnCaster: 309 });
	});
});
