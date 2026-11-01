import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Acolyte support skills: the official client's use-packet handler shows their effects only
// when the packet's result is set. Increase AGI and Blessing damage a player under Change Undead:
// 0 on every hit, 1 with the first.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

const hit = ', hitEffectId: 0, firstHitEffectId: 1';

const rows = {
	AL_INCAGI: `37${hit}`,
	AL_DECAGI: 38,
	AL_HOLYWATER: 39,
	AL_CRUCIS: 40,
	AL_ANGELUS: 41,
	AL_BLESSING: `42${hit}`,
	AL_CURE: 66
};

describe('Acolyte support skill effects', () => {
	for (const [skill, effectId] of Object.entries(rows)) {
		it(`${skill} plays ${effectId} only on success`, () => {
			expect(source).toContain(`SkillEffect[SK.${skill}] = { successEffectId: ${effectId} };`);
		});
	}
});
