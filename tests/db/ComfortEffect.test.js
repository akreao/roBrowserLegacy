import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Comfort of the Sun, Moon and Stars (SG_SUN_COMFORT / SG_MOON_COMFORT / SG_STAR_COMFORT, skills
// 431-433): the official client plays 488 and 543 on the source only when the use packet succeeds; 488
// plays T_안락한마법.wav on tick 5 (kRO 2025-07-16). No blue cast aura (441) on use. 488's and 543's body
// glows are in SoulBodyEffects.js; 488's rings and 543's sparks are not drawn yet.
// Spec: effect-port/star-gladiator-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'latin1');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/SoulBodyEffects.js'), 'utf8');

describe('Comfort effects', () => {
	it('plays 488 and 543 on the source only on success', () => {
		for (const name of ['SUN', 'MOON', 'STAR']) {
			expect(skills).toMatch(
				new RegExp(`SkillEffect\\[SK\\.SG_${name}_COMFORT\\] = \\{ successEffectIdOnCaster: \\[488, 543\\] \\};`)
			);
		}
	});

	it('plays the comfort magic sound on tick 5', () => {
		const start = table.indexOf('//EF_FLOWERCAST');
		const row = table.slice(start, table.indexOf('],', start));
		expect(row).toMatch(/wav: 'effect\/t_\\xbe\\xc8\\xb6\\xf4\\xc7\\xd1\\xb8\\xb6\\xb9\\xfd',/);
		expect(row).toMatch(/delayWav: Math.round\(5 \* PRIM_TICK_MS\),/);
	});
});
