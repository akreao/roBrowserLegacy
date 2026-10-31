import { describe, expect, it } from 'vitest';
import {
	RING_VERTICES,
	SET_AGES,
	WAVE_FRAMES,
	taper,
	simulateRing,
	pointHeight,
	buildRing,
	headingTo
} from 'Renderer/Effects/SonicWaveSim.js';

// Sonic Wave's rings (effect 1678, kRO 2025-07-16 prim 146). Spec: effect-port/sonic-wave.md.

describe('Sonic Wave rings', () => {
	it('builds a pair of ring sets on ages 0, 20 and 40', () => {
		expect(SET_AGES).toEqual([0, 20, 40]);
		expect(WAVE_FRAMES).toBeGreaterThanOrEqual(40 + simulateRing(0, 1).length);
		expect(WAVE_FRAMES).toBeLessThan(200);
	});

	it('tapers the five points at each end of the band', () => {
		expect([0, 1, 2, 3, 4, 5, 6, 10, 14, 15, 20].map(taper)).toEqual([
			0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 0.9, 0.4
		]);
	});

	it('starts ring i 8 i ticks late, fades in by 25 and out by 10', () => {
		const ring = simulateRing(1, 0);
		expect(ring.slice(1, 9)).toEqual(Array(8).fill(null));
		expect(ring[9]).toMatchObject({ age: 1, alpha: 25, lean: 65, drift: 0.75 });
		expect(ring[17].alpha).toBe(225);
		expect(ring[18].alpha).toBe(215);
		expect(ring[9].foot).toBeCloseTo(5.9);
	});

	it('starts over with the lean 20 lower, and stops at 40', () => {
		const ring0 = simulateRing(0, 0);
		const restart = ring0.findIndex((s, t) => t > 1 && s && s.age === 0);
		expect(ring0[restart]).toMatchObject({ alpha: 0, lean: 50 });
		expect(ring0[restart].foot).toBeCloseTo(5.6);
		expect(ring0[restart + 1].drift).toBeCloseTo((restart + 1) * 0.75);
		expect(ring0[ring0.length - 1]).toBeNull();
		// ring 2 (lean 60) and ring 3 (lean 55) run once
		expect(simulateRing(2, 1).filter(s => s && s.age === 0)).toHaveLength(0);
	});

	it('caps the alpha at 125 in the low-effects mode', () => {
		expect(Math.max(...simulateRing(0, 0, true).map(s => (s ? s.alpha : 0)))).toBe(125);
		expect(Math.max(...simulateRing(0, 0).map(s => (s ? s.alpha : 0)))).toBe(225);
	});

	it('grows the band with sin(6 age) to age 15', () => {
		expect(pointHeight(0, 10, 15)).toBeCloseTo(30);
		expect(pointHeight(1, 10, 5)).toBeCloseTo(20 * Math.sin(Math.PI / 6));
		expect(pointHeight(0, 0, 40)).toBeCloseTo(12);
	});

	it('opens the arc towards the caster and drifts along the heading', () => {
		expect(headingTo([0, 0, 0], [3, 0, 0])).toBe(0);
		expect(headingTo([0, 0, 0], [0, 2, 0])).toBe(90);
		const out = new Float32Array(RING_VERTICES * 5);
		const state = { age: 15, alpha: 100, lean: 90, foot: 5, drift: 0 };
		const end = buildRing(out, 0, state, 0, 0, [0, 0, 0]);
		expect(end).toBe(RING_VERTICES * 5);
		// The first foot point sits at heading + 195 on the foot circle (one cell from the centre).
		expect(out[0] - 0.5).toBeCloseTo(Math.cos((195 * Math.PI) / 180));
		expect(out[2] - 0.5).toBeCloseTo(Math.sin((195 * Math.PI) / 180));
		const moved = buildRing(new Float32Array(RING_VERTICES * 5), 0, { ...state, drift: 5 }, 0, 0, [0, 0, 0]);
		expect(moved).toBe(end);
	});
});
