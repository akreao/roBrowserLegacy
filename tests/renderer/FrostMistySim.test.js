import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import EffectTable from 'DB/Effects/EffectTable.js';
import { GLOW_TEXTURE, SNOW_TEXTURES, glowRingEffect, flakeEffect } from 'DB/Effects/FrostMistyEffect.js';
import { GLOW_LIFE, ringAlpha, glowSize, ringAt, planSnow, flakeAt } from 'Renderer/Effects/FrostMistySim.js';

// Frost Misty's 726 (kRO 2025-07-16, case 0xbbc442): prim 131 glow (0xbdc690, update 0xb55bb0, draw 0xb70b40)
// and prim 59 snow (0xc0ed50 mode 1, update 0xb4bc83, draw 0xb6c630). Spec: effect-port/frost-misty.md.
describe('Frost Misty (effect 726)', () => {
	const fixed = value => () => value;

	it('brightens each glow ring 13 a tick to its cap, then fades 5 a tick from tick 20', () => {
		expect([1, 5, 6, 19, 20, 33, 34].map(n => ringAlpha(1, n))).toEqual([13, 65, 70, 70, 65, 0, 0]);
		expect([19, 20, 66].map(n => ringAlpha(9, n))).toEqual([230, 225, 0]);
	});

	it('holds the middle ring at 247 until tick 100, gone on tick 150', () => {
		expect([19, 100, 101, 149, 150].map(n => ringAlpha(10, n))).toEqual([247, 247, 242, 2, 0]);
		expect(GLOW_LIFE).toBe(150);
	});

	it('grows the glow 1% a tick from 24 units, 2% while the middle ring fades', () => {
		expect(glowSize(0)).toBe(24);
		expect(glowSize(100)).toBeCloseTo(24 * 1.01 ** 100);
		expect(glowSize(110)).toBeCloseTo(24 * 1.01 ** 120);
		expect(glowSize(200)).toBeCloseTo(24 * 1.01 ** 249);
	});

	it('draws the rings 30 units up, 3 units apart, blue', () => {
		const outer = ringAt(1, 0);
		const middle = ringAt(10, 0);
		expect(middle.z).toBe(6);
		expect(middle.size).toBeCloseTo(24 * 1.01 * Math.SQRT2 * 7);
		expect(outer.size - middle.size).toBeCloseTo(27 * Math.SQRT2 * 7);
		expect(outer.color).toEqual([5, 5, 255]);
		expect(middle.color).toEqual([55, 55, 255]);
		expect(ringAt(1, 40)).toBeNull();
	});

	it('leaves four flakes every 8 ticks from 0 to 96, up to 40 units away and 6-36 up', () => {
		const low = planSnow(fixed(0));
		expect(low).toHaveLength(52);
		expect(low[51].spawn).toBe(96);
		expect(low[0]).toMatchObject({ x: 0, z: 0, height: 6, size: 1.5, rise: 0.1 });
		const high = planSnow(fixed(0.999))[0];
		expect(Math.hypot(high.x, high.z)).toBeCloseTo(40);
		expect(high.height).toBe(36);
		expect(high.size).toBeCloseTo(2);
		expect(high.rise).toBeCloseTo(0.29);
	});

	it('moves a flake like the blue sparks: rising, turning, E9_snow02 near its end', () => {
		const flake = { spawn: 0, k: 0, x: 10, z: 0, height: 6, rise: 0.2, size: 1.5 };
		expect(flakeAt(flake, 0)).toMatchObject({ x: 2, alpha: 0, angle: 355, texture: 0 });
		expect(flakeAt(flake, 0).z).toBeCloseTo(6.2 / 5);
		expect(flakeAt(flake, 34).texture).toBe(1);
		expect(flakeAt(flake, 55)).toBeNull();
	});

	it('plays the sound on tick 10 and draws with the client pictures, adding light', () => {
		expect(EffectTable[726][0].delayWav).toBe(167);
		expect(EffectTable[726][1].type).toBe('FUNC');
		expect(glowRingEffect(1)).toMatchObject({ fileList: [GLOW_TEXTURE], blendMode: 2 });
		expect(flakeEffect({ spawn: 0, k: 0, x: 0, z: 0, height: 6, rise: 0.1, size: 1.5 })).toMatchObject({
			fileList: SNOW_TEXTURES,
			blendMode: 2
		});
	});
});
