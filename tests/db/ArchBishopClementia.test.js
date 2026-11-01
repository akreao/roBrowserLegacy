import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Clementia (AB_CLEMENTIA 2041): cast aura 830; use packet (result set): 42 (Blessing) on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Clementia plays Blessing on each target, with the Arch Bishop cast aura', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_CLEMENTIA]).toEqual({ castAuraEffectId: 830, successEffectId: 42 });
	});
});
