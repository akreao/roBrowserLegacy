import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Asura Strike (MO_EXTREMITYFIST, 271): as the damage packet arrives the official client
// shakes the camera and plays 266 with mon_아수라 패황권.wav on the target; the hit flash 0
// on the hit. It launches no aura (328 / 510) and no cast-start effect for it.
// Spec: effect-port/monk-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Asura Strike effects', () => {
	it('plays the quake and 266 at packet arrival and 0 on the hit', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.MO_EXTREMITYFIST\] = \{ damageEffectIdOnCaster: 'quake', damageEffectIdOnTarget: 266, hitEffectId: 0 \};/
		);
	});

	it('no longer picks an aura by job', () => {
		expect(source).not.toMatch(/CHAMPION_JOBS/);
	});
});
