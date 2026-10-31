import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Recognized Spell (WL_RECOGNIZEDSPELL 2206): use packet (result set): wl_recognizedspell.wav; cast aura 58 plus 803.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Recognized Spell sound on success, white cast aura', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_RECOGNIZEDSPELL]).toEqual({ successEffectIdOnCaster: 'ef_wl_recognizedspell_sound', castAuraEffectId: 58 });
		expect(EffectTable.ef_wl_recognizedspell_sound).toEqual([{ wav: 'effect/wl_recognizedspell', attachedEntity: true }]);
	});
});
