import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// The EZ2 loops that #86 left out, as the official client (kRO 2026-02-11)
// plays them: Gender Change, the Druid buffs (row names decoded from the
// client's hidden strings), the Kunai - Distortion trap and Mirage clone
// units, and the rain of blasts / drops of Mission Bombard and Cross Rain.

vi.mock('Renderer/EffectManager.js', () => ({
	default: { spam: vi.fn(), has: vi.fn(() => false), remove: vi.fn() }
}));

const { default: EffectManager } = await import('Renderer/EffectManager.js');
const { default: StatusConst } = await import('DB/Status/StatusConst.js');
const { default: StatusEffectTable } = await import('DB/Status/StatusEffectTable.js');
const { default: SU } = await import('DB/Skills/SkillUnitConst.js');
const { default: SkillUnit, SkillUnitEnd } = await import('DB/Skills/SkillUnit.js');
const { updateStatusEffects } = await import('Engine/MapEngine/StatusEffects.js');
const { default: AreaSpawner, spawnInterval, spawnScale } = await import('Renderer/Effects/AreaSpawner.js');

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effectEntry(name) {
	const source = effectTableSource().replace(/\r\n/g, '\n');
	const start = source.indexOf(`\n\t${name}: [`);
	expect(start, `${name} is defined`).toBeGreaterThan(-1);
	const end = source.indexOf('\n\t],', start);
	return vm.runInNewContext(`(${source.slice(start, end + 3).trim().replace(/^\w+:/, '').replace(/,$/, '')})`);
}

const spammed = () => EffectManager.spam.mock.calls.map(c => c[0]);
const removed = () => EffectManager.remove.mock.calls.map(c => c[2]);
const two = n => String(n).padStart(2, '0');

describe('status ids', () => {
	it('match the official EFST ids', () => {
		expect(StatusConst.GENDER_CHANGE).toBe(1559);
		expect(StatusConst.WIND_VEIL).toBe(1693);
		expect(StatusConst.THUNDERING_ROD).toBe(1695);
		expect(StatusConst.THUNDERING_ROD_MAX).toBe(1696);
		expect(StatusConst.GROUND_GROW).toBe(1697);
		expect(StatusConst.MAX).toBeGreaterThan(1697);
	});
});

describe('Gender Change', () => {
	beforeEach(() => vi.clearAllMocks());

	it('plays the cast once and the loop, both half again as large', () => {
		updateStatusEffects(7, StatusConst.GENDER_CHANGE, 1, [0, 0, 0]);
		expect(spammed()).toEqual([
			{ effectId: 'gender_change_cast', ownerAID: 7, scale: 1.5 },
			{ effectId: 'gender_change_loop', ownerAID: 7, persistent: true, scale: 1.5 }
		]);
	});

	it('stops the loop and the cast when it ends, then plays gender_change', () => {
		updateStatusEffects(7, StatusConst.GENDER_CHANGE, 0);
		expect(removed().sort()).toEqual(['gender_change_cast', 'gender_change_loop']);
		expect(spammed()).toEqual([{ effectId: 'gender_change', ownerAID: 7, scale: 1.5 }]);
	});
});

describe('Druid buffs', () => {
	beforeEach(() => vi.clearAllMocks());

	it('Wind Veil loops wild_veil and its floor layer', () => {
		expect(StatusEffectTable[StatusConst.WIND_VEIL]).toEqual({ loop: ['wild_veil', 'wild_veil_bottom'] });
	});

	it('Thundering Rod at full loops thundering_rod_full', () => {
		expect(StatusEffectTable[StatusConst.THUNDERING_ROD_MAX]).toEqual({ loop: ['thundering_rod_full'] });
	});

	it.each([1, 6, 11])('Ground Grow stack %i (third value) plays ground_grow_<stack - 1>', n => {
		updateStatusEffects(7, StatusConst.GROUND_GROW, 1, [99, 99, n]);
		expect(spammed()).toEqual([{ effectId: 'ground_grow_' + two(n - 1), ownerAID: 7, persistent: true }]);
		expect(removed()).toEqual([]);
	});

	it('Ground Grow stack 12 plays ground_grow_full', () => {
		updateStatusEffects(7, StatusConst.GROUND_GROW, 1, [0, 0, 12]);
		expect(spammed()).toEqual([{ effectId: 'ground_grow_full', ownerAID: 7, persistent: true }]);
	});

	it.each([0, 13])('Ground Grow stack %i plays nothing', n => {
		updateStatusEffects(7, StatusConst.GROUND_GROW, 1, [0, 0, n]);
		expect(spammed()).toEqual([]);
	});

	it('ending Ground Grow removes every stack', () => {
		updateStatusEffects(7, StatusConst.GROUND_GROW, 0, [0, 0, 0]);
		expect(removed()).toEqual([...Array.from({ length: 11 }, (_, n) => 'ground_grow_' + two(n)), 'ground_grow_full']);
	});

	it('Thundering Rod stack 1 to 6 plays thundering_rod_00 to _05, and ending removes them', () => {
		updateStatusEffects(7, StatusConst.THUNDERING_ROD, 1, [0, 0, 6]);
		expect(spammed()).toEqual([{ effectId: 'thundering_rod_05', ownerAID: 7, persistent: true }]);
		updateStatusEffects(7, StatusConst.THUNDERING_ROD, 1, [0, 0, 7]);
		expect(spammed()).toHaveLength(1);
		updateStatusEffects(7, StatusConst.THUNDERING_ROD, 0);
		expect(removed()).toEqual(Array.from({ length: 6 }, (_, n) => 'thundering_rod_' + two(n)));
	});

	it('does not start a stack row twice', () => {
		EffectManager.has.mockReturnValueOnce(true);
		updateStatusEffects(7, StatusConst.THUNDERING_ROD, 1, [0, 0, 2]);
		expect(spammed()).toEqual([]);
	});
});

describe('Kunai - Distortion trap and Mirage clone units', () => {
	it('play their start and loop rows, and their end row where they stood', () => {
		expect(SkillUnit[SU.UNT_KUNAIWAIKYOKU]).toEqual(['kunaiarea_01_start', 'kunaiarea_01_loop']);
		expect(SkillUnitEnd[SU.UNT_KUNAIWAIKYOKU]).toEqual(['kunaiarea_01_end']);
		expect(SkillUnit[SU.UNT_SHINKIROU]).toEqual(['shinkirou_idle_start', 'shinkirou_idle_loop']);
		expect(SkillUnitEnd[SU.UNT_SHINKIROU]).toEqual(['shinkirou_idle_end']);
		expect(SU.UNT_KUNAIWAIKYOKU).toBe(298);
		expect(SU.UNT_SHINKIROU).toBe(294);
	});
});

describe('Mission Bombard and Cross Rain drops (official effects 2354 and 2462)', () => {
	it('Mission Bombard drops three silent blasts every 15 ticks over 9x9, sized 0.5 to 1', () => {
		expect(effectEntry('ef_nw_mission_bombard_field')).toEqual([
			{
				type: 'AREA_SPAWN',
				spawnEffectId: 'ef_nw_mission_bombard_drop',
				interval: 250,
				count: 3,
				areaByLevel: [9],
				area: 9,
				scaleRange: [0.5, 1]
			}
		]);
		const [drop] = effectEntry('ef_nw_mission_bombard_drop');
		expect(drop.file).toBe('night_watch/nw_mission_bombard/mission_bombard/mission_bombard_hit');
		expect(drop.wav).toBeUndefined();
	});

	it('Cross Rain drops one silent spear every 9 - level / 3 ticks, over a square set by level', () => {
		const [field] = effectEntry('ef_ig_cross_rain_field');
		expect(field.areaByLevel).toEqual([3, 3, 3, 5, 5, 5, 7, 7, 7, 9]);
		for (let level = 1; level <= 10; level++) {
			expect(spawnInterval(field, level)).toBeCloseTo(((9 - Math.floor(level / 3)) * 1000) / 60, 6);
		}
		const [drop] = effectEntry('ef_ig_cross_rain_drop');
		expect(drop.file).toBe('imperial_guard/ig_cross_rain/new_crossrain/new_cross_rain/new_cross_rain');
		expect(drop.wav).toBeUndefined();
	});

	it('the skill no longer draws a spear of its own', () => {
		const line = read('DB/Skills/SkillEffect.js')
			.split('\n')
			.find(l => l.startsWith('SkillEffect[SK.IG_CROSS_RAIN] ='));
		expect(line).toMatch(/= \{ effectIdOnCaster: 'ef_ig_cross_rain_cast' \};/);
	});

	it('a spawner drops `count` points per round, each with its own size', () => {
		const calls = [];
		const spawner = new AreaSpawner(
			{ spawnEffectId: 'blast', interval: 250, count: 3, areaByLevel: [9], scaleRange: [0.5, 1] },
			{ position: [100, 200, 0], startTick: 0 },
			{ skillLevel: 1 },
			(id, position, tick, scale) => calls.push({ id, position, tick, scale }),
			() => 0
		);
		spawner.render(null, 0);
		spawner.render(null, 260);
		expect(calls.map(c => c.tick)).toEqual([0, 0, 0, 250, 250, 250]);
		calls.forEach(c => {
			expect(Math.abs(c.position[0] - 100)).toBeLessThanOrEqual(4.5);
			expect(Math.abs(c.position[1] - 200)).toBeLessThanOrEqual(4.5);
			expect(c.scale).toBeGreaterThanOrEqual(0.5);
			expect(c.scale).toBeLessThanOrEqual(1);
		});
	});

	it('picks sizes in hundredths, ends included', () => {
		expect(spawnScale([0.5, 1], 0)).toBe(0.5);
		expect(spawnScale([0.5, 1], 0.9999)).toBe(1);
		expect(spawnScale([0.5, 1], 0.5)).toBe(0.75);
		expect(spawnScale(undefined, 0.5)).toBeUndefined();
	});
});
