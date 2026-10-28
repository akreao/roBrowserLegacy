import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Hatred of the Sun, Moon and Stars (SG_HATE, skill 434): the official client casts it with the blue
// aura 441 and, when the use packet succeeds, plays T_등록.wav at the player and 543 on the target
// (kRO 2025-07-16). 543 (a body glow; its roBrowser row holds Kaahi's sound) is not drawn yet. No
// ground effect. Spec: effect-port/star-gladiator-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'latin1');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Hatred effects', () => {
	it('casts with the blue aura and plays the sound only on success', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.SG_HATE\] = \{ castAuraEffectId: 441, successEffectId: 'sg_hate_sound' \};/
		);
	});

	it('plays the register sound at once', () => {
		const start = table.indexOf('\tsg_hate_sound: [');
		const row = table.slice(start, table.indexOf('],', start));
		expect(row).toMatch(/wav: 'effect\/t_\\xb5\\xee\\xb7\\xcf',/);
		expect(row).not.toMatch(/delayWav/);
	});
});
