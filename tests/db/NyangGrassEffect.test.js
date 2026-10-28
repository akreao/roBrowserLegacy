import { describe, expect, it, vi } from 'vitest';

// Nyang Grass's field as the official client draws it (effect 1125). Spec: effect-port/summoner-skills.md.

vi.mock('Renderer/Map/Altitude.js', () => ({ default: { getCellHeight: (x, y) => x + y / 10 } }));

import { nyangGrassCells, nyangGrassSize, nyangGrassEffects } from 'DB/Effects/NyangGrassEffect.js';

describe('Nyang Grass field', () => {
	it('is 5, 7 or 9 cells across by level', () => {
		expect([1, 2, 3, 4, 5].map(level => nyangGrassSize(level))).toEqual([5, 5, 7, 7, 9]);
	});

	it('sizes the field from the unit range when the packet has no level', () => {
		expect([2, 3, 4].map(range => nyangGrassSize(undefined, range))).toEqual([5, 7, 9]);
		expect(nyangGrassCells(undefined, 4)).toHaveLength(81);
		expect(nyangGrassSize(5, 2)).toBe(9);
		expect(nyangGrassSize(undefined, undefined)).toBe(5);
	});

	it('puts one copy on every cell of the square, centred on the unit', () => {
		const cells = nyangGrassCells(1);
		expect(cells).toHaveLength(25);
		expect(cells[0]).toEqual([-2, -2]);
		expect(cells[24]).toEqual([2, 2]);
		expect(cells).toContainEqual([0, 0]);
		expect(nyangGrassCells(5)).toHaveLength(81);
	});

	it('plays the sound once and spreads looping STR copies owned by the unit', () => {
		const field = nyangGrassEffects.ef_su_nyanggrass_field[0];
		expect(field.wav).toBe('effect/su_nyanggrass');
		const spam = vi.fn();
		field.func.call(
			{ spam },
			{ Init: { ownerAID: 77, skillLevel: 3 }, Inst: { position: [10, 20, 1], startTick: 5 } }
		);
		expect(spam).toHaveBeenCalledTimes(49);
		expect(spam).toHaveBeenCalledWith({
			effectId: 'ef_su_nyanggrass',
			ownerAID: 77,
			position: [7, 17, 7 + 17 / 10],
			startTick: 5,
			persistent: true
		});
		expect(nyangGrassEffects.ef_su_nyanggrass[0].wav).toBeUndefined();
	});

	it('stands each copy on its own cell height', () => {
		const spam = vi.fn();
		nyangGrassEffects.ef_su_nyanggrass_field[0].func.call(
			{ spam },
			{ Init: { ownerAID: 77, skillLevel: 1 }, Inst: { position: [10, 20, 0], startTick: 5 } }
		);
		const heights = spam.mock.calls.map(([p]) => p.position);
		expect(heights).toContainEqual([8, 18, 8 + 18 / 10]);
		expect(heights).toContainEqual([12, 22, 12 + 22 / 10]);
	});
});
