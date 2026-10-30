import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Slug Shot (RL_SLUGSHOT, skill 2570): the official client's skilleffectinfo row plays RL_SLUGSHOT.wav and launches 1067 (RL_SLUGSHOT\slug.str)
// on the target as each damage packet arrives (splash and misses included). No hit flash.
// kRO 2025-07-16. Spec: effect-port/rebellion-skills.md.

describe("Slug Shot", () => {
	it('plays its effect on the target as each damage packet arrives', () => {
		expect(SkillEffect[SK.RL_SLUGSHOT]).toEqual({ damageEffectIdOnTarget: 'ef_rl_slugshot' });
	});
});
