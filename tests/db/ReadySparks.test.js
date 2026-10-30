import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import EffectTable from 'DB/Effects/EffectTable.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import StatusConst from 'DB/Status/StatusConst.js';
import { sparkEffect, SPARK_TEXTURES } from 'DB/Effects/ReadySparkEffect.js';
import { planSparks, sparkAt, sparkAlpha, SPARK_LIFE } from 'Renderer/Effects/ReadySparkSim.js';

// Numbers from the official client (kRO 2025-07-16): 543 case 0xbbe1c4 and 546 case 0xbbf288 call
// 0xbf5c10 (mode 1 / 2); prim type 59 update in 0xb46b50, draw 0xb6c630 (tint mode 1).
describe('Blue sparks (effects 543 and 546)', () => {
	const fixed = value => () => value;

	it('leaves four sparks every 4 ticks: 543 from 0 to 80, 546 from 40 to 120', () => {
		const hated = planSparks(543, fixed(0));
		expect(hated).toHaveLength(84);
		expect(hated[0].spawn).toBe(0);
		expect(hated[83].spawn).toBe(80);
		const ready = planSparks(546, fixed(0));
		expect(ready[0].spawn).toBe(40);
		expect(ready[83].spawn).toBe(120);
		expect(ready.slice(0, 4).map(s => s.k)).toEqual([0, 1, 2, 3]);
	});

	it('scatters them within 5 units, 2 to 2.9 units in size, rising 0.1 to 0.29 a tick', () => {
		const low = planSparks(543, fixed(0))[0];
		expect(low).toMatchObject({ x: -5, z: -5, size: 2, rise: 0.1 });
		const high = planSparks(543, fixed(0.999))[0];
		expect(high.x).toBe(5);
		expect(high.size).toBeCloseTo(2.9);
		expect(high.rise).toBeCloseTo(0.29);
	});

	it('fades in 15 a tick to 135, then out 3 a tick, gone on tick 56', () => {
		expect([1, 2, 10, 11].map(sparkAlpha)).toEqual([0, 15, 135, 132]);
		expect(SPARK_LIFE).toBe(56);
		const spark = { spawn: 0, k: 0, x: 0, z: 0, rise: 0.1, size: 2 };
		expect(sparkAt(spark, 54)).not.toBeNull();
		expect(sparkAt(spark, 55)).toBeNull();
	});

	it('rises from 6 units, turns 5 degrees a tick and flashes pok3 near its end', () => {
		const spark = { spawn: 0, k: 1, x: 5, z: 0, rise: 0.2, size: 2 };
		const p = sparkAt(spark, 0);
		expect(p.x).toBe(1);
		expect(p.z).toBeCloseTo(6.2 / 5);
		expect(p.angle).toBe(355);
		expect(p.size).toBeCloseTo(2 * Math.SQRT2 * 7);
		expect(sparkAt(spark, 27).texture).toBe(1);
		expect(sparkAt(spark, 28).texture).toBe(1);
		expect(sparkAt(spark, 29).texture).toBe(0);
	});

	it('draws them added and tinted, and plays 546 when a combo is ready', () => {
		const row = sparkEffect({ spawn: 0, k: 0, x: 0, z: 0, rise: 0.1, size: 2 });
		expect(row).toMatchObject({ fileList: SPARK_TEXTURES, blendMode: 2 });
		expect(row.track(5).color).toEqual([150 / 255, 150 / 255, 250 / 255]);
		expect(EffectTable[543].map(r => r.type)).toContain('FUNC');
		expect(EffectTable[546][0].type).toBe('FUNC');
		expect(StatusEffectTable[StatusConst.SMA_READY]).toEqual({ start: [546] });
	});
});
