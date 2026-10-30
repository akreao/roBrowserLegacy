import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import StatusConst from 'DB/Status/StatusConst.js';

// Flash Kick (SJ_FLASHKICK, skill 2580): no skilleffectinfo row and no hard-coded case, so nothing plays from
// its packets. The official client's EFST_FLASHKICK (1041) case removes 1221 (flash_kick.str, a CEZ2STREffect
// in the "stays" list: it plays until removed) from the actor and launches it again while the status is on.
// kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Flash Kick', () => {
	it('keeps the mark on the actor while the status is on', () => {
		expect(SkillEffect[SK.SJ_FLASHKICK]).toEqual({});
		expect(StatusEffectTable[StatusConst.FLASHKICK]).toEqual({ loop: ['ef_sj_flashkick'] });
		expect(EffectTable.ef_sj_flashkick).toEqual([
			{ type: 'STR', file: 'flash_kick/flash_kick', texturePath: 'flash_kick/', repeat: true, attachedEntity: true }
		]);
	});
});
