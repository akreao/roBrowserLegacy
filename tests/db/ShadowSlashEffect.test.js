import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spriteAction } from '../../src/Renderer/Effects/SpriteAction.js';

// Shadow Slash (NJ_KIRIKAGE, skill 530): the official client plays 630 on the target as the damage
// packet arrives: 그림자베기 action 0 or 4 at random, 4 ticks a frame, once, with its sound; no hit
// effect. Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\t],', table.indexOf(`\t${id}: [`)));

describe('Shadow Slash', () => {
	it('plays 630 on the target as the damage packet arrives', () => {
		expect(skills).toContain('SkillEffect[SK.NJ_KIRIKAGE] = { damageEffectIdOnTarget: 630 };');
	});

	it('draws action 0 or 4, 4 ticks a frame', () => {
		const r = row(630);
		expect(r).toContain('frame: [0, 4],');
		expect(r).toContain('delayFrame: 4 * (1000 / 60),');
	});

	it('picks an SPR row action from a list at random, or takes a single one', () => {
		expect(spriteAction([0, 4], () => 0)).toBe(0);
		expect(spriteAction([0, 4], () => 0.99)).toBe(4);
		expect(spriteAction(3)).toBe(3);
		expect(spriteAction(undefined)).toBeUndefined();
	});
});
