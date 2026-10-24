import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const { default: AreaSpawner, spawnAreaWidth, spawnOffset, spawnsDue } = await import(
	'Renderer/Effects/AreaSpawner.js'
);

// The effect table imports most of the renderer, so read named entries from its source.
function effectEntry(name) {
	const source = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
	const start = source.indexOf(`\n\t${name}: [`);
	expect(start).toBeGreaterThan(-1);
	const end = source.indexOf('\n\t],', start);
	const body = source.slice(start, end + 3).trim().replace(/^\w+:/, '').replace(/,\s*$/, '');
	return vm.runInNewContext(`(${body})`);
}

describe('area spawner', () => {
	it('picks the square width from the level, else from the unit range', () => {
		const effect = { areaByLevel: [13, 13, 11, 11, 9] };
		expect([1, 2, 3, 4, 5].map(lv => spawnAreaWidth(effect, lv))).toEqual([13, 13, 11, 11, 9]);
		expect(spawnAreaWidth(effect, 10)).toBe(9);
		expect(spawnAreaWidth(effect, undefined, 6)).toBe(13);
		expect(spawnAreaWidth(effect, undefined, 4)).toBe(9);
		expect(spawnAreaWidth(effect)).toBe(9);
	});

	it('spreads points evenly over the square in steps of 1/50 cell', () => {
		expect(spawnOffset(13, 0)).toBe(-6.5);
		expect(spawnOffset(13, 0.9999999)).toBe(6.5);
		expect(spawnOffset(9, 0.5)).toBe(0);
		expect(spawnOffset(9, 0.25) * 50).toBeCloseTo(Math.round(spawnOffset(9, 0.25) * 50), 9);
	});

	it('spawns at the start and then every interval', () => {
		expect(spawnsDue(1000, 300, 999)).toBe(0);
		expect(spawnsDue(1000, 300, 1000)).toBe(1);
		expect(spawnsDue(1000, 300, 1299)).toBe(1);
		expect(spawnsDue(1000, 300, 1300)).toBe(2);
		// A 3.5 s Twinkling Galaxy field drops 12 stars
		expect(spawnsDue(0, 300, 3499)).toBe(12);
	});

	it('spams the star effect inside the field', () => {
		const calls = [];
		const spawner = new AreaSpawner(
			{ spawnEffectId: 'star', interval: 300, areaByLevel: [13, 13, 11, 11, 9] },
			{ position: [100, 200, 0], startTick: 0 },
			{ skillLevel: 5 },
			(id, position, tick) => calls.push({ id, position, tick }),
			() => 3
		);
		spawner.render(null, 0);
		spawner.render(null, 16);
		spawner.render(null, 300);
		spawner.render(null, 610);
		expect(calls.map(c => c.tick)).toEqual([0, 300, 600]);
		calls.forEach(c => {
			expect(c.id).toBe('star');
			expect(Math.abs(c.position[0] - 100)).toBeLessThanOrEqual(4.5);
			expect(Math.abs(c.position[1] - 200)).toBeLessThanOrEqual(4.5);
			expect(c.position[2]).toBe(3);
		});
	});

	it('drops only the latest point after a long pause', () => {
		const calls = [];
		const spawner = new AreaSpawner(
			{ spawnEffectId: 'star', interval: 300, area: 5 },
			{ position: [0, 0, 0], startTick: 0 },
			{},
			(id, position, tick) => calls.push(tick)
		);
		spawner.render(null, 0);
		spawner.render(null, 3000);
		expect(calls).toEqual([0, 3000]);
	});
});

describe('Twinkling Galaxy', () => {
	it('uses the official field timing and size', () => {
		const [field] = effectEntry('ef_ske_twinkling_galaxy_field');
		expect(field.type).toBe('AREA_SPAWN');
		expect(field.interval).toBe(300); // 18 ticks at 60 Hz
		expect(field.areaByLevel).toEqual([13, 13, 11, 11, 9]);
		expect(field.spawnEffectId).toBe('ef_ske_twinkling_galaxy_star');
	});

	it('drops the star with its floor landing and the Star Cannon sound', () => {
		const [bottom, star] = effectEntry('ef_ske_twinkling_galaxy_star');
		expect(bottom.file).toMatch(/ske_twinkling_galaxy_bottom$/);
		expect(bottom.renderBeforeEntities).toBe(true);
		expect(star.file).toMatch(/twinkling_galaxy\/ske_twinkling_galaxy03$/);
		expect(star.wav).toBe('effect/sky_emperor/ske_star_cannon');
	});
});
