import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Vituperatum (AB_VITUPERATUM 5072): cast aura 830; use packet (result set): 85 (Lex Aeterna) on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Vituperatum plays Lex Aeterna on each target, with the Arch Bishop cast aura', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_VITUPERATUM]).toEqual({ castAuraEffectId: 830, successEffectId: 85 });
	});
});
