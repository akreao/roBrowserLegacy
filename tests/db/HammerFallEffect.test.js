import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Hammer Fall (BS_HAMMERFALL, skill 110): the official client plays 102 (EF_CRASHEARTH) at the cell from
// the ground packet. 102 plays wizard_fire_pillar_b.wav on tick 30 and quakes the screen on tick 35; it
// never loads black_hammerfall.wav (kRO 2025-07-16). Spec: effect-port/blacksmith-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();

describe('Hammer Fall effects', () => {
	it('plays 102 from the ground packet', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.BS_HAMMERFALL\] = \{ effectId: 102 \};/);
	});

	it('plays the fire pillar sound at 500 ms and quakes at tick 35', () => {
		const row = table.slice(table.indexOf('//EF_CRASHEARTH'), table.indexOf('//EF_PERFECTION'));
		expect(row).not.toMatch(/wav: 'effect\/black_hammerfall'/);
		expect(row).toMatch(/wav: 'effect\/wizard_fire_pillar_b',\s+delayWav: 500,/);
		expect(row).toMatch(/startTick \+ 35 \* \(1000 \/ 60\);\s+Camera\.setQuake\(start\);/);
	});
});
