import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Electric Shocker 2238, Cluster Bomb 2239, Firing Trap 2253, Icebound Trap 2254: each damage packet plays an effect
// and a sound on its target (146 / 585 / 583 / 135).
// kRO 2025-07-16, spec: effect-port/ranger-skills.md.

describe('trap hits play their explosion and sound on the target', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.RA_ELECTRICSHOCKER]).toEqual({ damageEffectIdOnTarget: [146, 'ef_ra_electricshocker_sound'] });
		expect(SkillEffect[SK.RA_CLUSTERBOMB]).toEqual({ damageEffectIdOnTarget: [585, 'ef_ra_clusterbomb_sound'] });
		expect(SkillEffect[SK.RA_FIRINGTRAP]).toEqual({ damageEffectIdOnTarget: [583, 'ef_ra_firingtrap_sound'] });
		expect(SkillEffect[SK.RA_ICEBOUNDTRAP]).toEqual({ damageEffectIdOnTarget: [135, 'ef_ra_iceboundtrap_sound'] });
		expect(EffectTable.ef_ra_electricshocker_sound).toEqual([{ wav: 'effect/hunter_shockwavetrap', attachedEntity: true }]);
		expect(EffectTable.ef_ra_clusterbomb_sound).toEqual([{ wav: 'effect/hunter_landmine', attachedEntity: true }]);
		expect(EffectTable.ef_ra_firingtrap_sound).toEqual([{ wav: 'effect/\xc6\xf8\xbf\xb0\xb7\xe6', attachedEntity: true }]);
		expect(EffectTable.ef_ra_iceboundtrap_sound).toEqual([{ wav: 'effect/ef_frostdiver', attachedEntity: true }]);
	});
});
