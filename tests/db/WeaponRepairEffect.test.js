import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Weapon Repair (BS_REPAIRWEAPON, skill 108): the official client plays 101 (EF_REPAIRWEAPON) on the
// target only when the use packet succeeds, with black_weapon_repair_a.wav on ticks 20 and 55 of the
// effect (kRO 2025-07-16). Spec: effect-port/blacksmith-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();

describe('Weapon Repair effects', () => {
	it('plays 101 on the target only on success', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.BS_REPAIRWEAPON\] = \{ successEffectId: 101 \};/);
	});

	it('plays the repair sound at 333 and 917 ms', () => {
		const row = table.slice(table.indexOf('//EF_REPAIRWEAPON'), table.indexOf('//EF_CRASHEARTH'));
		const delays = [...row.matchAll(/delayWav: (\d+)/g)].map(m => Number(m[1]));
		expect(delays).toEqual([333, 917]);
	});
});
