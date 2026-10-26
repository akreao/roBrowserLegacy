import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Spear Stab (KN_SPEARSTAB, skill 58), as the official client plays it: 150 (SpearStab.str) on the
// caster as each damage packet arrives, silent, and the Pierce hit band 81 once per packet on the
// hit, with no hit flash. Spec: effect-port/knight-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effectEntry(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Spear Stab effects', () => {
	it('plays 150 on the caster per damage packet and 81 once on the hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.KN_SPEARSTAB\] = \{ damageEffectIdOnCaster: 150, hitEffectId: 81, hitEffectOnce: true \};/
		);
	});

	it('plays SpearStab.str with no sound', () => {
		const parts = effectEntry(150);
		expect(parts).toHaveLength(1);
		expect(parts[0]).toMatchObject({ type: 'STR', file: 'spearstab' });
		expect(parts[0].wav).toBeUndefined();
	});
});
