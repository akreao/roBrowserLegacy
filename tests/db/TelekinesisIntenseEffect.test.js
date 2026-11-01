import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import SC from 'DB/Status/StatusConst.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Telekinesis Intense (WL_TELEKINESIS_INTENSE 5012), kRO 2025-07-16: the use packet plays only
// effect\Wl_Telekinesis_Intense.wav on the caster (0xd16a99); 1048 comes from the status (EFST 717, switch case
// 0xc51ae3: remove every copy, relaunch when on). The 1048 STR has no sound of its own.

describe('Telekinesis Intense', () => {
	it('plays only the sound from the use packet', () => {
		expect(SkillEffect[SK.WL_TELEKINESIS_INTENSE]).toEqual({ successEffectIdOnCaster: 'ef_wl_telekinesis_intense_sound' });
		expect(EffectTable.ef_wl_telekinesis_intense_sound).toEqual([{ wav: 'effect/wl_telekinesis_intense', attachedEntity: true }]);
	});

	it('draws 1048 while the status is on, without a sound', () => {
		expect(StatusEffectTable[SC.TELEKINESIS_INTENSE]).toEqual({ restart: [1048], stop: [1048] });
		expect(EffectTable[1048][0].wav).toBeUndefined();
		expect(EffectTable[1048][0].file).toBe('wl_telekinesis_intense');
	});
});
