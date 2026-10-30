import { describe, expect, it, vi } from 'vitest';
import { SMA, SWIRL, SWIRL_LOOKS, planSwirls, bandAlpha, bandPoints } from 'Renderer/Effects/SmaSwirlSim.js';
import { smaBlackEffect, smaEffect, sma2Effect, swirlPositions } from 'DB/Effects/SmaBlackEffect.js';
import { BLEND_ADD, BLEND_ALPHA } from 'Renderer/Effects/AuraBlend.js';
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

// 551 (EF_SMA, 0xbfb5b0 with 0) is the same launcher; it launches 552 (EF_SMA2, 0xbfb150),
// the same swirl drawn blue (90, 90, 255) and added rather than dark grey (0xb78950).
describe('Blue swirls (551, 552)', () => {
	it("draws them blue and added, Espa's dark and alpha-blended", () => {
		expect(SWIRL_LOOKS.blue).toEqual({ color: [90, 90, 255], add: true });
		expect(SWIRL_LOOKS.dark).toEqual({ color: [70, 70, 70], add: false });
	});

	it('plays 551 as the launcher and 552 as one swirl', () => {
		expect(EffectTable[551]).toBe(smaEffect);
		expect(EffectTable[552]).toBe(sma2Effect);
		const trail = [];
		smaEffect[0].func.call(
			{ add: effect => trail.push(effect) },
			{ Inst: { position: [0, 0, 0], otherPosition: [5, 0, 0], startTick: 0 }, Init: {} }
		);
		expect(trail).toHaveLength(13);
		expect(trail[0].blend).toBe(BLEND_ADD);
		expect(trail[0].color).toEqual([90 / 255, 90 / 255, 1]);
		const one = [];
		sma2Effect[0].func.call({ add: effect => one.push(effect) }, { Inst: { position: [1, 2, 0], startTick: 0 }, Init: {} });
		expect(one).toHaveLength(1);
		expect(one[0].position).toEqual([1, 2, 0]);
		expect(one[0].blend).toBe(BLEND_ADD);
		const dark = [];
		smaBlackEffect[0].func.call(
			{ add: effect => dark.push(effect) },
			{ Inst: { position: [0, 0, 0], startTick: 0 }, Init: {} }
		);
		expect(dark[0].blend).toBe(BLEND_ALPHA);
	});
});
