import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { STEAL, planSparks, sparkAt, fadeAlpha } from '../../src/Renderer/Effects/StealSparkSim.js';
import { stealEffect, stealSparkEffect } from '../../src/DB/Effects/StealEffect.js';

// Steal (TF_STEAL, skill 50): effect 18 on the target when it succeeds, EF_Steal.wav and 10
// particle7 sparks thrown out and falling back. Spec: effect-port/thief-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

let seed = 3;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('Steal sparks', () => {
	it('still plays 18 on the target only on success', () => {
		expect(source).toMatch(/SkillEffect\[SK\.TF_STEAL\] = \{ successEffectId: 18 \};/);
	});

	it('throws 10 sparks within the client ranges', () => {
		const sparks = planSparks(random);
		expect(sparks).toHaveLength(10);
		for (const s of sparks) {
			const d = Math.hypot(s.start.x, s.start.y, s.start.up - STEAL.lift);
			expect(d).toBeGreaterThanOrEqual(4 - 1e-9);
			expect(d).toBeLessThanOrEqual(7 + 1e-9);
			expect(s.speed).toBeGreaterThanOrEqual(0.5);
			expect(s.speed).toBeLessThanOrEqual(0.99 + 1e-9);
			expect(s.rise).toBeGreaterThanOrEqual(0.6);
			expect(s.rise).toBeLessThanOrEqual(1.49 + 1e-9);
			expect(s.scale).toBeGreaterThanOrEqual(1);
			expect(s.scale).toBeLessThan(2);
		}
	});

	it('flies out, peaks at tick 25 and comes back down, shrinking', () => {
		const s = { heading: 0, start: { x: 5, y: 0, up: 10 }, speed: 0.8, rise: 1, scale: 1.5 };
		expect(sparkAt(s, 0)).toMatchObject({ x: 5, y: 0, up: 10, scale: 1.5, alpha: 254 });
		const top = sparkAt(s, 25);
		expect(top.up).toBeGreaterThan(sparkAt(s, 20).up);
		expect(top.up).toBeGreaterThanOrEqual(sparkAt(s, 30).up);
		expect(sparkAt(s, 49).up).toBeCloseTo(10 - 1 + 1, 0);
		expect(sparkAt(s, 25).x).toBeCloseTo(5 + 25 * 0.8 - (0.8 / 100) * 325);
		expect(sparkAt(s, 25).scale).toBeCloseTo(0.75);
		expect(sparkAt(s, 50)).toBeNull();
	});

	it('fades from tick 34 to 0 at its end', () => {
		expect(fadeAlpha(33, 50, 34)).toBe(254);
		expect(fadeAlpha(34, 50, 34)).toBeCloseTo((254 * 15) / 16);
		expect(fadeAlpha(49, 50, 34)).toBe(0);
	});

	it('draws a spark as the particle7 sprite, following the target', () => {
		const e = stealSparkEffect({ heading: 90, start: { x: 0, y: 0, up: 10 }, speed: 0, rise: 0, scale: 2 });
		expect(e.spriteName).toBe('particle7');
		expect(e.attachedEntity).toBe(true);
		expect(e.track(0)).toMatchObject({ x: 0, z: 2, size: 200 });
		expect(e.track(50)).toBeNull();
	});

	it('spawns 10 sparks and plays EF_Steal.wav', () => {
		const spawned = [];
		stealEffect[0].func.call(
			{ spamEffect: p => spawned.push(p) },
			{ Init: { ownerEntity: { position: [1, 2, 0] } }, Inst: { startTick: 9 } }
		);
		expect(spawned).toHaveLength(10);
		expect(spawned[0].Inst.startTick).toBe(9);
		expect(stealEffect[1].wav).toBe('effect/ef_steal');
	});
});
