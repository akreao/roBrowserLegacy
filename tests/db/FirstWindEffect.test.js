import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// First Wind (NJ_KAMAITACHI, skill 542): the official client plays 624 on the caster as each damage
// packet arrives, aimed at the target: t_바람방출.wav on tick 1, then the wind. No hit effect.
// Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\t],', table.indexOf(`\t${id}: [`)));

describe('First Wind', () => {
	it('plays 624 on the caster as the damage packet arrives', () => {
		expect(skills).toContain('SkillEffect[SK.NJ_KAMAITACHI] = { damageEffectIdOnCaster: 624 };');
	});

	it('plays t_바람방출.wav one tick in', () => {
		const r = row(624);
		expect(r).toContain("wav: 'effect/t_\\xb9\\xd9\\xb6\\xf7\\xb9\\xe6\\xc3\\xe2',");
		expect(r).toContain('delayWav: 1000 / 60');
	});
});
