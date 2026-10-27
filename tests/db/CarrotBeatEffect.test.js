import { describe, expect, it, vi } from 'vitest';

// Lunatic Carrot Beat's carrots as the official client drops them (effects 1099 / 1111).
// Spec: effect-port/summoner-skills.md.

vi.mock('Renderer/Camera.js', () => ({ default: { setQuake: vi.fn() } }));
vi.mock('Core/Events.js', () => ({ default: { setTimeout: vi.fn() } }));

const { default: Camera } = await import('Renderer/Camera.js');
const { default: Events } = await import('Core/Events.js');
const { carrotBeatSize, planCarrots, carrotBeatEffects } = await import('DB/Effects/CarrotBeatEffect.js');

describe('Lunatic Carrot Beat carrots', () => {
	it('drops 6, 10 or 14 carrots by level', () => {
		expect([1, 2, 3, 4, 5].map(carrotBeatSize)).toEqual([3, 3, 5, 5, 7]);
		expect(planCarrots(1)).toHaveLength(6);
		expect(planCarrots(4)).toHaveLength(10);
		expect(planCarrots(5)).toHaveLength(14);
	});

	it('spreads them over a 5n-unit square and staggers them by trunc(105 / 2n) ticks', () => {
		const low = planCarrots(1, () => 0);
		expect(low[0]).toEqual({ x: -7 / 5, y: -7 / 5, delay: 0 });
		expect(low[5].delay).toBe(5 * 17);
		const high = planCarrots(5, () => 0.9999);
		expect(high[0].x).toBe((34 - 17) / 5);
		expect(high[13].delay).toBe(13 * 7);
	});

	it('schedules each carrot at the target spot, the first at once', () => {
		const shower = carrotBeatEffects.ef_su_lunaticcarrotbeat[0];
		const spam = vi.fn();
		Events.setTimeout.mockImplementation(callback => callback());
		shower.func.call({ spam }, { Init: { ownerAID: 9, skillLevel: 1 }, Inst: { position: [10, 20, 0] } });
		expect(Events.setTimeout).toHaveBeenCalledTimes(6);
		expect(Events.setTimeout.mock.calls[0][1]).toBe(0);
		expect(Events.setTimeout.mock.calls[1][1]).toBeCloseTo((17 * 1000) / 60);
		expect(spam).toHaveBeenCalledTimes(6);
		expect(spam.mock.calls[0][0].effectId).toBe('ef_su_lunaticcarrotbeat_carrot');
	});

	it('drops the carrots still queued when the map changes', () => {
		const shower = carrotBeatEffects.ef_su_lunaticcarrotbeat[0];
		const manager = { spam: vi.fn(), generation: 3 };
		const queued = [];
		Events.setTimeout.mockImplementation(callback => queued.push(callback));
		shower.func.call(manager, { Init: { ownerAID: 9, skillLevel: 1 }, Inst: { position: [10, 20, 0] } });
		queued[0]();
		manager.generation++;
		queued.slice(1).forEach(callback => callback());
		expect(manager.spam).toHaveBeenCalledTimes(1);
	});

	it('draws a carrot at 4 ticks a frame, faded without the item, with a shake at 48 ticks', () => {
		const [sprite, quake] = carrotBeatEffects.ef_su_lunaticcarrotbeat_carrot;
		expect(sprite.file).toBe('su_lunaticcarrotbeat/su_lunaticcarrotbeat');
		expect(sprite.delayFrame).toBeCloseTo((4 * 1000) / 60);
		expect(sprite.opacity).toBeCloseTo(100 / 255);
		expect(carrotBeatEffects.ef_su_lunaticcarrotbeat2_carrot[0].opacity).toBeUndefined();
		quake.func({ Inst: { startTick: 1000 } });
		expect(Camera.setQuake).toHaveBeenCalledWith(1000 + 800);
	});
});
