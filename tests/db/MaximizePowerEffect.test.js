import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Maximize Power (BS_MAXIMIZE, skill 114): the official client plays 104 (EF_MAXPOWER) on the source only
// when the use packet succeeds, and nothing at cast start. 104 plays black_maximize_power_circle.wav on
// tick 0, black_maximize_power_sword.wav on ticks 40 and 47 and black_maximize_power_sword_bic.wav on
// tick 65 (kRO 2025-07-16). Spec: effect-port/blacksmith-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();

describe('Maximize Power effects', () => {
	it('plays 104 on the source only on success, nothing at cast start', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.BS_MAXIMIZE\] = \{ successEffectIdOnCaster: 104 \};/);
		expect(table).not.toMatch(/maximize_power_sounds/);
	});

	it('plays the four sounds on the official ticks', () => {
		const start = table.indexOf('//EF_MAXPOWER');
		const row = table.slice(start, table.indexOf('],', start));
		const sounds = [...row.matchAll(/wav: 'effect\/black_maximize_power_(\w+)',(?:\s+delayWav: (\d+),)?/g)].map(
			m => [m[1], Number(m[2] || 0)]
		);
		expect(sounds).toEqual([
			['circle', 0],
			['sword', 667],
			['sword', 783],
			['sword_bic', 1083]
		]);
	});
});
