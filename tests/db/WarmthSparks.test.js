import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import EffectTable from 'DB/Effects/EffectTable.js';
import { warmthEffect, warmthSparkRow, WARMTH_TEXTURES } from 'DB/Effects/WarmthEffect.js';
import { WARMTH_LAYERS, WarmthSparks, stepSpark } from 'Renderer/Effects/WarmthSparkSim.js';

// Numbers from the official client (kRO 2025-07-16): effect 418 calls 0xbe2c50(2, 2); prim type 99
// update 0xb56e70 and draw 0xb6da00; colour packed by 0xb7c4e0.
describe('Warmth sparks (effect 418)', () => {
	const fixed = value => () => value;

	it('brightens 25 a tick for 9 ticks, dims 12 a tick, and starts again under 12', () => {
		const spark = { t: 0, v: 0, up: 0, texture: 0, angle: 0 };
		const seen = [];
		for (let i = 0; i < 27; i++) {
			stepSpark(spark, fixed(0.5));
			seen.push(spark.v);
		}
		expect(seen.slice(0, 10)).toEqual([25, 50, 75, 100, 125, 150, 175, 200, 225, 213]);
		expect(seen[25]).toBe(21);
		expect(spark).toMatchObject({ t: 0, v: 0, angle: 180, texture: 2, up: 7 });
	});

	it('puts eight sparks 4 units out, fading in with the group age', () => {
		const sparks = new WarmthSparks(fixed(0));
		for (let i = 0; i < 8; i++) {
			const p = sparks.at(i, 0);
			expect(Math.hypot(p.x, p.y)).toBeCloseTo(4 / 5);
			expect(p.alpha).toBe(1);
		}
		expect(sparks.at(0, 4).alpha).toBe(5);
	});

	it('keeps only the low 8 bits of the alpha, as the client packs it', () => {
		// Spark 3 starts at 160, so 9 updates later it is at 385: 385 & 255 = 129
		const late = new WarmthSparks(fixed(0));
		late.ticks = 400;
		late.sparks[3].v = 385;
		expect(late.at(3, 399).alpha).toBe(129);
	});

	it('replays from the start for an earlier age', () => {
		const sparks = new WarmthSparks(fixed(0.3));
		const later = sparks.at(2, 50);
		sparks.at(2, 80);
		expect(sparks.at(2, 50)).toEqual(later);
	});

	it('draws each spark three times, added and tinted, from super1-5.bmp', () => {
		expect(WARMTH_LAYERS.map(l => l.scale)).toEqual([1, 1.2, 2]);
		const sparks = new WarmthSparks(fixed(0));
		const row = warmthSparkRow(sparks, 0, WARMTH_LAYERS[1]);
		expect(row).toMatchObject({ type: '3D', fileList: WARMTH_TEXTURES, blendMode: 2, attachedEntity: true });
		const s = row.track(0);
		expect(s.size).toBeCloseTo(33.6);
		expect(s.color).toEqual([120 / 255, 0, 0]);
		expect(s.texture).toBe(0);
		expect(EffectTable[418]).toBe(warmthEffect);
	});
});
