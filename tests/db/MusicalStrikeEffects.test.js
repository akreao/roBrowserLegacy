import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Musical Strike (BA_MUSICALSTRIKE 316) and Throw Arrow (DC_THROWARROW 324): no case of their
// own in the official client and not in its hit map, so like Arrow Repel they show the
// attack arrow once per damage packet and only the standard hit flash (0) on each hit.
// Spec: effect-port/bard-dancer-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Musical Strike and Throw Arrow effects', () => {
	for (const skill of ['BA_MUSICALSTRIKE', 'DC_THROWARROW']) {
		it(`${skill} plays one arrow per damage packet and the hit flash on each hit`, () => {
			expect(source).toMatch(
				new RegExp(
					`SkillEffect\\[SK\\.${skill}\\] = \\{ hideCastAura: true, damageEffectIdOnTarget: 'ef_arrow_projectile', hitEffectId: \\[0\\] \\};`
				)
			);
		});
	}
});
