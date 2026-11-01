import { describe, expect, it } from 'vitest';
import EffectTable from 'DB/Effects/EffectTable.js';
import { CYCLE, SPAN, orbitPoint, sightAt, shadowAt } from 'DB/Effects/SightEffect.js';

// Sight (effect 22), kRO 2025-07-16 (0xbd11b0, life 270, relaunched while the state is on): every even tick a sight
// sprite 20 units up and a shadow on the ground, 15 units out at -5 degrees a tick, each living 20 ticks.

describe('Sight', () => {
	it('spawns a sight sprite and a shadow every second tick for each cycle', () => {
		const spawned = [];
		EffectTable[22][0].func.call({ spamEffect: p => spawned.push(p) }, { Init: {}, Inst: { startTick: 0 } });
		expect(spawned).toHaveLength(SPAN);
		expect(spawned[0].effect.spriteName).toBe('sight');
		expect(spawned[1].effect.shadowTexture).toBe(true);
		expect(Math.round((spawned[2].Inst.startTick * 60) / 1000)).toBe(2);
		expect(Math.round((spawned[CYCLE].Inst.startTick * 60) / 1000)).toBe(CYCLE);
		// the orbit starts over with the next cycle
		expect(spawned[CYCLE].effect.track(0).y).toBeCloseTo(-3);
		expect(spawned.every(p => p.Inst.effectID === 22)).toBe(true);
		expect(EffectTable[22][1].wav).toBe('effect/ef_sight');
	});

	it('orbits 3 cells out, turning 5 degrees a tick the other way round', () => {
		expect(orbitPoint(0).x).toBeCloseTo(0);
		expect(orbitPoint(0).y).toBeCloseTo(-3);
		expect(orbitPoint(18).x).toBeCloseTo(-3);
		for (const age of [10, 40, 200]) {
			const p = orbitPoint(age);
			expect(Math.hypot(p.x, p.y)).toBeCloseTo(3);
		}
	});

	it('shrinks and fades each sprite over its 20 ticks', () => {
		expect(sightAt(0)).toEqual({ up: 20, scale: 2.5, alpha: 150 });
		expect(sightAt(10).alpha).toBe(120);
		expect(sightAt(10).scale).toBeCloseTo(1.5);
		expect(sightAt(20)).toBeNull();
		expect(shadowAt(10).alpha).toBe(110);
		expect(shadowAt(10).scale).toBeCloseTo(0.9);
	});
});
