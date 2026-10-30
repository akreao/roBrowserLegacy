import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Soul Division (SP_SOULDIVISION, skill 2606): the official client's skilleffectinfo row plays t_치잉.wav and
// launches 1209 (EF_BLINK_BODY, not ported) on the target as each damage packet arrives (rAthena sends a
// no-damage one). No use case, no hit flash. kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Soul Division', () => {
	it('plays the sound on the target at damage arrival', () => {
		expect(SkillEffect[SK.SP_SOULDIVISION]).toEqual({ damageEffectIdOnTarget: 'ef_sp_souldivision_sound' });
		expect(EffectTable.ef_sp_souldivision_sound).toEqual([{ wav: 'effect/t_\xc4\xa1\xc0\xd7', attachedEntity: true }]);
	});
});
