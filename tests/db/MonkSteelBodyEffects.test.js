import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Mental Strength (MO_STEELBODY, 268): when the use packet reports success the official
// client shakes the camera, plays mon_맹룡과강.wav and launches 261 on the caster.
// Spec: effect-port/monk-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Mental Strength effects', () => {
	it('plays the quake, the sound and 261 on the caster on success', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.MO_STEELBODY\] = \{ successEffectIdOnCaster: \['quake', 'monk_raging_thrust_sound', 261\] \};/
		);
	});

	it('plays mon_맹룡과강.wav', () => {
		expect(effectTableSource().replace(/\r\n/g, '\n')).toMatch(
			/monk_raging_thrust_sound: \[\n\t\t\{\n(\t\t\t\/\/[^\n]*\n)+\t\t\twav: 'effect\/mon_\\xb8\\xcd\\xb7\\xe6\\xb0\\xfa\\xb0\\xad'/
		);
	});
});
