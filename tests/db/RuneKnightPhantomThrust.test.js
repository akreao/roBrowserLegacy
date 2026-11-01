import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Phantom Thrust (RK_PHANTOMTHRUST 2020): use packet (result set): 538 (EF_GREENBODY) and 441 on the caster,
// the same on the target.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Phantom Thrust', () => {
	it('plays the blue flash on both on success', () => {
		expect(SkillEffect[SK.RK_PHANTOMTHRUST]).toMatchObject({
			successEffectIdOnCaster: [538, 'ef_rk_bluecasting'],
			successEffectId: [538, 'ef_rk_bluecasting'],
			castAuraEffectId: 12
		});
	});
});
