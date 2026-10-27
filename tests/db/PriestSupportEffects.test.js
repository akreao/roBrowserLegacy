import { describe, expect, it, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';

// Priest support skills: the official client's use-packet handler (kRO 2025-07-16) shows their
// effects only when the packet's result is set. Kyrie Eleison, Magnificat and Gloria play on the
// packet's source. Spec: effect-port/priest-audit.md.

const onTarget = {
	PR_IMPOSITIO: 84,
	PR_SUFFRAGIUM: 88,
	PR_ASPERSIO: 86,
	PR_SLOWPOISON: 136,
	PR_STRECOVERY: 78,
	PR_LEXDIVINA: 87,
	PR_LEXAETERNA: 85
};

const onSource = {
	PR_KYRIE: 112,
	PR_MAGNIFICAT: 76,
	PR_GLORIA: 75
};

describe('Priest support skill effects', () => {
	for (const [skill, effectId] of Object.entries(onTarget)) {
		it(`${skill} plays ${effectId} on the target only on success`, () => {
			const row = SkillEffect[SK[skill]];
			expect(row.successEffectId).toBe(effectId);
			expect(row.effectId).toBeUndefined();
		});
	}

	for (const [skill, effectId] of Object.entries(onSource)) {
		it(`${skill} plays ${effectId} on the source only on success`, () => {
			const row = SkillEffect[SK[skill]];
			expect(row.successEffectIdOnCaster).toBe(effectId);
			expect(row.effectId).toBeUndefined();
		});
	}

	it('Aspersio damage plays the hit flash and 152 once per packet', () => {
		const row = SkillEffect[SK.PR_ASPERSIO];
		expect(row.hitEffectId).toEqual([0, 152]);
		expect(row.hitEffectOnce).toBe(true);
	});
});
