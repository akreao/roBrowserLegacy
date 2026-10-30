import { describe, expect, it, vi } from 'vitest';
import { SMA, SWIRL, planSwirls, bandAlpha, bandPoints } from 'Renderer/Effects/SmaSwirlSim.js';
import { smaBlackEffect, swirlPositions } from 'DB/Effects/SmaBlackEffect.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Espa's dark swirls (1204 EF_SMA_BLACK and 1205), kRO 2025-07-16: 0xbfb5b0
// (primitive 120) moves a point toward the target and launches 1205 (0xbfb760,
// primitive 121: three spinning ring_blue bands) on it every 8 ticks.

vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload, onerror) {
			onerror();
		}
	}
}));

const fixed = v => () => v;

describe('Espa swirl launcher (1204)', () => {
	it('launches a swirl every 8 ticks from its third, 0.8 units further each tick', () => {
		const swirls = planSwirls(fixed(0));
		expect(swirls).toHaveLength(13);
		expect(swirls[0]).toEqual({ tick: 2, along: 0, up: 10 });
		expect(swirls[1]).toEqual({ tick: 10, along: 6.4, up: 10 });
		expect(swirls[12].tick).toBe(98);
		expect(planSwirls(fixed(0.999))[0].up).toBe(6);
		expect(SMA.life).toBe(100);
	});

	it('walks the swirls toward the target, along x when there is no distance', () => {
		const swirls = [{ along: 0 }, { along: 10 }];
		expect(swirlPositions([0, 0, 1], [0, 8, 0], swirls)).toEqual([
			[0, 0, 1],
			[0, 2, 1]
		]);
		expect(swirlPositions([3, 3, 0], [3, 3, 0], swirls)[1]).toEqual([5, 3, 0]);
	});
});

describe('Espa swirl (1205)', () => {
	it('fades in by 5 to 180, and out by 5 from tick 60', () => {
		expect(bandAlpha(1)).toBe(5);
		expect(bandAlpha(36)).toBe(180);
		expect(bandAlpha(59)).toBe(180);
		expect(bandAlpha(60)).toBe(175);
		expect(bandAlpha(95)).toBe(0);
	});

	it('draws three 315-degree bands turning 3, 4 and 5 degrees a tick', () => {
		for (let k = 0; k < SWIRL.bands; k++) {
			const points = bandPoints(k, 10);
			expect(points).toHaveLength(22);
			const radius = 2.4 + 0.2 * k;
			const start = ((90 * k + (3 + k) * 10) * Math.PI) / 180;
			expect(points[0].inner[0]).toBeCloseTo(radius * Math.cos(start));
			expect(points[0].inner[2]).toBeCloseTo(radius * Math.sin(start));
			const end = start + (315 * Math.PI) / 180;
			expect(points[21].inner[0]).toBeCloseTo(radius * Math.cos(end));
		}
	});

	it('opens like a petal: widest mid-arc, closed at the ends, fully open on tick 90', () => {
		const open = bandPoints(0, 90);
		const lean = (55 * Math.PI) / 180;
		// point 10 is 90 degrees along the 9-degree sine: the full 13 units
		expect(open[10].outer[1]).toBeCloseTo(-13 * Math.sin(lean));
		expect(open[0].outer[1]).toBeCloseTo(0);
		expect(open[21].outer[1]).toBeCloseTo(0);
		const early = bandPoints(0, 30);
		expect(early[10].outer[1]).toBeCloseTo(-13 * 0.5 * Math.sin(lean));
		expect(bandPoints(0, 100)[10].outer[1]).toBeCloseTo(open[10].outer[1]);
	});
});

describe('Espa effect', () => {
	it('plays 1204 from the caster', () => {
		expect(EffectTable[1204]).toBe(smaBlackEffect);
		expect(smaBlackEffect[0]).toMatchObject({ type: 'FUNC', attachedEntity: false });
		// lasts until the last swirl is gone, so it can be dropped while out of view
		expect(smaBlackEffect[0].duration).toBeGreaterThanOrEqual(200 * (1000 / 60));
	});

	it('adds 13 swirls, each cleaned up after its 100 ticks, also when its texture cannot load', async () => {
		const added = [];
		smaBlackEffect[0].func.call(
			{ add: effect => added.push(effect) },
			{ Inst: { position: [0, 0, 0], otherPosition: [5, 0, 0], startTick: 0 }, Init: {} }
		);
		expect(added).toHaveLength(13);
		const { PRIM_TICK_MS } = await import('Renderer/Effects/EffectPrimSim.js');
		const swirl = added[0];
		swirl.init({});
		expect(swirl.ready).toBe(true);
		swirl.render({}, swirl.startTick + 50 * PRIM_TICK_MS);
		expect(swirl.needCleanUp).toBeFalsy();
		swirl.render({}, swirl.startTick + SWIRL.life * PRIM_TICK_MS);
		expect(swirl.needCleanUp).toBe(true);
	});
});
