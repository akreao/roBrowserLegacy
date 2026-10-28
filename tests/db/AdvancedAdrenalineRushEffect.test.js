import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Advanced Adrenaline Rush (BS_ADRENALINE2, skill 459): the official client runs the same use-packet case as
// Adrenaline Rush (98 on the source) and never loads adrenaline.str (kRO 2025-07-16).
// Spec: effect-port/blacksmith-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Advanced Adrenaline Rush effects', () => {
	it('shares the Adrenaline Rush entry and is not overridden later', () => {
		const rows = skills.match(/^SkillEffect\[SK\.BS_ADRENALINE2\] = .*$/gm);
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatch(/^SkillEffect\[SK\.BS_ADRENALINE2\] = SkillEffect\[SK\.BS_ADRENALINE\];/);
	});
});
