import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Storm Blast (RK_STORMBLAST 2017): use packet (result set): 17 on the caster; quake, mon_맹룡과강.wav, 263
// and 330 (not ported) on the target.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Storm Blast', () => {
	it('plays 17 on the caster and the quake, sound and 263 on the target on success', () => {
		expect(SkillEffect[SK.RK_STORMBLAST]).toMatchObject({
			successEffectIdOnCaster: 17,
			successEffectId: ['quake', 'ef_rk_stormblast_sound', 263]
		});
		expect(EffectTable.ef_rk_stormblast_sound).toEqual([{ wav: 'effect/mon_\xb8\xcd\xb7\xe6\xb0\xfa\xb0\xad', attachedEntity: true }]);
	});
});
