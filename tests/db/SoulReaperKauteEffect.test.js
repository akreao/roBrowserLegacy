import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Kaute (SP_KAUTE, skill 2612): the official client's hard-coded use case (result set) launches 1208
// (EF_ENERGYDRAIN_BLACK, not ported) on the caster, then plays 흡기.wav at the target and launches 1207 (not
// ported) on it. kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Kaute', () => {
	it('plays the sound on the target on success', () => {
		expect(SkillEffect[SK.SP_KAUTE]).toEqual({ successEffectId: 'ef_sp_kaute_sound' });
		expect(EffectTable.ef_sp_kaute_sound).toEqual([{ wav: 'effect/\xc8\xed\xb1\xe2', attachedEntity: true }]);
	});
});
