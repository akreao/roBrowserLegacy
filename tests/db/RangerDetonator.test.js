import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Detonator (RA_DETONATOR 2237): no use or ground effect; damage arrival: 750 on the caster.
// kRO 2025-07-16, spec: effect-port/ranger-skills.md.

describe('Detonator sparkles on the caster as the damage arrives only', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.RA_DETONATOR]).toEqual({ arrivalEffectIdOnCaster: 750 });
		expect(EffectTable[750]).toBeDefined();
	});
});
