import { describe, expect, it } from 'vitest';
import EffectTable from 'DB/Effects/EffectTable.js';
import { CYCLE, SPAN, SightEmitter, orbitPoint, sightAt, shadowAt } from 'DB/Effects/SightEffect.js';

// Sight (effect 22), kRO 2025-07-16 (0xbd11b0, life 270, relaunched while the state is on): every even tick a sight
// sprite 20 units up and a shadow on the ground, 15 units out at -5 degrees a tick, each living 20 ticks.

describe('Sight', () => {
	it('spawns a sight sprite and a shadow every second tick as their ticks come', () => {
		let emitter;
		const spawned = [];
		const manager = { add: e => (emitter = e), spamEffect: p => spawned.push(p) };
		EffectTable[22][0].func.call(manager, { Init: {}, Inst: { startTick: 0 } });
		expect(emitter).toBeInstanceOf(SightEmitter);
		emitter.render(null, 0);
		expect(spawned).toHaveLength(2);
		expect(spawned[0].effect.spriteName).toBe('sight');
		expect(spawned[1].effect.shadowTexture).toBe(true);
		emitter.render(null, 10 * (1000 / 60));
		expect(spawned).toHaveLength(12);
		emitter.render(null, CYCLE * (1000 / 60));
		// the orbit starts over with the next cycle
		expect(spawned[spawned.length - 2].effect.track(0).y).toBeCloseTo(-3);
		expect(emitter.needCleanUp).toBeUndefined();
		emitter.render(null, SPAN * (1000 / 60));
		expect(spawned.length).toBeLessThan(SPAN);
		expect(emitter.needCleanUp).toBe(true);
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

	it('skips the pairs already over when it comes back on screen', () => {
		let emitter;
		const spawned = [];
		EffectTable[22][0].func.call(
			{ add: e => (emitter = e), spamEffect: p => spawned.push(p) },
			{ Init: {}, Inst: { startTick: 0 } }
		);
		emitter.render(null, 300 * (1000 / 60));
		// only the pairs of ticks 282-300 are still alive: 10 pairs
		expect(spawned).toHaveLength(20);
		emitter.render(null, 2 * SPAN * (1000 / 60));
		expect(spawned).toHaveLength(20);
		expect(emitter.needCleanUp).toBe(true);
	});
});
