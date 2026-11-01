import { describe, expect, it } from 'vitest';
import EffectTable from 'DB/Effects/EffectTable.js';
import { planChaosStreaks, streakHeight } from 'DB/Effects/AgilityEffect.js';

// Eternal Chaos / Loki's Veil (864), kRO 2025-07-16: besides the purple flicker, every even tick one ac_center2 streak
// rises from 5 units up (bluish) and one falls from 20 up (each channel 255 or 140), 3-9 units round the actor.

describe('864 streaks', () => {
	it('plans a rising and a falling streak every second tick', () => {
		const streaks = planChaosStreaks();
		expect(streaks).toHaveLength(100);
		expect(streaks.filter(s => s.rising)).toHaveLength(50);
		expect(streaks[2].spawn).toBe(2);
		for (const s of streaks) {
			const d = Math.hypot(s.x, s.y);
			expect(d).toBeGreaterThanOrEqual(3 - 1e-9);
			expect(d).toBeLessThanOrEqual(9 + 1e-9);
			if (s.rising) {
				expect(s.color[2]).toBe(255);
				expect(s.color[0]).toBe(s.color[1]);
			} else {
				s.color.forEach(c => expect([140, 255]).toContain(c));
			}
		}
	});

	it('rises from 5 up, faster each tick, and falls from 20 up', () => {
		const [up, down] = planChaosStreaks(() => 0);
		expect(streakHeight(up, 0)).toBe(5);
		expect(streakHeight(up, 10)).toBeCloseTo(5 + 0.015 * 55);
		expect(streakHeight(down, 10)).toBeCloseTo(20 - 0.015 * 55);
	});

	it('spawns them with the flicker', () => {
		const spawned = [];
		const added = [];
		EffectTable[864][0].func.call(
			{ add: e => added.push(e), spamEffect: p => spawned.push(p) },
			{ Init: { ownerEntity: { position: [0, 0, 0] } }, Inst: { startTick: 0 } }
		);
		expect(added).toHaveLength(1);
		expect(spawned).toHaveLength(100);
		expect(spawned[0].effect.track(5).color).toHaveLength(3);
	});
});
