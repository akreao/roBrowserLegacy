import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Lauda Agnus (AB_LAUDAAGNUS 2047), Lauda Ramus (AB_LAUDARAMUS 2048): cast aura 830; use packet (result set): 66 (Cure)
// and lauagnus.wav on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Lauda Agnus and Lauda Ramus play Cure and their sound on each target', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_LAUDAAGNUS]).toEqual({ castAuraEffectId: 830, successEffectId: [66, 'ef_ab_lauda_sound'] });
		expect(SkillEffect[SK.AB_LAUDARAMUS]).toEqual(SkillEffect[SK.AB_LAUDAAGNUS]);
		expect(EffectTable.ef_ab_lauda_sound).toEqual([{ wav: 'lauagnus', attachedEntity: true }]);
	});
});
