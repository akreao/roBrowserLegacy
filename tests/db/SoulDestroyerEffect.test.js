import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import { SCHEDULES, colorAt } from 'Renderer/Effects/CasterMarks.js';
import {
	SLASH,
	headingTo,
	planAimedSlash,
	slashAt,
	slashPath
} from 'Renderer/Effects/PurpleSlashSim.js';
import { aimedSlashEffect, slashPartEffect } from 'DB/Effects/PurpleSlashEffect.js';
import {
	UNITS_PER_CELL,
	applyTrack,
	buildPrimGeometry,
	createPrimState,
	primVertexCount
} from 'Renderer/Effects/EffectPrimSim.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Soul Destroyer (ASC_BREAKER 379) as the official client (kRO 2025-07-16)
// plays it: cast aura 59; effect 361 on the caster as each damage packet
// arrives, given the target's position: one prim 86 of four purpleslash.tga
// parts flying toward the target, 기공포.wav on tick 20, the caster added and
// magenta on ticks 0-10; the hit flash (0) when the hit lands; no EF_BASH.
// Spec: effect-port/assassin-cross-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function entry(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\n\t],', start)).replace(/\s+/g, ' ');
}

function skillRow(name) {
	const source = read('DB/Skills/SkillEffect.js');
	const start = source.indexOf(`SkillEffect[SK.${name}] =`);
	expect(start, name).toBeGreaterThan(-1);
	const text = source.slice(source.indexOf('{', start), source.indexOf('};', start) + 1);
	return JSON.parse(JSON.stringify(vm.runInNewContext(`(${text})`)));
}

let seed = 11;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('Soul Destroyer (361)', () => {
	it('plays 361 on the caster from each damage packet, aura 59 and the hit flash', () => {
		expect(skillRow('ASC_BREAKER')).toEqual({ castAuraEffectId: 59, damageEffectIdOnCaster: 361, hitEffectId: 0 });
	});

	it('plays the slashes, 기공포.wav on tick 20 and the caster marks', () => {
		const row = entry(361);
		expect(row).toContain('aimedSlashEffect');
		expect(row).toContain("wav: 'effect/\\xb1\\xe2\\xb0\\xf8\\xc6\\xf7', delayWav: 20 * (1000 / 60)");
		expect(row).toContain('new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 300, 361)');
	});

	it('lights the caster magenta on ticks 0-10', () => {
		expect(SCHEDULES[361](0)).toMatchObject({ add: true, glow: false, color: [255, 0, 255] });
		expect(SCHEDULES[361](10)).toMatchObject({ add: true, color: [255, 0, 255] });
		expect(SCHEDULES[361](11)).toMatchObject({ add: false, color: null });
		expect(colorAt(SCHEDULES[361], 12)).toEqual([255, 16, 255]);
	});
});

describe('purple slash parts (prim 86)', () => {
	it('measures headings the client way', () => {
		expect([
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
			[1, 1],
			[1, -1],
			[0, 0]
		].map(([x, y]) => headingTo(x, y))).toEqual([0, 90, 180, 270, 45, 315, 180]);
		// The first whole degree whose cosine is not above dx / length
		expect(headingTo(Math.cos((30.4 * Math.PI) / 180), Math.sin((30.4 * Math.PI) / 180))).toBe(31);
	});

	it('waits 28 ticks, fades in to 90 over 9 ticks and out by 5 a tick', () => {
		const part = slashPath(-28, 0, 10);
		const shown = part.frames.map((p, i) => (p ? i : -1)).filter(i => i >= 0);
		expect(shown[0]).toBe(30);
		expect(shown.at(-1)).toBe(55);
		expect(shown).toHaveLength(26);
		expect(slashAt(part, 30).alpha).toBe(10);
		expect(slashAt(part, 38).alpha).toBe(90);
		expect(slashAt(part, 39).alpha).toBe(85);
		expect(slashAt(part, 55).alpha).toBe(5);
		expect(slashAt(part, 56)).toBeNull();
		expect(slashAt(part, 29)).toBeNull();
	});

	it('speeds up by 2 % then 4 % a tick, about 32 units in all', () => {
		const part = slashPath(-28, 0, 10);
		// Tick 29: the turn, 0.8 units; tick 30: 0.8 * 1.02
		expect(slashAt(part, 30).x).toBeCloseTo(0.8 + 0.8 * 1.02, 6);
		const at38 = 0.8 * Array.from({ length: 10 }, (_, k) => 1.02 ** k).reduce((a, b) => a + b, 0);
		expect(slashAt(part, 38).x).toBeCloseTo(at38, 6);
		expect(slashAt(part, 55).x).toBeCloseTo(32.32, 1);
		expect(slashAt(part, 55).y).toBeCloseTo(0, 6);
	});

	it('aims four parts at the target, 15 degrees either way, one tick apart', () => {
		const parts = planAimedSlash(90, random);
		expect(parts).toHaveLength(4);
		parts.forEach((part, i) => {
			const first = part.frames.findIndex(Boolean);
			expect(first).toBe(30 - i);
			const { heading } = part.frames[first];
			expect(Math.abs(heading - 90)).toBeLessThanOrEqual(SLASH.jitter);
			expect(part.up).toBeGreaterThanOrEqual(6);
			expect(part.up).toBeLessThanOrEqual(10);
		});
	});

	it('draws a part as a level square, its arc leading', () => {
		const part = slashPath(-28, 0, 10);
		const effect = slashPartEffect(part);
		expect(effect).toMatchObject({ type: 'PRIM', prim: 'quad', texture: 'purpleslash', frames: 57 });
		expect(effect.color).toEqual([200, 200, 255]);
		expect(effect.size * Math.SQRT2).toBeCloseTo(20, 6);
		expect(effect.track(10)).toBeNull();
		expect(effect.track(38)).toMatchObject({ alpha: 90, yaw: -90 });

		const state = createPrimState(effect);
		expect(applyTrack(state, effect, 38)).toBe(true);
		const out = new Float32Array(primVertexCount(effect) * 5);
		buildPrimGeometry(out, effect, state, [0, 0, 0]);
		// Corners 20 units out at heading +- 45: u = 0 on the two leading ones
		const x = slashAt(part, 38).x / UNITS_PER_CELL;
		for (let v = 0; v < 6; v++) {
			const gx = out[v * 5] - 0.5 - x;
			const u = out[v * 5 + 3];
			expect(Math.abs(gx)).toBeCloseTo(20 / Math.SQRT2 / UNITS_PER_CELL, 5);
			expect(u === 0).toBe(gx > 0);
			expect(out[v * 5 + 1]).toBeCloseTo(-10 / UNITS_PER_CELL, 6);
		}
	});

	it('spawns four parts from the caster toward the target', () => {
		const spawned = [];
		aimedSlashEffect.func.call(
			{ spamEffect: p => spawned.push(p) },
			{
				Inst: { effectID: 361, startTick: 500, position: [10, 10, 0] },
				Init: { otherEntity: { position: [10, 15, 0] } }
			}
		);
		expect(spawned).toHaveLength(4);
		for (const p of spawned) {
			expect(p.Inst.startTick).toBe(500);
			const first = p.effect.track(p.effect.frames - 2);
			expect(Math.abs(first.yaw + 90 - 90)).toBeLessThanOrEqual(SLASH.jitter);
		}
	});
});
