import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Pierce (KN_PIERCE, skill 56), as the official client plays it: 148 (Pierce.str) on the caster
// as each damage packet arrives, and on the hit (once per packet, no hit flash) effect 81, one
// ring_yellow cone band (official primitive 13). Nothing plays a sound. Spec: effect-port/knight-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effectEntry(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Pierce effects', () => {
	it('plays 148 on the caster per damage packet and 81 once on the hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.KN_PIERCE\] = \{ damageEffectIdOnCaster: 148, hitEffectId: 81, hitEffectOnce: true \};/
		);
	});

	it('draws 81 as a facing ring_yellow cone band with the client numbers, silent', () => {
		const parts = effectEntry(81);
		expect(parts).toHaveLength(1);
		const band = parts[0];
		expect(band).toMatchObject({
			type: 'PRIM',
			prim: 'cone',
			texture: 'ring_yellow',
			attachedEntity: true,
			frames: 15,
			facing: true,
			pitch: -90,
			height: 10,
			baseRadius: 6,
			topRadius: 11,
			coneHeight: 2.5,
			drift: 0.7,
			fadeOutFrame: 8
		});
		expect(band.driftAccel).toBeCloseTo(-0.7 / 30, 8);
		expect(band.wav).toBeUndefined();
	});

	it('leaves 148 (Pierce.str) silent', () => {
		expect(effectEntry(148).every(part => !part.wav)).toBe(true);
	});
});
