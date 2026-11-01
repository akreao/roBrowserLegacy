import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Sacrament (AB_SECRAMENT 2515): cast aura 58; use packet (result set): priest_suffragium.wav and 1287 new_secrament on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Sacrament plays the official effect and sound on each target on success', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_SECRAMENT]).toEqual({ castAuraEffectId: 58, successEffectId: ['ef_ab_secrament_sound', 1287] });
		expect(EffectTable.ef_ab_secrament_sound).toEqual([{ wav: 'effect/priest_suffragium', attachedEntity: true }]);
		expect(EffectTable[1287][0]).toMatchObject({ type: 'STR', file: 'new_secrament/new_secrament/new_secrament', min: 'mineffect/new_secrament/new_secrament/new_secrament', attachedEntity: true });
		expect(EffectTable.ef_ab_secrament).toBeUndefined();
	});
});
