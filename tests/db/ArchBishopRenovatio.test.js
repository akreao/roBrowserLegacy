import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Renovatio (AB_RENOVATIO 2050): cast aura 58; use packet (result set): AB_renovatio.wav and 719 on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Renovatio plays its sound on each target on success, with the white cast aura', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_RENOVATIO]).toEqual({ castAuraEffectId: 58, successEffectId: 719 });
		expect(EffectTable[719]).toEqual([{ wav: 'effect/ab_renovatio', attachedEntity: true }]);
	});
});
