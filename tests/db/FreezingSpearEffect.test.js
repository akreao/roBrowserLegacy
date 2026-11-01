import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Freezing Spear (NJ_HYOUSENSOU, skill 537): the official client plays 619 on the target as the damage
// packet arrives, drawn with Earth Spike's code (79) in effect/ice.tga with one EF_IceArrow1-3.wav,
// and the cold hit 51 once per damage packet. Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\n\t],', table.indexOf(`\t${id}: [`)));

describe('Freezing Spear', () => {
	it('plays 619 as the damage packet arrives and the cold hit once', () => {
		expect(skills).toContain(
			'SkillEffect[SK.NJ_HYOUSENSOU] = { damageEffectIdOnTarget: 619, hitEffectId: 51, hitEffectOnce: true };'
		);
	});

	it("draws Earth Spike's spikes in ice, with one ice arrow sound and no STR", () => {
		const spear = row(619);
		const spike = row(79);
		const horns = r => (r.match(/type: 'QuadHorn'/g) || []).length;
		expect(horns(spear)).toBe(horns(spike));
		expect(spear).not.toContain('stone.bmp');
		expect(spear.match(/'effect\/ice\.tga'/g)).toHaveLength(horns(spike));
		expect(spear).toContain("wav: 'effect/ef_icearrow%d'");
		expect(spear).toContain('Camera.setQuake');
		expect(spear).not.toContain("type: 'STR'");
	});
});
