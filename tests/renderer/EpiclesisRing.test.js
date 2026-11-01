import { describe, expect, it, vi } from 'vitest';
import {
	RING_EVERY,
	STRIP,
	LIFT,
	TINT,
	createEpiclesisRing,
	stepEpiclesisRing,
	ringRunning
} from 'Renderer/Effects/EpiclesisRingSim.js';
import { buildRing, RING_VERTICES } from 'Renderer/Effects/CastRingSim.js';
import CastRing from 'Renderer/Effects/CastRing.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Epiclesis's rings (1655), kRO 2025-07-16: 0xc0dd90(29) every 100 ticks, primitive 63 (update 0xb59170),
// drawn by the cast-aura ring render 0xb61550 (6.001-long strips get +2 on their tips; colour 29 = (177, 255, 58)).

vi.mock('Core/Client.js', () => ({ default: { loadFile() {} } }));

const run = (ring, n) => {
	for (let i = 0; i < n; i++) {
		stepEpiclesisRing(ring);
	}
};

describe('Epiclesis rings (1655)', () => {
	it('builds three flat bands, 25 degrees and 10 ticks apart', () => {
		const ring = createEpiclesisRing();
		expect(ring.bands.map(b => [b.start, b.lean, b.age, b.foot, b.alpha, b.lift])).toEqual([
			[0, 2, 0, 0, 0, LIFT],
			[25, 3, -10, 0, 0, LIFT],
			[50, 4, -20, 0, 0, LIFT]
		]);
		expect(TINT).toEqual([177, 255, 58]);
	});

	it('fades in by 24 to 120 as the strips rise, spreads 0.5 a tick and fades by 8 past 7', () => {
		const ring = createEpiclesisRing();
		run(ring, 1);
		const band = ring.bands[0];
		expect(band.alpha).toBe(24);
		expect(band.foot).toBe(0.5);
		expect(band.points[0]).toBeCloseTo(STRIP * Math.sin((9 * Math.PI) / 180));
		run(ring, 9);
		expect(band.alpha).toBe(120);
		expect(band.points[20]).toBeCloseTo(STRIP);
		run(ring, 4); // age 14, foot 7
		expect(band.alpha).toBe(120);
		run(ring, 1); // foot 7.5
		expect(band.alpha).toBe(112);
		expect(ring.bands[1].age).toBe(5);
	});

	it('starts a spent band again from the middle until the ring is 120 ticks old', () => {
		const ring = createEpiclesisRing();
		run(ring, 30); // band 0: fades out at age 30 (alpha 120 -> -8)
		expect(ring.bands[0].age).toBe(0);
		expect(ring.bands[0].foot).toBe(0);
		expect(ring.bands[0].alpha).toBe(24);
		run(ring, 200);
		expect(ringRunning(ring)).toBe(false);
	});

	it('lifts the strip tips by 2 units', () => {
		const ring = createEpiclesisRing();
		run(ring, 10);
		const out = new Float32Array(RING_VERTICES * 5);
		buildRing(out, ring, [0, 0, 0]);
		// band 0, first strip: foot vertex on the ground, tip vertex 6 sin(2) + 2 units up (GL y down, in cells)
		expect(out[1]).toBeCloseTo(0);
		expect(out[11]).toBeCloseTo(-(STRIP * Math.sin((2 * Math.PI) / 180) + LIFT) / 5);
	});

	it('the unit row lays a ring every 100 ticks for as long as it lives', () => {
		expect(RING_EVERY).toBe(100);
		const added = [];
		EffectTable[1655][0].func.call(
			{ add: e => added.push(e) },
			{ Inst: { position: [10, 10, 0], startTick: 0 }, Init: {} }
		);
		const rings = added[0];
		expect(rings).toBeInstanceOf(CastRing);
		const gl = {
			createBuffer: () => ({}),
			deleteBuffer() {},
			bindTexture() {},
			bindBuffer() {},
			bufferData() {},
			vertexAttribPointer() {},
			blendFunc() {},
			uniform4fv() {},
			drawArrays() {},
			TRIANGLES: 4
		};
		rings.init(gl);
		rings.render(gl, 1000 / 60);
		expect(rings.rings).toHaveLength(1);
		rings.render(gl, 101 * (1000 / 60));
		expect(rings.rings).toHaveLength(2);
		rings.render(gl, 1000 * (1000 / 60));
		expect(rings.needCleanUp).toBeFalsy();
		expect(rings.rings.length).toBeLessThanOrEqual(2);
	});
});
