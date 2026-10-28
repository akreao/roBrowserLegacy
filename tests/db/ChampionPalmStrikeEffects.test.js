import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Raging Palm Strike (CH_PALMSTRIKE, 370): as the damage packet arrives the official client
// shakes the camera, plays 맹호경파산.wav and launches 376 on the target; the hit plays the
// hit flash 0. Spec: effect-port/monk-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Raging Palm Strike effects', () => {
	it('plays the quake and 376 at packet arrival and 0 on the hit', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.CH_PALMSTRIKE\] = \{ damageEffectIdOnCaster: 'quake', damageEffectIdOnTarget: 376, hitEffectId: 0 \};/
		);
	});
});
