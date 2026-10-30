import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// New Moon Kick (SJ_NEWMOONKICK, skill 2579): when the use packet has the result set, the official client's
// skilleffectinfo row launches 1229 (newmoon_kick.str) on the caster. Nothing at damage arrival, no hit
// flash. kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('New Moon Kick', () => {
	it('plays its STR on the caster on success', () => {
		expect(SkillEffect[SK.SJ_NEWMOONKICK]).toEqual({ successEffectIdOnCaster: 'ef_sj_newmoonkick' });
		expect(EffectTable.ef_sj_newmoonkick).toEqual([
			{ type: 'STR', file: 'newmoon_kick/newmoon_kick', texturePath: 'newmoon_kick/', attachedEntity: true }
		]);
	});
});
