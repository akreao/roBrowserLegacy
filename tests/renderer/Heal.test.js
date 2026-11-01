import { describe, expect, it, vi } from 'vitest';
import { HEAL_LIFE, HEAL_KINDS, createHeal, stepHeal } from 'Renderer/Effects/HealSim.js';
import { SPARK_WINDOWS, planSparks, sparkAt, sparkSet } from 'Renderer/Effects/ReadySparkSim.js';
import { sparkEffect } from 'DB/Effects/ReadySparkEffect.js';
import HealCylinders from 'Renderer/Effects/HealCylinders.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Heal 312 / 320, kRO 2025-07-16: 0xbee690(alpha_down.tga, 0 / 1); primitive 60 bands (update 0xb57210, ring
// render 0xb61550) and primitive 59 pok1 sparks every 6th tick.

vi.mock('Core/Client.js', () => ({ default: { loadFile() {} } }));

const run = (heal, n) => {
	for (let i = 0; i < n; i++) {
		stepHeal(heal);
	}
};

describe('Heal cylinders (312, 320)', () => {
	it('builds two upright bands with the client numbers', () => {
		const a = createHeal(312, () => 0);
		expect(a.bands.map(b => [b.start, b.foot, b.lean, b.length])).toEqual([
			[0, 4.6, 90, 40],
			[0, 4.8, 90, 40]
		]);
		const draws = [7, 19, 99, 300];
		const b = createHeal(320, () => draws.shift());
		expect(b.bands.map(x => x.start)).toEqual([7, 300]);
		expect(b.bands[0].length).toBe(59);
		expect(b.bands[0].foot).toBeCloseTo(4.995);
		expect(b.bands[1].foot).toBeCloseTo(5.195);
		expect(HEAL_KINDS[312].tint).toEqual([140, 210, 140]);
		expect(HEAL_LIFE).toBe(100);
	});

	it('fades in by 5 to 75, holds, fades by 2 after its hold', () => {
		const heal = createHeal(312, () => 0);
		run(heal, 15);
		expect(heal.bands[0].alpha).toBe(75);
		run(heal, 44);
		expect(heal.bands[0].alpha).toBe(75);
		run(heal, 2);
		expect(heal.bands[0].alpha).toBe(71);
		const short = createHeal(320, () => 0);
		run(short, 31);
		expect(short.bands[0].alpha).toBe(71);
	});

	it('raises its strips with sin(age) and waves them', () => {
		const heal = createHeal(312, () => 0);
		run(heal, 90);
		// band 0, strip 0: 0.75 L + 0.25 L sin(4 x 90)
		expect(heal.bands[0].points[0]).toBeCloseTo(30);
		run(heal, 1);
		expect(heal.bands[0].points[0]).toBeCloseTo(30 + 10 * Math.sin((4 * 91 * Math.PI) / 180));
	});

	it('leaves pok1 sparks every 6th tick, on the ground, white, normally blended', () => {
		expect(SPARK_WINDOWS[312]).toEqual({ from: 6, to: 48 });
		const sparks = planSparks(312, () => 0);
		expect(sparks).toHaveLength(32);
		expect(sparks[0]).toMatchObject({ spawn: 6, x: -6, z: -6, rise: 0.3, size: 2 });
		expect(sparkAt(sparks[0], 0).z).toBeCloseTo(0.3 / 5);
		expect(sparkAt(sparks[0], 34).texture).toBe(0);
		expect(planSparks(320, () => 0)).toHaveLength(16);
		expect(sparkSet(320)).toMatchObject({ riseBase: 0.4, flash: true, additive: false });
		const row = sparkEffect(sparks[0], sparkSet(312));
		expect(row.blendMode).toBe(8);
		expect(row.track(0).color).toEqual([1, 1, 1]);
	});

	it('leaves each spark where it was left when the target moves', () => {
		const owner = { position: [10, 10, 0] };
		const spark = planSparks(312, () => 0)[0];
		const row = sparkEffect(spark, sparkSet(312), owner);
		const first = row.track(0);
		owner.position = [11, 10, 0];
		const later = row.track(1);
		expect(later.x).toBeCloseTo(first.x - 1);
		expect(later.y).toBeCloseTo(first.y);
	});

	it('keeps 543 and 546 as they were', () => {
		const set = sparkSet(543);
		expect(set).toMatchObject({ every: 4, scatter: 11, offset: 5, riseBase: 0.1, riseRange: 20, additive: true });
		expect(sparkEffect(planSparks(543, () => 0)[0]).blendMode).toBe(2);
	});

	it('312 plays the sound once, the bands and the sparks', () => {
		const rows = EffectTable[312];
		expect(rows[0]).toEqual({ wav: '_heal_effect', attachedEntity: true });
		const added = [];
		rows[1].func.call({ add: e => added.push(e) }, { Inst: { startTick: 0 }, Init: { ownerEntity: { position: [1, 1, 0] } } });
		expect(added[0]).toBeInstanceOf(HealCylinders);
		expect(rows[2].type).toBe('FUNC');
	});
});
