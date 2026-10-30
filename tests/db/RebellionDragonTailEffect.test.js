import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Dragon Tail (RL_D_TAIL, skill 2566): the official client's skilleffectinfo row plays RL_D_TAIL.wav and launches 1068 (RL_d_tail\dtdt.str)
// on the target as each damage packet arrives (splash and misses included). No hit flash.
// kRO 2025-07-16. Spec: effect-port/rebellion-skills.md.

describe("Dragon Tail", () => {
	it('plays its effect on the target as each damage packet arrives', () => {
		expect(SkillEffect[SK.RL_D_TAIL]).toEqual({ damageEffectIdOnTarget: 'ef_rl_d_tail' });
	});
});
