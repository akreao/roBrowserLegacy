import { describe, expect, it, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';

// B.S. Sacramenti and Sanctuary in the official client (kRO 2025-07-16): the ground packet plays
// 91 / 83 at the cell; the use packets play nothing; damage plays the hit flash.
// Spec: effect-port/priest-audit.md.
describe('B.S. Sacramenti and Sanctuary', () => {
	it('B.S. Sacramenti plays 91 only from the ground packet, the hit flash on damage', () => {
		expect(SkillEffect[SK.PR_BENEDICTIO]).toEqual({
			groundEffectIdByLevel: [91],
			hitEffectId: [0],
			hitEffectOnce: true
		});
	});

	it('Sanctuary keeps 83 at the cell and 319 on its units, the hit flash on unit hits', () => {
		expect(SkillEffect[SK.PR_SANCTUARY]).toEqual({ effectId: 83, groundEffectId: 319, hitEffectId: [0] });
	});
});
