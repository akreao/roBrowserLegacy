import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Final Strike (NJ_ISSEN, skill 544): the official client plays 633 on the target as the damage
// packet arrives: 일섬 action 0, 2 ticks a frame, once, 6 units up, with its sound; no hit
// effect. Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\t],', table.indexOf(`\t${id}: [`)));

describe('Final Strike', () => {
	it('plays 633 on the target as the damage packet arrives', () => {
		expect(skills).toContain('SkillEffect[SK.NJ_ISSEN] = { damageEffectIdOnTarget: 633 };');
	});

	it('draws action 0, 2 ticks a frame, 6 units up', () => {
		const r = row(633);
		expect(r).not.toContain('frame:');
		expect(r).toContain('delayFrame: 2 * (1000 / 60),');
		expect(r).toContain('yOffset: -42,');
	});
});
