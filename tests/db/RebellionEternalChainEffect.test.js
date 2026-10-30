import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Eternal Chain (RL_E_CHAIN, skill 2558): when the use packet has the result set, the official client's
// skilleffectinfo row launches 1137 (RL_e_chain\eternal.str) on the caster. Nothing on failure. kRO 2025-07-16.
// Spec: effect-port/rebellion-skills.md.

describe("Eternal Chain", () => {
	it('plays its effect on the caster on success only', () => {
		expect(SkillEffect[SK.RL_E_CHAIN]).toEqual({ successEffectIdOnCaster: 'ef_rl_e_chain' });
	});
});
