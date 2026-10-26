import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Double Strafe (AC_DOUBLE, skill 46): the official client plays no effect of its own,
// shows one arrow per damage packet (as for a normal bow attack), and on each hit that
// lands plays the standard hit flash (0) and EF_HIT2 (1) on the target.
// Spec: effect-port/archer-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Double Strafe effects', () => {
	it('plays one arrow per damage packet and 0 + 1 on each hit, nothing at cast', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.AC_DOUBLE\] = \{ damageEffectIdOnTarget: 'ef_arrow_projectile', hitEffectId: \[0, 1\] \};/
		);
	});

	it('is shared by the mercenary Double Strafe', () => {
		expect(source).toMatch(/SkillEffect\[SK\.MA_DOUBLE\] = SkillEffect\[SK\.AC_DOUBLE\];/);
	});
});
