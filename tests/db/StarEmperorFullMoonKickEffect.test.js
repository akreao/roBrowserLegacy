import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Full Moon Kick (SJ_FULLMOONKICK, skill 2576): when the use packet has the result set, the official client's
// skilleffectinfo row launches 399 (EF_BASH3D3), 1223 (CStormKickEffect, not ported) and 1230
// (fullmoon_kick.str) on the caster. Nothing at damage arrival, no hit flash. kRO 2025-07-16.
// Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Full Moon Kick', () => {
	it('plays 399 and the STR on the caster on success', () => {
		expect(SkillEffect[SK.SJ_FULLMOONKICK]).toEqual({ successEffectIdOnCaster: [399, 'ef_sj_fullmoonkick'] });
		expect(EffectTable.ef_sj_fullmoonkick).toEqual([
			{ type: 'STR', file: 'fullmoon_kick/fullmoon_kick', texturePath: 'fullmoon_kick/', attachedEntity: true }
		]);
	});
});
