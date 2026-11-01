import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

let current;
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => current } }));

import { SCHEDULES, colorAt } from 'Renderer/Effects/CasterMarks.js';
import { DETOX, EDP_BUBBLES, planBubbles } from 'Renderer/Effects/DetoxBubbleSim.js';
import { EDP_LIFE, EDP_SOUND_TICKS, edpEffect } from 'DB/Effects/PoisonAttackEffect.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Enchant Deadly Poison (ASC_EDP 378) as the official client (kRO 2025-07-16)
// plays it: effect 493 on the caster from the use packet, only when its result
// is set. 493 lives 120 ticks: a particle3 particle every 3 ticks, rising
// (30 + r(50)) / 100 a tick, scale (20 + r(20)) / 100; assasin_enchantpoison.wav
// on ticks 0, 5, 11, 18, 26 and 40; ticks 0-80 the caster added and magenta on
// even ticks, white on odd ones. Spec: effect-port/assassin-cross-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function skillRow(name) {
	const source = read('DB/Skills/SkillEffect.js');
	const start = source.indexOf(`SkillEffect[SK.${name}] =`);
	expect(start, name).toBeGreaterThan(-1);
	const text = source.slice(source.indexOf('{', start), source.indexOf('};', start) + 1);
	return JSON.parse(JSON.stringify(vm.runInNewContext(`(${text})`)));
}

let seed = 7;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('Enchant Deadly Poison (493)', () => {
	beforeEach(() => {
		current = { GID: 1, _flashColor: [1, 1, 1, 1], recalculateBlendingColor() {} };
	});

	it('plays 493 on the caster only when the skill succeeds', () => {
		expect(skillRow('ASC_EDP')).toEqual({ successEffectIdOnCaster: 493 });
	});

	it('uses the EDP table entry', () => {
		const table = effectTableSource().replace(/\r\n/g, '\n');
		const start = table.indexOf('\n\t493: [');
		const row = table.slice(start, table.indexOf('\n\t],', start));
		expect(row).toContain('...edpEffect()');
		expect(row).toContain('new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, EDP_LIFE, 493)');
	});

	it('makes 40 particles, one every 3 ticks, faster and smaller than Enchant Poison', () => {
		const bubbles = planBubbles(random, Math.ceil(EDP_LIFE / EDP_BUBBLES.every), EDP_BUBBLES);
		expect(bubbles.map(b => b.spawn)).toEqual(Array.from({ length: 40 }, (_, i) => i * 3));
		for (const b of bubbles) {
			const d = Math.hypot(b.x, b.y);
			expect(d).toBeGreaterThanOrEqual(2 - 1e-9);
			expect(d).toBeLessThanOrEqual(7 + 1e-9);
			expect(b.rise).toBeGreaterThanOrEqual(0.3);
			expect(b.rise).toBeLessThanOrEqual(0.79 + 1e-9);
			expect(b.scale).toBeGreaterThanOrEqual(0.2);
			expect(b.scale).toBeLessThanOrEqual(0.39 + 1e-9);
		}
	});

	it('keeps the Detoxify and Enchant Poison numbers by default', () => {
		const bubbles = planBubbles(random);
		expect(bubbles).toHaveLength(DETOX.count);
		expect(bubbles[1].spawn).toBe(DETOX.every);
		for (const b of bubbles) {
			expect(b.rise).toBeLessThanOrEqual(0.59 + 1e-9);
			expect(b.scale).toBeGreaterThanOrEqual(0.4);
		}
	});

	it('plays the enchant sound six times and nothing else', () => {
		const rows = edpEffect();
		const sounds = rows.filter(row => row.wav);
		expect(sounds.map(row => row.wav)).toEqual(Array(6).fill('effect/assasin_enchantpoison'));
		expect(sounds.map(row => Math.round(row.delayWav / PRIM_TICK_MS))).toEqual(EDP_SOUND_TICKS);
		expect(EDP_SOUND_TICKS).toEqual([0, 5, 11, 18, 26, 40]);
		expect(rows.filter(row => row.type === 'FUNC')).toHaveLength(1);
	});

	it('spawns the particles as particle3 sprites following the caster', () => {
		const spawned = [];
		edpEffect()[0].func.call({ spamEffect: p => spawned.push(p) }, { Inst: { startTick: 1000 }, Init: {} });
		expect(spawned).toHaveLength(40);
		expect(spawned[0].effect.spriteName).toBe('particle3');
		expect(spawned[0].effect.attachedEntity).toBe(true);
		expect(spawned[39].Inst.startTick).toBeCloseTo(1000 + 117 * PRIM_TICK_MS);
	});

	it('flickers the caster magenta (added) and white on ticks 0-80', () => {
		const schedule = SCHEDULES[493];
		expect(schedule(0)).toMatchObject({ add: true, glow: false, color: [255, 0, 255] });
		expect(schedule(1)).toMatchObject({ add: false, color: [255, 255, 255] });
		expect(schedule(80)).toMatchObject({ add: true, color: [255, 0, 255] });
		expect(schedule(81)).toMatchObject({ add: false, color: null });
		expect(colorAt(schedule, 81)).toEqual([255, 8, 255]);
	});
});
