import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Bowling Bash (KN_BOWLINGBASH, skill 62), as the official client plays it: no cast bar or aura,
// 149 (Bowling.str) on the caster as each damage packet arrives, silent, and on the hit, once per
// packet, the hit flash 0 and effect 73: two upright ring_blue cone bands (ticks 0 and 5) and a
// faint flat ring_yellow ring. Spec: effect-port/knight-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const TICK = 1000 / 60;

function effectEntry(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Bowling Bash effects', () => {
	it('plays 149 on the caster per damage packet and 0 + 73 once on the hit, with no cast bar', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain(
			'SkillEffect[SK.KN_BOWLINGBASH] = {\n\thideCastBar: true,\n\thideCastAura: true,\n\tdamageEffectIdOnCaster: 149,\n\thitEffectId: [0, 73],\n\thitEffectOnce: true\n}; //Bowling Bash'
		);
	});

	it('plays Bowling.str with no sound', () => {
		expect(effectEntry(149).every(part => !part.wav)).toBe(true);
	});

	it('opens two blue cone bands on ticks 0 and 5', () => {
		const cones = effectEntry(73).filter(part => part.prim === 'cone');
		expect(cones).toHaveLength(2);
		cones.forEach(cone => {
			expect(cone).toMatchObject({
				type: 'PRIM',
				texture: 'ring_blue',
				attachedEntity: true,
				facing: true,
				baseRadius: 3,
				baseSpeed: 0.5,
				baseAccel: -0.03,
				topRadius: 8,
				topSpeed: 0.5,
				topAccel: -0.03,
				coneHeight: 3.5
			});
			expect(cone.pitch).toBeUndefined();
		});
		expect(cones[0]).toMatchObject({ frames: 20, alpha: 240, fadeOutFrame: 10 });
		expect(cones[0].delayStart).toBeUndefined();
		expect(cones[1]).toMatchObject({ frames: 15, alpha: 205, fadeOutFrame: 8, yaw: 100 });
		expect(cones[1].delayStart).toBeCloseTo(5 * TICK, 6);
	});

	it('spreads a faint yellow ring that slows, then grows 0.08 a tick from tick 20', () => {
		const rings = effectEntry(73).filter(part => part.prim === 'ring');
		expect(rings).toHaveLength(1);
		expect(rings[0]).toMatchObject({
			texture: 'ring_yellow',
			frames: 50,
			radius: 8,
			radiusSpeed: 0.7,
			radiusChangeFrame: 20,
			radiusChangeSpeed: 0.08,
			radiusChangeAccel: 0,
			width: 5,
			alpha: 45,
			fadeOutFrame: 35
		});
		expect(rings[0].radiusAccel).toBeCloseTo(-0.7 / 30, 8);
		expect(effectEntry(73).every(part => !part.wav)).toBe(true);
	});
});
