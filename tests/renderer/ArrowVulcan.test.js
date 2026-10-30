import { describe, expect, it, vi } from 'vitest';
import {
	VULCAN,
	STREAK,
	LAST_TICK,
	createStreak,
	streakAlpha,
	ring,
	aim
} from 'Renderer/Effects/ArrowVulcanSim.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Arrow Vulcan's streaks (effect 393), kRO 2025-07-16: case 0x189 at 0xbc9216,
// set-up 0xbfff50, primitive 69 update 0xb46b50 and draw 0xb7de80.

vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload, onerror) {
			onerror();
		}
	}
}));

const fixed = v => () => v;

describe('Arrow Vulcan streaks', () => {
	it('start from the client ranges', () => {
		const low = createStreak(0, [1, 0], 50, fixed(0));
		expect(low).toMatchObject({ delay: 30, ax: -4, az: -4, bx: 46, bz: -4, height: 4 });
		expect(low.radius).toBeCloseTo(0.02);
		const high = createStreak(8, [0, 1], 50, fixed(0.999));
		expect(high.prim).toBe(8);
		expect(high.delay).toBe(139);
		expect(high.height).toBeCloseTo(9.94);
		expect(high.radius).toBeCloseTo(0.1);
		// pulled back 14.85 toward the caster, and 29.7 past the target
		expect(high.az).toBeCloseTo(3.92 - 14.85);
		expect(high.bz - high.az).toBeCloseTo(50 + 29.7);
		expect(high.bx).toBeCloseTo(high.ax);
	});

	it('wait, fade in by 8 to 160, and out by 2', () => {
		const streak = { prim: 2, delay: 30 };
		expect(streakAlpha(streak, 32)).toBe(0);
		expect(streakAlpha(streak, 33)).toBe(8);
		expect(streakAlpha(streak, 52)).toBe(160);
		expect(streakAlpha(streak, 53)).toBe(158);
		expect(streakAlpha(streak, 132)).toBe(0);
	});

	it('are cut short when their primitive dies after 200 ticks', () => {
		const streak = { prim: 0, delay: 139 };
		expect(streakAlpha(streak, 199)).toBe(160 - 2 * 40);
		expect(streakAlpha(streak, 200)).toBe(0);
		expect(LAST_TICK).toBe(VULCAN.prims - 1 + VULCAN.life - 1);
	});

	it('are five-sided tubes standing across the streak, lifted off the ground', () => {
		const points = ring([1, 0], 1, 5);
		expect(points).toHaveLength(STREAK.sides + 1);
		for (const p of points) {
			// across a streak along x: no x, and centred 5 up (y runs down)
			expect(p[0]).toBeCloseTo(0);
			expect(Math.hypot(p[1] + 5, p[2])).toBeCloseTo(1);
		}
		expect(points[0]).toEqual(points[STREAK.sides].map(v => expect.closeTo(v)));
	});

	it('aim at the target, in units', () => {
		expect(aim([10, 10], [13, 14], 5)).toEqual({ dir: [0.6, 0.8], distance: 25 });
		expect(aim([10, 10], [10, 10], 5)).toEqual({ dir: [1, 0], distance: 0 });
	});
});

describe('Arrow Vulcan effect', () => {
	it('draws the streaks and keeps the sound on tick 30', () => {
		const rows = EffectTable[393];
		// lasts as long as the last streak, so the manager can drop it while out of view
		expect(rows[0].duration).toBeGreaterThanOrEqual((LAST_TICK + 1) * (1000 / 60));
		expect(rows[0]).toMatchObject({ type: 'FUNC', attachedEntity: false });
		expect(rows[1]).toMatchObject({ delayWav: 500, attachedEntity: true });
	});

	it('holds 36 streaks and is cleaned up after its last tick, also when its texture cannot load', async () => {
		const { default: ArrowVulcan, tubeVertices } = await import('Renderer/Effects/ArrowVulcan.js');
		const { PRIM_TICK_MS } = await import('Renderer/Effects/EffectPrimSim.js');
		const effect = new ArrowVulcan([0, 0, 0], [5, 0, 0], 0, fixed(0));
		expect(effect.streaks).toHaveLength(36);
		effect.init({});
		expect(effect.ready).toBe(true);
		effect.render({}, 100 * PRIM_TICK_MS);
		expect(effect.needCleanUp).toBeFalsy();
		effect.render({}, (LAST_TICK + 1) * PRIM_TICK_MS);
		expect(effect.needCleanUp).toBe(true);

		// A tube runs from its start (v 1) to its end (v 0), in cells.
		const streak = effect.streaks[0];
		const v = tubeVertices(streak, [1, 0], 1);
		expect(v[4]).toBe(1);
		expect(v[2 * 5 + 4]).toBe(0);
		expect(v[2 * 5] - v[5]).toBeCloseTo((streak.bx - streak.ax) / 5);
	});
});
