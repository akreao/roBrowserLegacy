import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Union of the Sun, Moon and Stars (SG_FUSION, skill 444): the official client casts it with the blue
// aura 441 and, when the use packet succeeds, plays T_변신.wav at the player and quakes the screen at
// once (kRO 2025-07-16). 433 was not official. Spec: effect-port/star-gladiator-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'latin1');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Union effects', () => {
	it('casts with the blue aura, then the sound and quake only on success', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.SG_FUSION\] = \{ castAuraEffectId: 441, successEffectIdOnCaster: \['sg_fusion_sound', 'quake'\] \};/
		);
	});

	it('plays the transform sound at once', () => {
		const start = table.indexOf('\tsg_fusion_sound: [');
		const row = table.slice(start, table.indexOf('],', start));
		expect(row).toMatch(/wav: 'effect\/t_\\xba\\xaf\\xbd\\xc5',/);
		expect(row).not.toMatch(/delayWav/);
	});
});
