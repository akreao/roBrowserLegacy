import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Summon Attack Fire / Wind / Water / Earth (WL_SUMMON_ATK_* 2225-2228): damage arrival: 49 / 52 / 51 / 147 on the target.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('sphere attacks play the element hit on the target as the damage arrives', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_SUMMON_ATK_FIRE]).toEqual({ arrivalEffectIdOnTarget: 49 });
		expect(SkillEffect[SK.WL_SUMMON_ATK_WIND]).toEqual({ arrivalEffectIdOnTarget: 52 });
		expect(SkillEffect[SK.WL_SUMMON_ATK_WATER]).toEqual({ arrivalEffectIdOnTarget: 51 });
		expect(SkillEffect[SK.WL_SUMMON_ATK_GROUND]).toEqual({ arrivalEffectIdOnTarget: 147 });
		expect(EffectTable.ef_wl_summon_atk_fire).toBeUndefined();
	});
});
