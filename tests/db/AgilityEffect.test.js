import { describe, expect, it } from 'vitest';
import EffectTable from 'DB/Effects/EffectTable.js';
import {
	STREAK,
	planStreaks,
	streakAlpha,
	streakHeight,
	billboardRise,
	billboardAlpha
} from 'DB/Effects/AgilityEffect.js';

// Increase AGI (37) and Decrease AGI (38), kRO 2025-07-16 (0xbb3c60 / 0xba7680). Spec: effect-port/agility-streaks.md.

let seed = 5;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('Increase / Decrease AGI', () => {
	it('plays the sound, the picture and 50 streaks one every second tick', () => {
		expect(EffectTable[37][0].wav).toBe('effect/ef_incagility');
		expect(EffectTable[38][0].wav).toBe('effect/ef_decagility');
		const spawned = [];
		EffectTable[37][1].func.call(
			{ spamEffect: p => spawned.push(p) },
			{ Init: { ownerEntity: { position: [0, 0, 0] } }, Inst: { startTick: 0 } }
		);
		expect(spawned).toHaveLength(51);
		expect(spawned[0].effect.file).toBe('effect/agi_up.bmp');
		expect(spawned[1].effect.file).toBe('effect/ac_center2.tga');
		expect(spawned.every(p => p.effect.sharedTexture)).toBe(true);
		expect(Math.round((spawned[50].Inst.startTick * 60) / 1000)).toBe(98);
	});

	it('scatters the streaks 2 to 8 units round the owner, half length 3 to 8.9', () => {
		for (const s of planStreaks(true, random)) {
			const d = Math.hypot(s.x, s.y);
			expect(d).toBeGreaterThanOrEqual(2 - 1e-9);
			expect(d).toBeLessThanOrEqual(8 + 1e-9);
			expect(s.halfLength).toBeGreaterThanOrEqual(3);
			expect(s.halfLength).toBeLessThanOrEqual(8.9);
			expect(s.speed).toBeGreaterThanOrEqual(0.2);
			expect(s.speed).toBeLessThanOrEqual(0.69);
		}
	});

	it('rises from the ground (37) or falls from 20 up (38)', () => {
		expect(streakHeight({ rising: true, speed: 0.5 }, 10)).toBe(5);
		expect(streakHeight({ rising: false }, 0)).toBe(20);
		expect(streakHeight({ rising: false }, 10)).toBeCloseTo(20 - 0.015 * 55);
	});

	it('fades streaks in by 10 to 200 and out over their last 20 ticks', () => {
		expect([0, 5, 20, 29, 30, 40, 50].map(a => streakAlpha(a))).toEqual([0, 50, 200, 200, 200, 100, 0]);
		expect(STREAK.life).toBe(50);
	});

	it('moves the picture up (37) or down from 80 px (38), slowing', () => {
		expect(billboardRise(37, 0)).toBe(0);
		expect(billboardRise(37, 1)).toBeCloseTo(1.5 - 0.018);
		expect(billboardRise(38, 0)).toBe(80);
		expect(billboardRise(38, 1)).toBeCloseTo(80 - 1 + 0.01);
		expect(billboardRise(38, 100)).toBeLessThan(80);
		expect([0, 15, 85, 100].map(billboardAlpha)).toEqual([0, 200, 200, 0]);
	});
});
