import { describe, it, expect, vi, beforeEach } from 'vitest';

let current;
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => current } }));

import BodyMotion from 'Renderer/Effects/BodyMotion.js';
import TaekwonBodyEffects from 'DB/Effects/TaekwonBodyEffects.js';
import {
	pressScale,
	spinAngle,
	kickLift,
	readyAlpha,
	SCHEDULES,
	applyMarks,
	glowAlpha,
	marksOf,
	QUAKE_PX
} from 'Renderer/Effects/BodyMotionSim.js';

const TICK = 1000 / 60;

beforeEach(() => {
	current = { GID: 1 };
});

describe('BodyMotionSim numbers', () => {
	it('presses to 40% in four ticks, then shakes between 35% and 40%', () => {
		expect([0, 1, 2, 3].map(n => pressScale(n))).toEqual([1, 0.8, 0.6, 0.4]);
		expect(pressScale(4, () => 0)).toBeCloseTo(0.4);
		expect(pressScale(33, () => 0.99)).toBeCloseTo(0.35);
		expect(pressScale(34)).toBe(1);
	});

	it('spins one full turn over 36 ticks', () => {
		expect(spinAngle(0)).toBe(0);
		expect(spinAngle(18)).toBeCloseTo(180);
		expect(spinAngle(36)).toBeCloseTo(0, 5); // 360 wraps to 0
		expect(spinAngle(37)).toBe(0);
	});

	it('kicks up to 30% of the height and back', () => {
		expect(kickLift(0)).toBe(0);
		expect(kickLift(18)).toBeCloseTo(0.3);
		expect(kickLift(19)).toBe(0.3);
		expect(kickLift(20)).toBe(0.3);
		expect(kickLift(21)).toBeCloseTo(0.2);
		expect(kickLift(22)).toBeCloseTo(0.1);
		expect(kickLift(23)).toBe(0);
		expect(kickLift(40)).toBe(0);
	});

	it('fades the ready glow in to 160 and out by tick 51', () => {
		expect(readyAlpha(0)).toBe(0);
		expect(readyAlpha(10)).toBe(150);
		expect(readyAlpha(11)).toBe(160);
		expect(readyAlpha(20)).toBe(160);
		expect(readyAlpha(21)).toBe(150);
		expect(readyAlpha(50)).toBe(5);
		expect(readyAlpha(51)).toBe(0);
	});

	it('marks on the official ticks of each effect', () => {
		expect(SCHEDULES[413](16)).toBeNull();
		expect(SCHEDULES[413](17)).toEqual({ press: 0 });
		expect(SCHEDULES[413](50)).toEqual({ press: 33 });
		expect(SCHEDULES[414](17)).toEqual({ spin: 34 });
		expect(SCHEDULES[414](18)).toBeNull();
		expect(SCHEDULES[415](29)).toBeNull();
		expect(SCHEDULES[415](30)).toEqual({ kick: 0 });
		expect(SCHEDULES[466](13)).toBeNull();
		expect(SCHEDULES[466](14)).toEqual({ spin: 0 });
		expect(SCHEDULES[466](50)).toBeNull();
		expect(SCHEDULES[449](50)).toEqual({ ready: 50 });
		expect(SCHEDULES[449](51)).toBeNull();
		expect(SCHEDULES[458](0)).toEqual({ quake: true });
		expect(SCHEDULES[426](0)).toEqual({ quake: true });
	});
});

describe('applyMarks', () => {
	// A 100 px tall, 40 px wide layer centred 50 px above the feet (y down).
	const quad = marks => applyMarks(marks, 0, -50, 40, 100, () => 0.5);

	it('leaves a layer alone without marks', () => {
		expect(quad([])).toEqual({ ox: 0, oy: -50, w: 40, h: 100, angle: 0 });
	});

	it('presses the top edge down, the bottom edge staying', () => {
		const q = quad([{ press: 3 }]);
		expect(q.h).toBeCloseTo(40);
		expect(q.oy + q.h / 2).toBeCloseTo(0);
	});

	it('kicks the whole layer up by a share of its height', () => {
		const q = quad([{ kick: 19 }]);
		expect(q.h).toBeCloseTo(100);
		expect(q.oy).toBeCloseTo(-80);
	});

	it('turns the layer for a spin', () => {
		expect(quad([{ spin: 18 }]).angle).toBeCloseTo(180);
	});

	it('moves each edge by at most 5 px for a quake, keeping a mirrored width negative', () => {
		for (const r of [0, 0.999]) {
			const q = applyMarks([{ quake: true }], 0, -50, -40, 100, () => r);
			expect(q.w).toBeLessThan(0);
			expect(Math.abs(Math.abs(q.w) - 40)).toBeLessThanOrEqual(2 * QUAKE_PX);
			expect(Math.abs(q.h - 100)).toBeLessThanOrEqual(2 * QUAKE_PX);
		}
	});

	it('reads the strongest ready glow', () => {
		expect(glowAlpha([{ press: 1 }])).toBe(0);
		expect(glowAlpha([{ ready: 5 }, { ready: 15 }])).toBe(160);
	});
});

describe('BodyMotion', () => {
	it('marks its owner on its own ticks and unmarks it when freed', () => {
		const motion = new BodyMotion(current, 1000, 413, 50);
		motion.render(null, 1000 + 16 * TICK);
		expect(marksOf(current)).toEqual([]);
		motion.render(null, 1000 + 17 * TICK);
		expect(marksOf(current)).toEqual([{ press: 0 }]);
		motion.free();
		expect(marksOf(current)).toEqual([]);
	});

	it('ends after its lifetime or when its owner is gone', () => {
		const motion = new BodyMotion(current, 0, 449, 60);
		motion.render(null, 59 * TICK);
		expect(motion.needCleanUp).toBeUndefined();
		motion.render(null, 60 * TICK);
		expect(motion.needCleanUp).toBe(true);

		const other = new BodyMotion(current, 0, 458, 35);
		current = { GID: 2 };
		other.render(null, 0);
		expect(other.needCleanUp).toBe(true);
	});

	it('keeps two effects on one owner apart', () => {
		const a = new BodyMotion(current, 0, 466, 50);
		const b = new BodyMotion(current, 0, 458, 35);
		a.render(null, 14 * TICK);
		b.render(null, 14 * TICK);
		expect(marksOf(current)).toEqual([{ spin: 0 }, { quake: true }]);
		a.free();
		expect(marksOf(current)).toEqual([{ quake: true }]);
	});
});

describe('TaekwonBodyEffects', () => {
	const motionOf = (id, startTick = 0) => {
		const added = [];
		const row = TaekwonBodyEffects[id].find(e => e.type === 'FUNC');
		row.func.call({ add: m => added.push(m) }, { Init: { ownerEntity: current }, Inst: { startTick } });
		return added[0];
	};

	it('gives each body effect its official lifetime', () => {
		expect(motionOf(413).frames).toBe(50);
		expect(motionOf(414).frames).toBe(50);
		expect(motionOf(415).frames).toBe(100);
		expect(motionOf(449).frames).toBe(60);
		expect(motionOf(458).frames).toBe(35);
		expect(motionOf(466).frames).toBe(50);
	});

	it('plays the kick sounds on their ticks', () => {
		const wavs = id => TaekwonBodyEffects[id].filter(e => e.wav).map(e => [e.wav, e.delayWav]);
		expect(wavs(413)).toEqual([['effect/t_\xb3\xbb\xb7\xc1\xc2\xef\xb1\xe2', 83]]);
		expect(wavs(466)).toEqual([['effect/t_\xb5\xb9\xb7\xc1\xc2\xf7\xb1\xe2', 83]]);
		expect(wavs(415)).toEqual([
			['effect/ef_hit2', 283],
			['effect/ef_hit4', 417]
		]);
		expect(wavs(449)).toEqual([]);
	});
});
