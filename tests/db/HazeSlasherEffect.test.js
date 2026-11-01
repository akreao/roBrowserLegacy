import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Haze Slasher (NJ_KASUMIKIRI, skill 528): the official client plays 632 on the target as the damage
// packet arrives: 안개베기 action 0 or 2 at random, 4 ticks a frame, once, with its sound; no hit
// effect. Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\t],', table.indexOf(`\t${id}: [`)));

describe('Haze Slasher', () => {
	it('plays 632 on the target as the damage packet arrives', () => {
		expect(skills).toContain('SkillEffect[SK.NJ_KASUMIKIRI] = { damageEffectIdOnTarget: 632 };');
	});

	it('draws action 0 or 2, 4 ticks a frame', () => {
		const r = row(632);
		expect(r).toContain('frame: [0, 2],');
		expect(r).toContain('delayFrame: 4 * (1000 / 60),');
	});
});
