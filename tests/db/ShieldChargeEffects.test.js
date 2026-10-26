import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Shield Charge (CR_SHIELDCHARGE, skill 250), as the official client plays it: 246
// (shield_charge.str, no sound) on the target as each damage packet arrives, and the standard
// hit flash 0 once per damage packet. Spec: effect-port/crusader-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Shield Charge effects', () => {
	it('plays 246 on the target at packet arrival and the hit flash once', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.CR_SHIELDCHARGE\] = \{ damageEffectIdOnTarget: 246, hitEffectId: 0, hitEffectOnce: true \};/
		);
	});
});
