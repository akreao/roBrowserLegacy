import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Gravitation Field (HW_GRAVITATION, skill 484), as the official client plays it: the ground
// packet plays wizard_earthspike.wav at the cell (any level), the unit (0xb8) holds the field's
// look, and each hit from the unit shows only the standard hit flash (0).
// Spec: effect-port/wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Gravitation Field effects', () => {
	it('plays the sound from the ground packet and the hit flash per unit hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.HW_GRAVITATION\] = \{ groundEffectIdByLevel: \['ef_gravitation_wav'\], groundEffectId: '522_ground', hitEffectId: \[0\] \};/
		);
		const table = effectTableSource().replace(/\r\n/g, '\n');
		const start = table.indexOf('\n\tef_gravitation_wav: [');
		expect(table.slice(start, table.indexOf('\n\t],', start))).toContain("wav: 'effect/wizard_earthspike'");
	});
});
