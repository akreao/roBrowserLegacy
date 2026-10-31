import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Soul Expansion (WL_SOULEXPANSION 2202): no cast aura, 1587 + 1588 on the caster while casting; hit flash 1591 on every
// hit, hit-map effect 1592 with the first.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Soul Expansion cast and hit effects as the official client plays them', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_SOULEXPANSION]).toEqual({ hideCastAura: true, beginCastEffectId: [1587, 1588], hitEffectId: 1591, firstHitEffectId: 1592 });
		expect(EffectTable[1587][0]).toMatchObject({ type: 'STR', file: 'new_soulexpansion/new_soulexpansion_cast/new_soulexpansion_cast', castLoop: true });
		expect(EffectTable[1588][0]).toMatchObject({ castLoop: true, renderBeforeEntities: true });
		expect(EffectTable[1591][0].file).toBe('new_soulexpansion/new_soulexpansion_hit/new_soulexpansion_hit');
		expect(EffectTable[1592][0].file).toBe('new_soulexpansion/new_soulexpansion_hit_bottom/new_soulexpansion_hit_bottom');
	});
});
