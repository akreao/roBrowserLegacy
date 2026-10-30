import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Heat Barrel (RL_HEAT_BARREL, skill 2568): when the use packet has the result set, the official client's
// skilleffectinfo row launches 1138 (RL_heat_barrel\htb.str) on the caster. Nothing on failure. kRO 2025-07-16.
// Spec: effect-port/rebellion-skills.md.

describe("Heat Barrel", () => {
	it('plays its effect on the caster on success only', () => {
		expect(SkillEffect[SK.RL_HEAT_BARREL]).toEqual({ successEffectIdOnCaster: 'ef_rl_heat_barrel' });
	});
});
