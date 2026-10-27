import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	planGrains,
	grainAt,
	grainAlpha,
	SAND_GRAINS,
	SAND_LAST_TICK,
	SAND_COLOR,
	SAND_TEXTURE
} from '../../src/Renderer/Effects/SandGrainSim.js';
import { sandAttackEffect, sandGrainEffect } from '../../src/DB/Effects/SandAttackEffect.js';

// Sand Attack (TF_SPRINKLESAND, skill 149): effect 310 on the target as the damage packet arrives,
// 80 additive grains rising from the ground; every hit plays the hit flash (0). Spec: effect-port/thief-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

let seed = 7;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('Sand Attack', () => {
	it('plays 310 as the damage packet arrives and the hit flash on every hit', () => {
		expect(source).toMatch(/SkillEffect\[SK\.TF_SPRINKLESAND\] = \{ damageEffectIdOnTarget: 310, hitEffectId: 0 \};/);
	});

	it('throws 80 grains within the client ranges', () => {
		const grains = planGrains(random);
		expect(grains).toHaveLength(SAND_GRAINS);
		expect(SAND_GRAINS).toBe(80);
		for (const g of grains) {
			expect(g.x).toBeGreaterThanOrEqual(-4);
			expect(g.x).toBeLessThanOrEqual(4);
			expect(g.counter).toBeGreaterThanOrEqual(-10);
			expect(g.counter).toBeLessThanOrEqual(-1);
			expect(g.rise).toBeGreaterThanOrEqual(0.2);
			expect(g.rise).toBeLessThanOrEqual(0.59 + 1e-9);
			expect(g.drift).toBeLessThanOrEqual(0.09 + 1e-9);
			expect(g.half).toBeGreaterThanOrEqual(0.1);
			expect(g.half).toBeLessThanOrEqual(0.55 + 1e-9);
		}
	});

	it('fades in to 135 by counter 10 and out by counter 55', () => {
		expect([1, 2, 10, 11, 54, 55].map(grainAlpha)).toEqual([0, 15, 135, 132, 3, 0]);
	});

	it('waits, rises, drifts and turns', () => {
		const g = { x: 1, y: -2, counter: -3, heading: 0, rise: 0.5, drift: 0.05, half: 0.2 };
		expect(grainAt(g, 3)).toBeNull();
		const p = grainAt(g, 13);
		expect(p.up).toBeCloseTo(5);
		expect(p.x).toBeCloseTo(1.5);
		expect(p.y).toBeCloseTo(-2);
		expect(p.alpha).toBe(135);
		expect(p.angle).toBe(310);
		expect(grainAt(g, 58)).toBeNull();
		expect(SAND_LAST_TICK).toBe(65);
	});

	it('draws a grain as an additive tinted billboard in cells', () => {
		const g = { x: 5, y: 0, counter: -1, heading: 90, rise: 0.5, drift: 0, half: 0.5 };
		const e = sandGrainEffect(g);
		expect(e.file).toBe(SAND_TEXTURE);
		expect(e.blendMode).toBe(2);
		expect([e.red, e.green, e.blue]).toEqual(SAND_COLOR);
		const s = e.track(11);
		expect(s.x).toBeCloseTo(1);
		expect(s.z).toBeCloseTo(1);
		expect(s.size).toBeCloseTo(7);
		expect(s.alpha).toBeCloseTo(135 / 255);
		expect(e.track(0)).toBeNull();
	});

	it('spawns the grains at the target, fixed in the world', () => {
		const spawned = [];
		const host = { spamEffect: p => spawned.push(p) };
		const position = [10, 20, 1];
		sandAttackEffect[0].func.call(host, {
			Init: { ownerEntity: { position } },
			Inst: { startTick: 500 }
		});
		expect(spawned).toHaveLength(80);
		expect(spawned[0].Init.position).toEqual([10, 20, 1]);
		expect(spawned[0].Init.position).not.toBe(position);
		expect(spawned[0].Inst.startTick).toBe(500);
		expect(spawned[0].effect.attachedEntity).toBe(false);
	});
});
