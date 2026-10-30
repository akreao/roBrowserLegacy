import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import StatusConst from 'DB/Status/StatusConst.js';

// Soul Curse (SP_SOULCURSE, skill 2601): the official client's hard-coded use case (result set, target known)
// spawns 1238 (soul_curse.str) on the target. EFST_SOULCURSE (1125): when the status starts and the actor has
// no 1362 yet, 1362 (efst_qscaraba\qscaraba.str, kept until removed) is spawned and s포이즌버스터.wav plays;
// 1362 is removed when the status ends. kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Soul Curse', () => {
	it('plays the curse on the target on success and keeps the mark while the status is on', () => {
		expect(SkillEffect[SK.SP_SOULCURSE]).toEqual({ successEffectId: 'ef_sp_soulcurse' });
		expect(EffectTable.ef_sp_soulcurse).toEqual([
			{ type: 'STR', file: 'soul_curse/soul_curse', texturePath: 'soul_curse/', attachedEntity: true }
		]);
		expect(StatusEffectTable[StatusConst.SOULCURSE]).toEqual({ loop: ['ef_sp_soulcurse_mark'] });
		expect(EffectTable.ef_sp_soulcurse_mark).toEqual([
			{
				type: 'STR',
				file: 'efst_qscaraba/qscaraba',
				texturePath: 'efst_qscaraba/',
				repeat: true,
				attachedEntity: true
			},
			{ wav: 'effect/s\xc6\xf7\xc0\xcc\xc1\xf0\xb9\xf6\xbd\xba\xc5\xcd', attachedEntity: true }
		]);
	});
});
