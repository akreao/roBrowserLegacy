import { describe, expect, it } from 'vitest';
import {
	GRAVITATION,
	GRAVITATION_SPIKES,
	GRAVITATION_TEXTURES,
	planGravitation,
	gravitationAt
} from 'Renderer/Effects/GravitationFieldSim.js';
import { SPIKE_VERTICES, buildSpike } from 'Renderer/Effects/IceSpikesSim.js';

// Gravitation Field's effect 522 (official primitive 117, drawn as primitive 9).
// Spec: effect-port/gravitation-field.md.

const fixed = value => () => value;

describe('GravitationFieldSim', () => {
	it('puts two stone and two ice spikes on each point of a 5 x 5 grid, a cell apart', () => {
		const spikes = planGravitation(fixed(0));
		expect(spikes).toHaveLength(100);
		expect(GRAVITATION_SPIKES).toBe(100);
		expect(GRAVITATION_TEXTURES).toEqual(['stone.bmp', 'ice.tga']);
		expect([...new Set(spikes.map(s => s.x))]).toEqual([-10, -5, 0, 5, 10]);
		expect([...new Set(spikes.map(s => s.y))]).toEqual([-10, -5, 0, 5, 10]);
		expect(spikes.slice(0, 4).map(s => s.kind)).toEqual([0, 0, 1, 1]);
		expect(spikes.filter(s => s.kind === 0)).toHaveLength(50);
	});

	it('draws spikes 3.00-3.49 wide, 18 long, leaning 60-99 degrees up', () => {
		const low = planGravitation(fixed(0))[0];
		expect(low).toMatchObject({ size: 3, height: 18, yaw: 0, pitch: 60 });
		const high = planGravitation(fixed(0.999999))[0];
		expect(high).toMatchObject({ size: 3.49, height: 18, yaw: 359, pitch: 99 });
	});

	it('pushes out, then shudders back and forth every 6 ticks', () => {
		const rise = age => gravitationAt(age, 120).rise;
		expect(rise(0)).toBeCloseTo(1.01);
		expect(rise(1)).toBeCloseTo(2.03);
		expect(rise(4)).toBeCloseTo(2.03 - 3.6);
		expect(rise(7)).toBeCloseTo(2.03);
		expect(rise(10)).toBeCloseTo(2.03 - 3.6);
		expect(rise(13)).toBeCloseTo(2.03);
	});

	it('fades from alpha 20 over the effect, and is gone at its end', () => {
		expect(gravitationAt(0, 120).alpha).toBe(20);
		expect(gravitationAt(60, 120).alpha).toBe(10);
		expect(gravitationAt(119, 120).alpha).toBeCloseTo(20 / 120);
		expect(gravitationAt(120, 120)).toBeNull();
		expect(gravitationAt(140, GRAVITATION.unitLength).alpha).toBeCloseTo(20 / 141);
		expect(gravitationAt(-1, 120)).toBeNull();
	});

	it('starts the base 10 units under the ground, a fifth of U a face', () => {
		const spike = { x: 0, y: 0, size: 3, height: 18, yaw: 0, pitch: 90 };
		const out = new Float32Array(SPIKE_VERTICES * 5);
		buildSpike(out, 0, spike, 0, [0, 0, 0], GRAVITATION);
		// first base corner, 10 under (roBrowser up is -y, 5 units a cell)
		expect(out[1]).toBeCloseTo(2);
		// tip: 18 - 10 = 8 units up
		expect(out[5 + 1]).toBeCloseTo(-8 / 5);
		expect(out[2 * 5 + 3]).toBeCloseTo(0.2);
		expect(out[11 * 5 + 3]).toBeCloseTo(0.8);
	});
});
