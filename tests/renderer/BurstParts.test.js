import { describe, expect, it } from 'vitest';

// The official client's primitive 89 (kRO 2025-07-16): helper 0xbd91c0, update
// 0xb46b50 case 0x59, draw 0xb69040. True Sight 386 adds 12 sets, variant 3.
const { BLADES_PER_SET, BURST_HEIGHT, createBurst, stepBurst, burstAlive, bladeCorners, bladeWidths } =
	await import('Renderer/Effects/BurstPartsSim.js');

const { default: EffectTable } = await import('DB/Effects/EffectTable.js');

describe('primitive 89 bursts', () => {
	it('lays out four blades a set, 7 degrees a set for variant 3', () => {
		const burst = createBurst(3, 12, () => 0.5);
		expect(BLADES_PER_SET).toBe(4);
		expect(burst.blades).toHaveLength(48);
		expect(burst.blades.slice(0, 4).map(b => b.angle)).toEqual([0, 90, 180, 270]);
		expect(burst.blades[4].angle).toBe(7);
		expect(burst.blades[0]).toMatchObject({ turn: 180, counter: 0, alpha: 0, length: 2 });
		expect(createBurst(0, 1).blades[0].counter).toBe(-24);
		expect(createBurst(0, 2).blades[4].angle).toBe(22);
	});

	it('fades variant 3 in +6 to 60 by tick 10, then -1 a tick, growing 3 a tick', () => {
		const burst = createBurst(3, 1);
		const b = burst.blades[0];
		for (let t = 0; t < 10; t++) {
			stepBurst(burst);
		}
		expect(b.alpha).toBe(60);
		expect(b.length).toBe(32);
		stepBurst(burst);
		expect(b.alpha).toBe(60);
		stepBurst(burst);
		expect(b.alpha).toBe(59);
		while (burstAlive(burst)) {
			stepBurst(burst);
		}
		expect(burst.ticks).toBe(71);
	});

	it('waits 24 ticks for the other variants, then +20 / -15 and x1.15', () => {
		const burst = createBurst(4, 1);
		const b = burst.blades[0];
		for (let t = 0; t < 24; t++) {
			stepBurst(burst);
		}
		expect(b.alpha).toBe(0);
		expect(burstAlive(burst)).toBe(true);
		stepBurst(burst);
		expect(b.alpha).toBe(20);
		expect(b.length).toBeCloseTo(2.3);
	});

	it('draws each blade from 12 units up out to its length', () => {
		const corners = bladeCorners({ angle: 0, turn: 0, length: 10 }, 2);
		expect(BURST_HEIGHT).toBe(-12);
		expect(corners[2]).toEqual([0, -12, 0]);
		expect(corners[3]).toEqual([0, -12, 0]);
		expect(Math.hypot(corners[0][0], corners[0][1] + 12, corners[0][2])).toBeCloseTo(10);
		expect(corners[0][2]).toBeCloseTo(-corners[1][2]);
		expect(bladeWidths(3)).toEqual([2, 5]);
		expect(bladeWidths(2)).toEqual([1, 2]);
	});

	it('is on True Sight 386, with its sound', () => {
		const rows = EffectTable[386];
		expect(rows[0].wav).toBe('effect/hunter_detecting');
		expect(rows[1].type).toBe('FUNC');
		expect(rows[1].duration).toBeCloseTo((250 * 1000) / 60);
	});
});
