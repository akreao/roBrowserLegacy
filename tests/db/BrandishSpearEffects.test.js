import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Brandish Spear (KN_BRANDISHSPEAR, skill 57), as the official client plays it: no cast bar or
// aura, and 70 (Brandish.str) on each target as its damage packet arrives, with no sound. No hit
// flash, no hit effect; 144 (Brandish2.str) is never launched. Spec: effect-port/knight-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effectEntry(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Brandish Spear effects', () => {
	it('plays 70 on each target per damage packet, nothing else', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.KN_BRANDISHSPEAR\] = \{ hideCastBar: true, hideCastAura: true, damageEffectIdOnTarget: 70 \};/
		);
	});

	it('plays Brandish.str with no sound', () => {
		const parts = effectEntry(70);
		expect(parts).toHaveLength(1);
		expect(parts[0]).toMatchObject({ type: 'STR', file: 'brandish' });
		expect(parts[0].wav).toBeUndefined();
	});
});
