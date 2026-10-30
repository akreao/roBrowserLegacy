import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Platinum Alter (RL_P_ALTER, skill 2563): when the use packet has the result set, the official client's
// skilleffectinfo row launches 1077 (RL_P_ALTER\platinum.str, a hard-coded case) on the caster. Nothing on failure. kRO 2025-07-16.
// Spec: effect-port/rebellion-skills.md.

describe("Platinum Alter", () => {
	it('plays its effect on the caster on success only', () => {
		expect(SkillEffect[SK.RL_P_ALTER]).toEqual({ successEffectIdOnCaster: 'ef_rl_p_alter' });
	});
});
