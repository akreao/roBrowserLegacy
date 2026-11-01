import { describe, expect, it } from 'vitest';
import { createVariantStreak, createVariantSets, stepStreak, tintColor } from 'Renderer/Effects/StreakLinesSim.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// The kRO 2025-07-16 streak builder 0xbdf6e0 (prim 56): Piercing Shot's 623 uses variants 20 / 21 (green),
// Hundred Spear's 835 variants 10 / 11 (yellow); both four times, line3y.tga.

const low = () => 0;

describe('streak builder variants', () => {
	it('puts variant x0 on one side and x1 on the other', () => {
		expect(createVariantStreak(20, low).offset).toBe(-15);
		expect(createVariantStreak(21, low).offset).toBe(15);
	});

	it('sizes, tints and textures by the variant range', () => {
		expect(createVariantStreak(5, low)).toMatchObject({ halfWidth: 0.3, length: 20, tint: 0, speed: 1.5, texture: 'line3' });
		expect(createVariantStreak(10, low)).toMatchObject({ halfWidth: 0.5, length: 40, tint: 10, speed: 1, texture: 'line3y' });
		expect(createVariantStreak(20, low)).toMatchObject({ halfWidth: 0.4, length: 30, tint: 20, speed: 1.5, texture: 'line3y' });
		expect(createVariantSets([20, 21, 20, 21, 20, 21, 20, 21])).toHaveLength(32);
	});

	it('colours the tints blue, yellow and green', () => {
		expect(tintColor(0)).toEqual([225, 225, 255]);
		expect(tintColor(11)).toEqual([255, 255, 205]);
		expect(tintColor(22)).toEqual([185, 255, 185]);
		expect(tintColor(126)).toEqual([215, 215, 215]);
	});

	it('moves tints below 10 the slow way', () => {
		const slow = createVariantStreak(0, low);
		stepStreak(slow);
		expect(slow.alpha).toBe(12);
		expect(slow.speed).toBe(1.5);
		const fast = createVariantStreak(20, low);
		stepStreak(fast);
		expect(fast.alpha).toBe(20);
		expect(fast.speed).toBeCloseTo(1.55);
	});

	it("draws Piercing Shot's streaks along the shot", () => {
		const added = [];
		EffectTable[623][1].func.call(
			{ add: e => added.push(e) },
			{ Init: { ownerEntity: { position: [0, 0, 0] }, otherEntity: { position: [5, 0, 0] } }, Inst: { startTick: 0 } }
		);
		expect(added).toHaveLength(1);
		expect(added[0].streaks).toHaveLength(32);
		expect(added[0].streaks.every(s => s.tint >= 20)).toBe(true);
	});
});
