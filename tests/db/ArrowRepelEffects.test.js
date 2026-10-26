import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Arrow Repel (AC_CHARGEARROW, skill 148): the official client shows one arrow per damage
// packet (as for a normal bow attack) and on each hit that lands plays only the standard
// hit flash (0) on the target; the skill is not in the client's hit map.
// Spec: effect-port/archer-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Arrow Repel effects', () => {
	it('plays one arrow per damage packet and the hit flash on each hit', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.AC_CHARGEARROW\] = \{ hideCastAura: true, damageEffectIdOnTarget: 'ef_arrow_projectile', hitEffectId: \[0\] \};/
		);
	});

	it('is shared by the mercenary Arrow Repel', () => {
		expect(source).toMatch(/SkillEffect\[SK\.MA_CHARGEARROW\] = SkillEffect\[SK\.AC_CHARGEARROW\];/);
	});
});
