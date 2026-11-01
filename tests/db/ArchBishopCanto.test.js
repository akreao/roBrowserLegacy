import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Canto Candidus (AB_CANTO 2042): cast aura 830; use packet (result set): 37 (Increase AGI) on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Canto Candidus plays Increase AGI on each target, with the Arch Bishop cast aura', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_CANTO]).toEqual({ castAuraEffectId: 830, successEffectId: 37 });
	});
});
