import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Raging Quadruple Blow (MO_CHAINCOMBO, 272): as the damage packet arrives the official
// client plays 262 and 273 on the target and 263 on the caster; every hit plays the hit
// flash 0 and 122. Spec: effect-port/monk-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Raging Quadruple Blow effects', () => {
	it('plays 262, 273 and 263 at packet arrival and 0 + 122 on each hit', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.MO_CHAINCOMBO\] = \{ damageEffectIdOnTarget: \[262, 273\], damageEffectIdOnCaster: 263, hitEffectId: \[0, 122\] \};/
		);
	});
});
