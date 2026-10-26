import { describe, expect, it, vi } from 'vitest';

// Nyang Grass's field as the official client draws it (effect 1125). Spec: effect-port/summoner-skills.md.

import { nyangGrassCells, nyangGrassSize, nyangGrassEffects } from 'DB/Effects/NyangGrassEffect.js';

describe('Nyang Grass field', () => {
	it('is 5, 7 or 9 cells across by level', () => {
		expect([1, 2, 3, 4, 5].map(nyangGrassSize)).toEqual([5, 5, 7, 7, 9]);
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
			position: [7, 17, 1],
			startTick: 5,
			persistent: true
		});
		expect(nyangGrassEffects.ef_su_nyanggrass[0].wav).toBeUndefined();
	});
});
