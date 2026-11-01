import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Stasis (WL_STASIS 2209): use packet (result set): 799 on the caster; cast aura 441.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Stasis on the caster on success, blue cast aura', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_STASIS]).toEqual({ successEffectIdOnCaster: 799, castAuraEffectId: 441 });
	});
});
