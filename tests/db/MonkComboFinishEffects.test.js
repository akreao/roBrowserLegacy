import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Raging Thrust (MO_COMBOFINISH, 273): as the damage packet arrives the official client
// shakes the camera, plays mon_맹룡과강.wav and launches 263 and 330 on the caster; the hit
// plays 0 and 1. 330 (white02.bmp prims) has no roBrowser row yet.
// Spec: effect-port/monk-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Raging Thrust effects', () => {
	it('plays the quake, the sound and 263 at packet arrival and 0 + 1 on the hit', () => {
		expect(source).toMatch(
			/SkillEffect\[SK\.MO_COMBOFINISH\] = \{ damageEffectIdOnCaster: \['quake', 'monk_raging_thrust_sound', 263\], hitEffectId: \[0, 1\] \};/
		);
	});
});
