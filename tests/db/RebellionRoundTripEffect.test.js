import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Round Trip (RL_R_TRIP, skill 2565): when the use packet has the result set, the official client's
// hard-coded use packet case launches 637 (EF_DESPERADO) on the caster (then 435 with no owner, not ported). Nothing on failure. kRO 2025-07-16.
// Spec: effect-port/rebellion-skills.md.

describe("Round Trip", () => {
	it('plays its effect on the caster on success only', () => {
		expect(SkillEffect[SK.RL_R_TRIP]).toEqual({ successEffectIdOnCaster: 637 });
	});
});
