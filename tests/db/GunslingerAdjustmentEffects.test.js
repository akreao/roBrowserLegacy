import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Adjustment (GS_ADJUSTMENT 505) and Gatling Fever (GS_GATLINGFEVER 517): the official client plays
// 626 (red body glow) on the caster from the use packet, only when its result is set.
// Spec: effect-port/gunslinger-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Adjustment and Gatling Fever effects', () => {
	for (const skill of ['GS_ADJUSTMENT', 'GS_GATLINGFEVER']) {
		it(`${skill} plays 626 only on success`, () => {
			expect(source).toMatch(new RegExp(`SkillEffect\\[SK\\.${skill}\\] = \\{ successEffectId: 626 \\};`));
		});
	}
});
