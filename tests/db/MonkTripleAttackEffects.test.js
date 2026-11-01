import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Raging Trifecta Blow (MO_TRIPLEATTACK, 263): the official client plays 329 on the
// caster as the damage packet arrives (sounds on ticks 10, 20, 30) and the hit flash 0
// on each hit. Spec: effect-port/monk-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Raging Trifecta Blow effects', () => {
	it('plays 329 on the caster at packet arrival and 0 on each hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.MO_TRIPLEATTACK\] = \{ damageEffectIdOnCaster: 329, hitEffectId: 0 \};/
		);
	});

	it('plays 329 sounds on ticks 10, 20 and 30', () => {
		const table = effectTableSource().replace(/\r\n/g, '\n');
		const row = table.slice(table.indexOf('\t329: ['), table.indexOf('\t331: ['));
		expect([...row.matchAll(/delayWav: (\d+)/g)].map(m => Number(m[1]))).toEqual([167, 333, 500]);
	});
});
