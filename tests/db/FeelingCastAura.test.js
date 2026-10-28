import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Feeling the Sun, Moon and Stars (SG_FEEL, skill 427): the official client's cast-aura picker gives it
// 441 (EF_BLUECASTING) instead of the element aura; its use packet plays nothing (kRO 2025-07-16).
// Spec: effect-port/star-gladiator-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Feeling effects', () => {
	it('casts with the blue aura and plays nothing on use', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.SG_FEEL\] = \{ castAuraEffectId: 441 \};/);
	});
});
