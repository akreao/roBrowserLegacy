import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const running = new Set();
vi.mock('Renderer/EffectManager.js', () => ({
	default: {
		spam: vi.fn(par => {
			if (par.persistent) {
				running.add(par.ownerAID + ':' + par.effectId);
			}
		}),
		has: vi.fn((AID, effectId) => running.has(AID + ':' + effectId)),
		remove: vi.fn((effect, AID, effectId) => running.delete(AID + ':' + effectId))
	}
}));

const { default: EffectManager } = await import('Renderer/EffectManager.js');
const { default: StatusConst } = await import('DB/Status/StatusConst.js');
const { updateStatusEffects } = await import('Engine/MapEngine/StatusEffects.js');

// The effect table imports most of the renderer, so read entries from its source.
function effectEntry(name) {
	const source = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
	const start = source.indexOf(`\n\t${name}: [`);
	const end = source.indexOf('\n\t],', start);
	return vm.runInNewContext(`(${source.slice(start, end + 3).trim().replace(/^\w+:/, '').replace(/,$/, '')})`);
}

describe('Rising Moon status effects', () => {
	beforeEach(() => {
		running.clear();
		vi.clearAllMocks();
	});

	it('plays the burst and starts the loop when the status starts', () => {
		updateStatusEffects(7, StatusConst.RISING_MOON, 1);
		expect(EffectManager.spam.mock.calls.map(c => c[0])).toEqual([
			{ effectId: 'ef_ske_rising_moon_00', ownerAID: 7 },
			{ effectId: 'ef_ske_rising_moon_01', ownerAID: 7, persistent: true }
		]);
	});

	it('keeps one loop per actor when the status starts again', () => {
		updateStatusEffects(7, StatusConst.RISING_MOON, 1);
		updateStatusEffects(7, StatusConst.RISING_MOON, 1);
		const loops = EffectManager.spam.mock.calls.filter(c => c[0].effectId === 'ef_ske_rising_moon_01');
		expect(loops).toHaveLength(1);
		expect(EffectManager.spam.mock.calls.filter(c => c[0].effectId === 'ef_ske_rising_moon_00')).toHaveLength(2);
	});

	it('stops only the loop when the status ends', () => {
		updateStatusEffects(7, StatusConst.RISING_MOON, 1);
		updateStatusEffects(7, StatusConst.RISING_MOON, 0);
		expect(EffectManager.remove).toHaveBeenCalledTimes(1);
		expect(EffectManager.remove).toHaveBeenCalledWith(null, 7, 'ef_ske_rising_moon_01');
	});

	it('ignores statuses with no effects', () => {
		updateStatusEffects(7, 999999, 1);
		expect(EffectManager.spam).not.toHaveBeenCalled();
	});

	it('uses the official files and timing', () => {
		const burst = effectEntry('ef_ske_rising_moon_00')[0];
		const loop = effectEntry('ef_ske_rising_moon_01')[0];
		expect(burst.file).toBe('sky_emperor/ske_rising_moon/ske_rising_moon_00');
		expect(burst.wav).toBe('effect/sky_emperor/ske_rising_sun_moon');
		expect(burst.repeat).toBeUndefined();
		expect(loop.file).toBe('sky_emperor/ske_rising_moon/ske_rising_moon_01');
		expect(loop.repeat).toBe(true);
		expect(loop.delayStart).toBe(336);
		expect(loop.wav).toBeUndefined();
		for (const part of [burst, loop]) {
			expect(part.texturePath).toBe('sky_emperor/ske_rising_moon/');
			expect(part.yOffset).toBe(13);
			expect(part.attachedEntity).toBe(true);
		}
	});

	it('plays the next stance each time Rising Moon is cast', () => {
		const stances = [
			[StatusConst.MIDNIGHT_MOON, '02', '03'],
			[StatusConst.DAWN_MOON, '04', '05']
		];
		for (const [status, burstId, loopId] of stances) {
			vi.clearAllMocks();
			updateStatusEffects(7, status, 1);
			expect(EffectManager.spam.mock.calls.map(c => c[0].effectId)).toEqual([
				`ef_ske_rising_moon_${burstId}`,
				`ef_ske_rising_moon_${loopId}`
			]);
			const burst = effectEntry(`ef_ske_rising_moon_${burstId}`)[0];
			const loop = effectEntry(`ef_ske_rising_moon_${loopId}`)[0];
			expect(burst.file).toBe(`sky_emperor/ske_rising_moon/ske_rising_moon_${burstId}`);
			expect(burst.wav).toBe('effect/sky_emperor/ske_rising_sun_moon');
			expect(loop.repeat).toBe(true);
			expect(loop.delayStart).toBe(656);
			updateStatusEffects(7, status, 0);
			expect(EffectManager.remove).toHaveBeenCalledWith(null, 7, `ef_ske_rising_moon_${loopId}`);
		}
	});
});

describe('Rising Sun status effects', () => {
	beforeEach(() => {
		running.clear();
		vi.clearAllMocks();
	});

	it('plays the burst and starts the loop when the status starts', () => {
		updateStatusEffects(9, StatusConst.RISING_SUN, 1);
		expect(EffectManager.spam.mock.calls.map(c => c[0])).toEqual([
			{ effectId: 'ef_ske_rising_sun_00', ownerAID: 9 },
			{ effectId: 'ef_ske_rising_sun_01', ownerAID: 9, persistent: true }
		]);
	});

	it('stops only the loop when the status ends', () => {
		updateStatusEffects(9, StatusConst.RISING_SUN, 1);
		updateStatusEffects(9, StatusConst.RISING_SUN, 0);
		expect(EffectManager.remove).toHaveBeenCalledTimes(1);
		expect(EffectManager.remove).toHaveBeenCalledWith(null, 9, 'ef_ske_rising_sun_01');
	});

	it.each([
		['RISING_SUN', '00', '01', 336],
		['NOON_SUN', '02', '03', 656],
		['SUNSET_SUN', '04', '05', 656]
	])('%s uses the official files and timing', (status, burstId, loopId, loopDelay) => {
		updateStatusEffects(9, StatusConst[status], 1);
		expect(EffectManager.spam.mock.calls.map(c => c[0].effectId)).toEqual([
			'ef_ske_rising_sun_' + burstId,
			'ef_ske_rising_sun_' + loopId
		]);
		const burst = effectEntry('ef_ske_rising_sun_' + burstId)[0];
		const loop = effectEntry('ef_ske_rising_sun_' + loopId)[0];
		expect(burst.file).toBe('sky_emperor/ske_rising_sun/ske_rising_sun_' + burstId);
		expect(burst.min).toBe('sky_emperor/ske_rising_sun/min_ske_rising_sun_' + burstId);
		expect(burst.wav).toBe('effect/sky_emperor/ske_rising_sun_moon');
		expect(burst.repeat).toBeUndefined();
		expect(burst.delayStart).toBeUndefined();
		expect(loop.file).toBe('sky_emperor/ske_rising_sun/ske_rising_sun_' + loopId);
		expect(loop.min).toBe('sky_emperor/ske_rising_sun/min_ske_rising_sun_' + loopId);
		expect(loop.repeat).toBe(true);
		expect(loop.delayStart).toBe(loopDelay);
		expect(loop.wav).toBeUndefined();
		for (const part of [burst, loop]) {
			expect(part.texturePath).toBe('sky_emperor/ske_rising_sun/');
			expect(part.ez2PosY).toBe(13);
			expect(part.attachedEntity).toBe(true);
		}
	});

	it('adds no cast effect of its own to the skill', () => {
		const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
		expect(source).not.toMatch(/SkillEffect\[SK\.SKE_RISING_SUN\]/);
	});
});
