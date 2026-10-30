import { describe, expect, it } from 'vitest';
import { DRAIN, TINT, planDrain, drainTrailLook, drainTint } from 'Renderer/Effects/EnergyDrainSim.js';
import { soulAt, SOUL } from 'Renderer/Effects/SoulStrikeSim.js';
import { energyDrainEffect, drainTrailEffect } from 'DB/Effects/EnergyDrainEffect.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Kaute's and Soul Explosion's drain (1207 / 1208), kRO 2025-07-16 0xbe73a0:
// three particle1 souls on each of ticks 0 to 4 burst out and come back over
// 60 ticks, then the actor is tinted blue on ticks 50 to 80.

const fixed = v => () => v;

describe('Energy drain souls', () => {
	it('are 3 a tick on ticks 0 to 4, bowing -90, 0 and 90 degrees', () => {
		const souls = planDrain(1208, fixed(0));
		expect(souls).toHaveLength(15);
		expect(souls.slice(0, 3).map(s => s.bow)).toEqual([-90, 0, 90]);
		expect(souls[14].spawn).toBe(4);
		expect(souls[0]).toMatchObject({ scale: 1, shade: 20 });
		const high = planDrain(1207, fixed(0.999))[0];
		expect(high.scale).toBeCloseTo(1.5);
		expect(high.shade).toBe(254);
	});

	it('burst out about 6 cells and come back to the actor in 60 ticks', () => {
		const soul = { bow: 90 };
		const mid = soulAt(soul, [1, 0], 0, 30, DRAIN);
		expect(Math.hypot(mid.x, mid.y)).toBeGreaterThan(25);
		const end = soulAt(soul, [1, 0], 0, DRAIN.life, DRAIN);
		expect(Math.hypot(end.x, end.y)).toBeLessThan(3);
		expect(end.up).toBeCloseTo(10);
	});

	it('leave Soul Strike flying as before', () => {
		expect(soulAt({ bow: 0 }, [1, 0], 100, SOUL.life).x).toBeCloseTo(103.5);
	});

	it('trail 7 steps, fading and shrinking to half', () => {
		expect(drainTrailLook(1.2, 0)).toEqual({ alpha: 254, scale: 1.2 });
		expect(drainTrailLook(1.4, 7).scale).toBeCloseTo(0.7);
	});

	it('draw pale or dark particle1 sprites', () => {
		const soul = planDrain(1208, fixed(0))[0];
		const head = drainTrailEffect(soul, 0);
		expect(head).toMatchObject({ type: '3D', spriteName: 'particle1', red: 20 / 255 });
		expect(head.track(0)).toMatchObject({ size: 100, alpha: 254 / 255 });
		expect(head.track(DRAIN.life)).toBeNull();
		expect(drainTrailEffect(soul, 2).track(1)).toBeNull();
	});
});

describe('Energy drain tint', () => {
	it('tints the actor blue on ticks 50 to 80, then lets it come back by 8 a tick', () => {
		expect(drainTint(49)).toEqual([1, 1, 1]);
		const [r, g, b] = drainTint(50);
		expect(r).toBeCloseTo(150 / 255);
		expect(g).toBeCloseTo(150 / 255);
		expect(b).toBeCloseTo(250 / 255);
		expect(drainTint(TINT.last)[0]).toBeCloseTo(90 / 255);
		expect(drainTint(TINT.last + 10)[0]).toBeCloseTo(170 / 255);
		expect(drainTint(TINT.last + 21)).toEqual([1, 1, 1]);
	});
});

describe('Energy drain effects', () => {
	it('are 1207 and 1208', () => {
		expect(EffectTable[1207][0]).toMatchObject({ type: 'FUNC', attachedEntity: false });
		expect(EffectTable[1208][0]).toMatchObject({ type: 'FUNC', attachedEntity: false });
	});

	it('spawn 7 sprites a soul and tint their actor', () => {
		const spammed = [];
		const added = [];
		const entity = {
			_flashColor: [1, 1, 1, 1],
			animations: { add: f => added.push(f) },
			recalculateBlendingColor() {}
		};
		energyDrainEffect(1207)[0].func.call(
			{ spamEffect: p => spammed.push(p) },
			{ Inst: { position: [0, 0, 0], startTick: 0 }, Init: { ownerEntity: entity } }
		);
		expect(spammed).toHaveLength(15 * DRAIN.trail);
		expect(added).toHaveLength(1);
		const PRIM = 1000 / 60;
		expect(added[0](60 * PRIM)).toBe(false);
		expect(entity._flashColor[2]).toBeCloseTo(250 / 255);
		expect(added[0](120 * PRIM)).toBe(true);
	});
});
