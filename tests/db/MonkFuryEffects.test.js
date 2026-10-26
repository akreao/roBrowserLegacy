import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Fury (MO_EXPLOSIONSPIRITS, 270): when the use packet reports success the official
// client shakes the camera, plays mon_폭기.wav and launches 203 and 261 on the caster.
// No cast-start effect; 261 itself is silent. Spec: effect-port/monk-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Fury effects', () => {
	it('plays the quake, the sound, 203 and 261 on the caster on success', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.MO_EXPLOSIONSPIRITS\] = \{ successEffectIdOnCaster: \['quake', 'monk_fury_sound', 203, 261\] \};/
		);
	});

	it('keeps the sound out of 261', () => {
		const table = read('DB/Effects/EffectTable.js');
		const row = table.slice(table.indexOf('\t261: ['), table.indexOf('\n\t],', table.indexOf('\t261: [')));
		expect(row).not.toMatch(/wav:/);
		expect(table).toMatch(/monk_fury_sound: \[\n\t\t\{\n[^\n]*\n\t\t\twav: 'effect\/mon_\\xc6\\xf8\\xb1\\xe2'/);
	});
});
