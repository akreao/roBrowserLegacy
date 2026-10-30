import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Espa (SP_SPA, skill 2602): when the use packet has the result set, the official client's skilleffectinfo
// row plays t_에너지방출.wav and launches 1204 (EF_SMA_BLACK, SmaBlackEffect.js) on the caster, told the target's
// position. Hit flash 180 (EF_HITDARK, HitDarkEffect.js). kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Espa', () => {
	it('plays the use sound on the caster on success', () => {
		expect(SkillEffect[SK.SP_SPA]).toMatchObject({ successEffectIdOnCaster: ['ef_sp_spa_sound', 1204] });
		expect(EffectTable.ef_sp_spa_sound).toEqual([{ wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2', attachedEntity: true }]);
	});
});
