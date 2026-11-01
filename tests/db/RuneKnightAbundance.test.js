import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Abundance (RK_ABUNDANCE 2019): use packet (result set): 538 (EF_GREENBODY) and 흡기.wav on the caster; cast aura 12.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Abundance', () => {
	it('plays the official use effects on success', () => {
		expect(SkillEffect[SK.RK_ABUNDANCE]).toMatchObject({ successEffectIdOnCaster: [538, 'ef_rk_abundance_sound'], castAuraEffectId: 12 });
		expect(EffectTable.ef_rk_abundance_sound).toEqual([{ wav: 'effect/\xc8\xed\xb1\xe2', attachedEntity: true }]);
	});
});
