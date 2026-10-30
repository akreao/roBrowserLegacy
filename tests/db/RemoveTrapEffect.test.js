import { describe, expect, it } from 'vitest';
import { FOUNTAIN, planFountain, particleAt, fountainAlpha } from 'Renderer/Effects/RemoveTrapSim.js';
import { removeTrapEffect, fountainParticleEffect } from 'DB/Effects/RemoveTrapEffect.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Remove Trap (effect 100), kRO 2025-07-16 0xbcf7b0: hunter_removetrap.wav
// and two bursts (ticks 0 and 7) of 12 particle1 sprites thrown up and out.

const fixed = v => () => v;

describe('Remove Trap fountain', () => {
	it('throws 12 particles on tick 0 and 12 more on tick 7', () => {
		const plan = planFountain(fixed(0));
		expect(plan).toHaveLength(24);
		expect(plan.filter(p => p.spawn === 0)).toHaveLength(12);
		expect(plan.filter(p => p.spawn === 7)).toHaveLength(12);
		expect(plan[0].gravity).toBeCloseTo(0.08);
		expect(planFountain(fixed(0.999))[0].gravity).toBeCloseTo(0.089);
	});

	it('goes out 0.2 units a tick, up at 2 and falls back', () => {
		const p = { spawn: 0, heading: 0, gravity: 0.08 };
		const first = particleAt(p, 0);
		expect(first.y).toBeCloseTo(0.2);
		expect(first.up).toBeCloseTo(2 - 0.08);
		// highest about tick 24
		const peak = particleAt(p, 24).up;
		expect(peak).toBeGreaterThan(particleAt(p, 10).up);
		expect(peak).toBeGreaterThan(particleAt(p, 40).up);
		expect(particleAt(p, 49).y).toBeCloseTo(10);
		expect(particleAt(p, 50)).toBeNull();
	});

	it('stays opaque and fades out from tick 35', () => {
		expect(fountainAlpha(35)).toBe(254);
		expect(fountainAlpha(50)).toBeCloseTo(0);
		expect(fountainAlpha(42.5)).toBeCloseTo(127);
	});

	it('draws particle1 at 0.8 scale, at the trap', () => {
		const effect = fountainParticleEffect({ spawn: 0, heading: 0, gravity: 0.08 });
		expect(effect).toMatchObject({ type: '3D', spriteName: 'particle1', playSprite: true, attachedEntity: false });
		expect(effect.track(0).size).toBeCloseTo(FOUNTAIN.scale * 100);
		expect(EffectTable[100]).toBe(removeTrapEffect);
		expect(removeTrapEffect[1]).toEqual({ wav: 'effect/hunter_removetrap', attachedEntity: false });
	});
});
