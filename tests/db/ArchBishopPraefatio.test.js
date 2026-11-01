import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Praefatio (AB_PRAEFATIO 2045): cast aura 830; use packet (result set): 112 (Kyrie Eleison) on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Praefatio plays Kyrie Eleison on each target, with the Arch Bishop cast aura', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_PRAEFATIO]).toEqual({ castAuraEffectId: 830, successEffectId: 112 });
	});
});
