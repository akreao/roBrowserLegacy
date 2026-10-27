import { describe, expect, it } from 'vitest';
import {
	LIFE,
	SET_TICKS,
	SQUARES,
	STAGGER,
	START_SIZE,
	START_ALPHA,
	FADE_SIZE,
	LAST_RESTART,
	MIDDLE,
	TEXTURE,
	createSet,
	stepSet,
	squareVisible,
	squareColor,
	buildSquare
} from '../../src/Renderer/Effects/CirclePowerSim.js';

// EF_CIRCLEPOWER2..8 (861-877), the client's primitive 132: rising, fading squares of
// freeze_a.bmp on an actor a Bard or Dancer song's status starts on.
// Spec: effect-port/bard-dancer-skills.md.

const half = () => 0.5;

describe('CirclePowerSim', () => {
	it('pins the client numbers', () => {
		expect(LIFE).toBe(400);
		expect(SET_TICKS).toEqual([0, 10]);
		expect(SQUARES).toBe(4);
		expect(STAGGER).toBe(20);
		expect(START_SIZE).toBe(10);
		expect(START_ALPHA).toBe(100);
		expect(FADE_SIZE).toBe(20);
		expect(LAST_RESTART).toBe(300);
		expect(MIDDLE).toBe(10);
		expect(TEXTURE).toBe('freeze_a.bmp');
	});

	it('starts each square of a set 20 ticks after the one before', () => {
		const set = createSet(half);
		expect(set.map(s => s.age)).toEqual([0, -20, -40, -60]);
		stepSet(set, half);
		expect(set.map(squareVisible)).toEqual([true, false, false, false]);
		for (let t = 0; t < 20; t++) stepSet(set, half);
		expect(set.map(squareVisible)).toEqual([true, true, false, false]);
	});

	it('grows 2% a tick and breathes with its phase', () => {
		const set = createSet(() => 0);
		stepSet(set, () => 0);
		const square = set[0];
		expect(square.phase).toBe(1);
		expect(square.size).toBeCloseTo(10.2, 5);
		expect(square.side).toBeCloseTo(10.2 * (0.9 + 0.1 * Math.sin(Math.PI / 180)), 5);
		expect(square.alpha).toBe(100);
	});

	it('fades 3 a tick past 20 units, then starts over until it is 300 ticks old', () => {
		const set = createSet(half);
		const square = set[0];
		let t = 0;
		while (square.size <= FADE_SIZE) {
			stepSet(set, half);
			t++;
		}
		expect(t).toBe(36);
		expect(square.alpha).toBe(97);
		while (square.alpha < 100 || square.size > START_SIZE) {
			stepSet(set, half);
			t++;
		}
		expect(t).toBe(36 + 33);
		while (square.active) {
			stepSet(set, half);
			t++;
		}
		expect(t).toBeGreaterThan(LAST_RESTART);
		expect(squareVisible(square)).toBe(false);
	});

	it('colours the four squares of a set in shades of the variant', () => {
		expect([0, 1, 2, 3].map(k => squareColor(2, k))).toEqual([
			[105, 255, 105],
			[5, 255, 5],
			[55, 255, 55],
			[155, 255, 155]
		]);
		expect(squareColor(3, 0)).toEqual([105, 105, 255]);
		expect(squareColor(4, 1)).toEqual([255, 255, 5]);
		expect(squareColor(5, 2)).toEqual([255, 55, 55]);
		expect(squareColor(6, 3)).toEqual([255, 155, 255]);
		expect(squareColor(7, 0)).toEqual([105, 255, 255]);
		expect(squareColor(8, 2)).toEqual([55, 55, 55]);
		expect(squareColor(8, 3)).toEqual([255, 255, 255]);
	});

	it('stands the square upright through the centre, its middle 10 units up', () => {
		const out = new Float32Array(30);
		const square = { side: 10, turn: 0 };
		expect(buildSquare(out, 0, square, [3, 4, 0])).toBe(30);
		// first corner: 5 units out along x, 5 up; last top corner 15 up
		expect(out[0]).toBeCloseTo(3.5 + 1, 5);
		expect(out[1]).toBeCloseTo(-1, 5);
		expect(out[2]).toBeCloseTo(4.5, 5);
		expect(out[5]).toBeCloseTo(3.5 - 1, 5);
		expect(out[11]).toBeCloseTo(-3, 5);
	});
});
