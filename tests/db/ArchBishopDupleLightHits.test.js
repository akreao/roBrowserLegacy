import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Duple Light Melee / Magic (AB_DUPLELIGHT_MELEE 2055, AB_DUPLELIGHT_MAGIC 2056): as each damage packet's damage arrives,
// 265 (EF_TANJI) on the caster aimed at the target, sphere count 3.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Duple Light Melee and Magic throw the blue sphere at the target', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_DUPLELIGHT_MELEE]).toEqual({ arrivalEffectIdOnCaster: 265 });
		expect(SkillEffect[SK.AB_DUPLELIGHT_MAGIC]).toEqual({ arrivalEffectIdOnCaster: 265 });
		expect(EffectTable[265][0]).toMatchObject({ fromSrc: true, rotateToTarget: true });
	});
});
