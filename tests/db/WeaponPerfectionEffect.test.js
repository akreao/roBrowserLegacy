import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Weapon Perfection (BS_WEAPONPERFECT, skill 112): the official client plays 103 (EF_PERFECTION) on the
// target only when the use packet succeeds (kRO 2025-07-16). Spec: effect-port/blacksmith-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Weapon Perfection effects', () => {
	it('plays 103 on the target only on success', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.BS_WEAPONPERFECT\] = \{ successEffectId: 103 \};/);
	});
});
