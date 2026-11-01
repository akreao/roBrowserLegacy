import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Hatred of the Sun, Moon and Stars (SG_HATE, skill 434): the official client casts it with the blue
// aura 441 and, when the use packet succeeds, plays T_등록.wav at the player and 543 on the target
// (kRO 2025-07-16). 543 is a body glow (SoulBodyEffects.js). No
// ground effect. Spec: effect-port/star-gladiator-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'latin1');
const table = effectTableSource();

describe('Hatred effects', () => {
	it('casts with the blue aura and plays the sound on the caster and 543 on the target only on success', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.SG_HATE\] = \{ castAuraEffectId: 441, successEffectIdOnCaster: 'sg_hate_sound', successEffectId: 543 \};/
		);
	});

	it('plays the register sound at once', () => {
		const start = table.indexOf('\tsg_hate_sound: [');
		const row = table.slice(start, table.indexOf('],', start));
		expect(row).toMatch(/wav: 'effect\/t_\\xb5\\xee\\xb7\\xcf',/);
		expect(row).not.toMatch(/delayWav/);
	});
});
