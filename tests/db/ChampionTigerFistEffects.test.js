import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Glacier Fist (CH_TIGERFIST, 371): as the damage packet arrives the official client
// shakes the camera and launches 377 (mon_맹룡과강.wav on tick 5) and 263 on the caster;
// the hit plays 0 and 1. Spec: effect-port/monk-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Glacier Fist effects', () => {
	it('plays the quake, 377 and 263 on the caster at packet arrival and 0 + 1 on the hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.CH_TIGERFIST\] = \{ damageEffectIdOnCaster: \['quake', 377, 263\], hitEffectId: \[0, 1\] \};/
		);
	});

	it('plays mon_맹룡과강.wav on 377 tick 5', () => {
		const table = read('DB/Effects/EffectTable.js');
		const row = table.slice(table.indexOf('\t377: ['), table.indexOf('\t378: ['));
		expect(row).toMatch(/wav: 'effect\/mon_\\xb8\\xcd\\xb7\\xe6\\xb0\\xfa\\xb0\\xad',\n\t\t\tdelayWav: 83,/);
	});
});
