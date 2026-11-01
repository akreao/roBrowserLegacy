import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import EffectTable from 'DB/Effects/EffectTable.js';
import { squareEffect } from 'DB/Effects/StasisEffect.js';
import { stasisBodyColor, planSquares, squareAlpha, squareAt, SQUARE_LIFE } from 'Renderer/Effects/StasisSim.js';
import { applyTrack } from 'Renderer/Effects/EffectPrimSim.js';

// Stasis's 799 (kRO 2025-07-16, case 0xbbb359): sound tick 6, owner colour ticks 6-40, six BuildPrim88
// (0xbec4c0) variant 3 squares (update 0xb48a6a, draw 0xb5f1e0 mode 111). Spec: effect-port/stasis.md.
describe('Stasis (effect 799)', () => {
	it('flashes the caster blue on even ticks 6-40, then recovers 8 a tick', () => {
		expect([5, 6, 7, 40].map(stasisBodyColor)).toEqual([null, [0, 0, 255], [255, 255, 255], [0, 0, 255]]);
		expect(stasisBodyColor(41)).toEqual([8, 8, 255]);
		expect(stasisBodyColor(80)).toEqual([255, 255, 255]);
	});

	it('starts six squares 4 ticks apart from tick 10, 5-10 units up', () => {
		const low = planSquares(() => 0);
		expect(low.map(s => s.start)).toEqual([10, 14, 18, 22, 26, 30]);
		expect(low.map(s => s.texture)).toEqual([1, 2, 3, 4, 5, 6]);
		expect(low[0].height).toBe(5);
		expect(planSquares(() => 0.999)[0].height).toBe(10);
	});

	it('brightens a square 6 a tick to 60, then fades 1 a tick, growing 7% a tick', () => {
		expect([0, 1, 10, 11, 70].map(squareAlpha)).toEqual([0, 6, 60, 59, 0]);
		expect(SQUARE_LIFE).toBe(70);
		expect(squareAt(0)).toBeNull();
		expect(squareAt(1).size).toBeCloseTo((0.9 * 13 * 1.07) / Math.SQRT2);
	});

	it('draws a level square turned 45 degrees, blue, adding light', () => {
		const row = squareEffect({ texture: 3, start: 18, height: 7 });
		expect(row).toMatchObject({
			prim: 'quad',
			texture: 'thunder_ball_0003.bmp',
			height: 7,
			color: [55, 55, 255],
			additive: true
		});
		const state = { trackX: 0, trackY: 0, alpha: 0, yaw: 0, size: 0 };
		expect(applyTrack(state, row, 5)).toBe(true);
		expect(state).toMatchObject({ alpha: 30, yaw: 45 });
		expect(state.size).toBeCloseTo(squareAt(5).size);
	});

	it('plays the sound on tick 6', () => {
		expect(EffectTable[799][0]).toMatchObject({ wav: 'effect/wl_stasis', delayWav: 100 });
		expect(EffectTable[799][1].type).toBe('FUNC');
	});
});
