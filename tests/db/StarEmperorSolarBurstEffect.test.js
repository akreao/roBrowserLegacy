import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Solar Burst (SJ_SOLARBURST, skill 2592): when the use packet has the result set, the official client's
// skilleffectinfo row plays g데모닉화이어.wav and launches 1218 (solar_burst.str) on the caster. Nothing at
// damage arrival, no hit flash. kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Solar Burst', () => {
	it('plays its STR and sound on the caster on success', () => {
		expect(SkillEffect[SK.SJ_SOLARBURST]).toEqual({ successEffectIdOnCaster: 'ef_sj_solarburst' });
		expect(EffectTable.ef_sj_solarburst).toEqual([
			{
				type: 'STR',
				file: 'solar_burst/solar_burst',
				texturePath: 'solar_burst/',
				wav: 'effect/g\xb5\xa5\xb8\xf0\xb4\xd0\xc8\xad\xc0\xcc\xbe\xee',
				attachedEntity: true
			}
		]);
	});
});
