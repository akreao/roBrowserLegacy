import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BURST_COUNT, BURST_GAP_MS, SKY_SUN_BURST, skySunBursts, spawnSkySunBursts } from 'DB/Effects/SkySunEffect.js';

// Sky Sun (SKE_SKY_SUN) as the official client plays it (kRO 2026-02-11 and
// its ez2streffect.bson): see effect-port/sky-sun.md in the project files.

const read = file => readFileSync(join(process.cwd(), 'src/DB', file), 'utf8').replace(/\r\n/g, '\n');

function block(text, id) {
	const start = text.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return text.slice(start, text.indexOf('\n\t],', start));
}

describe('Sky Sun bursts', () => {
	it('spawns six, two 60 Hz ticks apart', () => {
		const bursts = skySunBursts(() => 0.5);
		expect(bursts).toHaveLength(BURST_COUNT);
		expect(BURST_COUNT).toBe(6);
		expect(BURST_GAP_MS).toBeCloseTo(33.333, 3);
		expect(bursts.map(b => b.delay)).toEqual([0, 1, 2, 3, 4, 5].map(k => (k * 2000) / 60));
	});

	it('scatters each one -14 to +15 official units (5 to a cell) on both ground axes', () => {
		expect(skySunBursts(() => 0)[0]).toMatchObject({ x: 3, y: 3 });
		expect(skySunBursts(() => 0.9999)[0]).toMatchObject({ x: -2.8, y: -2.8 });
		expect(skySunBursts(() => 0.5)[0]).toMatchObject({ x: 0, y: 0 });
	});

	it('plays the small sunset art with Sky Sun_1 sound, not following the caster', () => {
		expect(SKY_SUN_BURST).toMatchObject({
			type: 'STR',
			file: 'sky_emperor/ske_sunset_blast/sunset_blast_small',
			texturePath: 'sky_emperor/ske_sunset_blast/',
			min: 'sky_emperor/ske_sunset_blast/min_sunset_blast_small',
			wav: 'effect/sky_emperor/ske_sky_sun_1',
			yOffset: 10,
			attachedEntity: false
		});
		// Not a floor effect (EZ2 sky_sun_small): drawn over the characters
		expect(SKY_SUN_BURST.renderBeforeEntities).toBeUndefined();
	});

	it('spawns them around the cast position, from the cast tick', () => {
		const manager = { spamEffect: vi.fn() };
		const Init = { ownerAID: 7, position: [100, 50, 2] };
		spawnSkySunBursts.call(manager, { Inst: { position: [100, 50, 2], startTick: 1000, effectID: 'x' }, Init });
		expect(manager.spamEffect).toHaveBeenCalledTimes(6);
		manager.spamEffect.mock.calls.forEach(([params], k) => {
			const [x, y, z] = params.Init.position;
			expect(Math.abs(x - 100)).toBeLessThanOrEqual(3);
			expect(Math.abs(y - 50)).toBeLessThanOrEqual(3);
			expect(z).toBe(2);
			expect(params.Inst.startTick).toBeCloseTo(1000 + k * BURST_GAP_MS);
			expect(params.effect).toBe(SKY_SUN_BURST);
		});
		expect(Init.position).toEqual([100, 50, 2]);
	});
});

describe('Sky Sun effect table', () => {
	const effectTable = read('Effects/EffectTable.js');
	const skillEffect = read('Skills/SkillEffect.js');

	it('maps the skill to its cast and hit effects', () => {
		expect(skillEffect).toMatch(
			/SkillEffect\[5502 \/\* SKE_SKY_SUN \*\/\] = \{ effectId: 'ef_ske_sky_sun', hitEffectId: 'ef_ske_sky_sun_hit' \}/
		);
	});

	it('draws the sun under the caster, then the bursts', () => {
		const cast = block(effectTable, 'ef_ske_sky_sun');
		expect(cast).toMatch(/file: 'sky_emperor\/ske_sky_sun\/sky_sun\/sky_sun'/);
		expect(cast).toMatch(/wav: 'effect\/sky_emperor\/ske_sky_sun'/);
		expect(cast).toMatch(/yOffset: 10/);
		// A floor effect (EZ2 sky_sun IsFloor)
		expect(cast).toMatch(/renderBeforeEntities: true/);
		expect(cast).toMatch(/attachedEntity: true/);
		expect(cast).toMatch(/func: spawnSkySunBursts/);
	});

	it('draws the hit on the target, without a sound', () => {
		const hit = block(effectTable, 'ef_ske_sky_sun_hit');
		expect(hit).toMatch(/file: 'sky_emperor\/ske_sky_sun\/sky_sun_hit\/sky_sun_hit'/);
		expect(hit).toMatch(/yOffset: 8/);
		expect(hit).toMatch(/attachedEntity: true/);
		expect(hit).not.toMatch(/wav:/);
	});
});
