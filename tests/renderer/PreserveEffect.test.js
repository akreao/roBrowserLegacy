import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import { SCHEDULES } from 'Renderer/Effects/CasterMarks.js';

// Preserve (ST_PRESERVE, skill 475): the official client plays 496 on the caster from the use packet
// (black_maximize_power_sword_bic.wav), and on ticks 10 to 30 draws the caster adding light on even
// ticks with colour 250, white on odd ticks. There is no cast-start ring.
// Spec: effect-port/rogue-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Preserve', () => {
	it('plays 496 from the use packet only', () => {
		expect(skills).toContain('SkillEffect[SK.ST_PRESERVE] = { effectId: 496 };');
	});

	it('flickers the caster on ticks 10 to 30', () => {
		const at = SCHEDULES[496];
		expect(at(9).color).toBe(null);
		expect(at(10)).toEqual({ add: true, glow: false, split: false, color: [250, 250, 250] });
		expect(at(11)).toEqual({ add: false, glow: false, split: false, color: [255, 255, 255] });
		expect(at(30).add).toBe(true);
		expect(at(31).color).toBe(null);
		expect(table).toContain('new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 200, 496)');
	});
});
