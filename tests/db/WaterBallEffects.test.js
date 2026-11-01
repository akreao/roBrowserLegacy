import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Water Ball (WZ_WATERBALL, skill 86), as the official client plays it: the server sends one
// damage packet per ball, and as each arrives the client launches 117 on the caster: one
// Waterball.spr ball flying to the target with wizard_waterball_chulung.wav. With the damage it
// plays the standard hit flash (0) once per packet. Nothing plays 116 for Water Ball.
// Spec: effect-port/wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effect117() {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf('\n\t117: [');
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Water Ball effects', () => {
	it('launches 117 per damage packet and the hit flash once', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.WZ_WATERBALL\] = \{ damageEffectIdOnCaster: 117, hitEffectId: \[0\], hitEffectOnce: true \};/
		);
	});

	it('throws one ball with one sound', () => {
		const rows = effect117();
		expect(rows).toHaveLength(1);
		expect(rows[0].duplicate).toBeUndefined();
		expect(rows[0].absoluteSpriteName).toMatch(/waterball$/);
		expect(rows[0].fromSrc).toBe(true);
		expect(rows[0].wav).toBe('effect/wizard_waterball_chulung');
	});
});
