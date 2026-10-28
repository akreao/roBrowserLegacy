import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ACID_BOTTLE, planThrow, stoneAt, trailAt } from '../../src/Renderer/Effects/ThrownStoneSim.js';
import { acidTerrorEffect, lastStoneTick, stoneEffect } from '../../src/DB/Effects/ThrowStoneEffect.js';

// Acid Terror (AM_ACIDTERROR, skill 230): the official client launches 298 (EF_THROWITEM) on the caster,
// aimed at the target, as each damage packet arrives: 빈병.bmp tinted (135, 255, 135), 6 x 6 units, a
// 30-unit arc, always 25 ticks in flight (speed distance / 25). Each hit plays the hit flash (0).
// kRO 2025-07-16. Spec: effect-port/alchemist-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Acid Terror', () => {
	it('throws 298 from the caster as the damage packet arrives and flashes every hit', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.AM_ACIDTERROR\] = \{ damageEffectIdOnCaster: 298, hitEffectId: 0 \};/
		);
		expect(table).toMatch(/298: acidTerrorEffect,/);
	});

	it('takes 26 updates to arrive, near or far', () => {
		const near = planThrow([0, 0, 0], [10, 0, 0], ACID_BOTTLE);
		const far = planThrow([0, 0, 0], [50, 0, 0], ACID_BOTTLE);
		expect(near.ticks).toBe(26);
		expect(far.ticks).toBe(26);
		expect(near.speed).toBeCloseTo(10 / 25);
		expect(far.speed).toBeCloseTo(2);
		expect(stoneAt(far, 26).x).toBeCloseTo(52);
		expect(stoneAt(far, 26).up).toBeCloseTo(8);
		expect(stoneAt(far, 40).x).toBeCloseTo(54);
	});

	it('arcs 30 units high, spins 10 a tick and fades 20 a tick once stopped', () => {
		const t = planThrow([0, 0, 0], [50, 0, 0], ACID_BOTTLE);
		expect(stoneAt(t, 13).up).toBeCloseTo(8 + 30);
		expect(stoneAt(t, 13).angle).toBe(130);
		expect(stoneAt(t, 27).alpha).toBe(255);
		expect(stoneAt(t, 28).alpha).toBe(235);
		expect(lastStoneTick(t)).toBe(27 + 13);
		expect(trailAt(t, 0, 3)).toMatchObject({ alpha: 105 });
	});

	it('never moves on its own cell and fades at once', () => {
		const t = planThrow([0, 0, 0], [0, 0, 0], ACID_BOTTLE);
		expect(t.ticks).toBe(0);
		expect(stoneAt(t, 5)).toMatchObject({ x: 0, y: 0, up: 8, alpha: 155 });
	});

	it('draws 빈병.bmp 6 units wide, tinted green', () => {
		const t = planThrow([0, 0, 0], [50, 0, 0], ACID_BOTTLE);
		const e = stoneEffect(t, -1, ACID_BOTTLE.texture);
		expect(e.file).toBe('\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xba\xf3\xba\xb4.bmp');
		expect(e.red).toBeCloseTo(135 / 255);
		expect(e.green).toBe(1);
		expect(e.blue).toBeCloseTo(135 / 255);
		expect(e.track(13).size).toBeCloseTo(42);
	});

	it('spawns the bottle and its trail at the caster, aimed at the target', () => {
		const spawned = [];
		acidTerrorEffect[0].func.call(
			{ spamEffect: p => spawned.push(p) },
			{
				Init: { ownerEntity: { position: [10, 20, 0] }, otherEntity: { position: [20, 20, 0] } },
				Inst: { startTick: 0 }
			}
		);
		expect(spawned).toHaveLength(4);
		expect(spawned[0].Inst.effectID).toBe(298);
		expect(spawned[0].effect.track(26).x).toBeCloseTo(52 / 5);
	});
});
