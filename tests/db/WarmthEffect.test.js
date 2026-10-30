import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Warmth of the Sun, Moon and Stars (SG_SUN_WARM / SG_MOON_WARM / SG_STAR_WARM, skills 428-430): the
// official client plays 418, 544 and 572 on the source only when the use packet succeeds; 572 plays
// T_따듯한마법.wav on tick 10 (kRO 2025-07-16). 418 and 544 (sparks and the red body light) are kept
// while the Warm status is on (StatusEffectTable.js; sparks in WarmthSparks.test.js).
// Spec: effect-port/star-gladiator-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'latin1');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Warmth effects', () => {
	it('plays 572 on the source only on success', () => {
		for (const name of ['SUN', 'MOON', 'STAR']) {
			expect(skills).toMatch(
				new RegExp(`SkillEffect\\[SK\\.SG_${name}_WARM\\] = \\{ successEffectIdOnCaster: 572 \\};`)
			);
		}
	});

	it('plays the warm magic sound on tick 10', () => {
		const start = table.indexOf('//EF_HATED2');
		const row = table.slice(start, table.indexOf('],', start));
		expect(row).toMatch(/wav: 'effect\/t_\\xb5\\xfb\\xb5\\xed\\xc7\\xd1\\xb8\\xb6\\xb9\\xfd',/);
		expect(row).toMatch(/delayWav: 10 \* \(1000 \/ 60\),/);
	});
});
