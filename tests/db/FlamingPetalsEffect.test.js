import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Flaming Petals (NJ_KOUENKA, skill 534): the official client plays 618 on the target as the damage
// packet arrives (EF_FireArrow1-3.wav on ticks 12-15, petals, no STR) and the fire hit 49 once per
// damage packet when it lands. Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\t],', table.indexOf(`\t${id}: [`)));

describe('Flaming Petals', () => {
	it('plays 618 as the damage packet arrives and the fire hit once', () => {
		expect(skills).toContain(
			'SkillEffect[SK.NJ_KOUENKA] = { damageEffectIdOnTarget: 618, hitEffectId: 49, hitEffectOnce: true };'
		);
	});

	it('plays a fire arrow sound on each of ticks 12 to 15, and no STR', () => {
		const r = row(618);
		[12, 13, 14, 15].forEach(t => expect(r).toContain(`delayWav: ${t} * (1000 / 60)`));
		expect(r.match(/wav: 'effect\/ef_firearrow%d'/g)).toHaveLength(4);
		expect(r).not.toContain("type: 'STR'");
	});
});
