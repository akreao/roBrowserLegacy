import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Camera from 'Renderer/Camera.js';
import { gravitationCastEffect, gravitationFieldEffect, shakeOnce } from 'DB/Effects/GravitationFieldEffect.js';

// Gravitation Field (HW_GRAVITATION, skill 484), as the official client plays it: the ground
// packet plays wizard_earthspike.wav at the cell and effect 522 there 260 ms later, each unit
// (0xb8) plays 522 as it appears, and each hit from the unit shows only the standard hit flash (0).
// Spec: effect-port/gravitation-field.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Gravitation Field effects', () => {
	it('plays the sound and 522 from the ground packet, 522 on each unit and the hit flash per unit hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.HW_GRAVITATION\] = \{ groundEffectIdByLevel: \['ef_gravitation_cast'\], groundEffectId: 522, hitEffectId: \[0\] \};/
		);
		expect(read('DB/Skills/SkillUnit.js')).toContain('SkillUnit[SU.UNT_GRAVITATION] = EC.EF_GRAVITATION;');
		const table = read('DB/Effects/EffectTable.js');
		expect(table).toContain('\n\t522: gravitationFieldEffect,');
		expect(table).toContain('\n\tef_gravitation_cast: gravitationCastEffect,');
		expect(table).not.toContain('522_ground');

		expect(gravitationCastEffect[0]).toEqual({ wav: 'effect/wizard_earthspike' });
		expect(gravitationCastEffect[1].duration).toBeCloseTo(260 + (120 * 1000) / 60);
		expect(gravitationFieldEffect[0].duration).toBeCloseTo((141 * 1000) / 60);
	});

	it('shakes the screen once for copies that start together', () => {
		const before = Camera.quakes.length;
		for (let i = 0; i < 25; i++) {
			shakeOnce(5000);
		}
		shakeOnce(5260);
		expect(Camera.quakes.length - before).toBe(2);
	});
});
