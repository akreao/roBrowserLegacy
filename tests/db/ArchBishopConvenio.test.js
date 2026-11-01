import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Convenio (AB_CONVENIO 5073): cast aura 58; no use or damage effect.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Convenio casts with the white cast aura', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_CONVENIO]).toEqual({ castAuraEffectId: 58 });
	});
});
