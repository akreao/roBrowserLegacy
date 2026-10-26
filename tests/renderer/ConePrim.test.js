import { describe, expect, it } from 'vitest';

const { createPrimState, advancePrim, buildPrimGeometry, primVertexCount, applyFacing, facingAngle, coneToWorld } =
	await import('Renderer/Effects/EffectPrimSim.js');

// Official primitive 13 (cone band), as the Pierce / Spear Stab hit 81 uses it.
const hit81 = {
	prim: 'cone',
	frames: 15,
	facing: true,
	pitch: -90,
	height: 10,
	baseRadius: 6,
	topRadius: 11,
	coneHeight: 2.5,
	drift: 0.7,
	driftAccel: -(0.7 / 15) * 0.5,
	fadeOutFrame: 8
};

// Vertex i of a built buffer, in roBrowser GL space
const vtx = (buf, i) => Array.from(buf.slice(i * 5, i * 5 + 5));

describe('cone band primitive (official type 13)', () => {
	it('measures facing like the client: 0 south, 90 east, 180 north, 270 west', () => {
		expect(facingAngle(0)).toBeCloseTo(0, 5);
		expect(facingAngle(6)).toBeCloseTo(90, 5);
		expect(facingAngle(4)).toBeCloseTo(180, 5);
		expect(facingAngle(2)).toBeCloseTo(270, 5);
		expect(facingAngle(5)).toBeCloseTo(135, 5);
	});

	it('keeps an upright cone opening upward and a level one opening along its yaw', () => {
		const up = coneToWorld(0, -1, 0, 0, 0);
		expect(up[0]).toBeCloseTo(0, 6);
		expect(up[1]).toBeCloseTo(-1, 6);
		expect(up[2]).toBeCloseTo(0, 6);

		const level = coneToWorld(0, -1, 0, -Math.PI / 2, Math.PI / 2);
		expect(level[0]).toBeCloseTo(1, 6);
		expect(level[1]).toBeCloseTo(0, 6);
		expect(level[2]).toBeCloseTo(0, 6);
	});

	it('opens the band the way its owner faces', () => {
		const DX = [0, -1, -1, -1, 0, 1, 1, 1];
		const DY = [-1, -1, 0, 1, 1, 1, 0, -1];
		const center = [10, 20, 0];

		for (let dir = 0; dir < 8; dir++) {
			const state = createPrimState(hit81);
			applyFacing(state, hit81, dir);
			const buf = new Float32Array(primVertexCount(hit81) * 5);
			buildPrimGeometry(buf, hit81, state, center);

			// Average of the base circle and of the top circle (vertices 0 and 2 of each segment)
			const mid = (k) => {
				let x = 0,
					z = 0;
				for (let s = 0; s < 10; s++) {
					const v = vtx(buf, s * 6 + k);
					x += v[0] / 10;
					z += v[2] / 10;
				}
				return [x, z];
			};
			const base = mid(0);
			const top = mid(2);
			const len = Math.hypot(DX[dir], DY[dir]);

			// 2.5 units = 0.5 cell from the base centre toward the facing
			expect((top[0] - base[0]) / 0.5).toBeCloseTo(DX[dir] / len, 4);
			expect((top[1] - base[1]) / 0.5).toBeCloseTo(DY[dir] / len, 4);
		}
	});

	it('draws ten segments, base circle V = 1 and top V = 0, 10 units up', () => {
		const state = createPrimState(hit81);
		applyFacing(state, hit81, 0);
		expect(primVertexCount(hit81)).toBe(60);
		const buf = new Float32Array(60 * 5);
		buildPrimGeometry(buf, hit81, state, [0, 0, 0]);

		const base = vtx(buf, 0);
		const top = vtx(buf, 2);
		expect(base[4]).toBe(1);
		expect(top[4]).toBe(0);

		// Level band: all its centre sits 2 cells (10 units) up; GL y is minus height
		let y = 0;
		for (let i = 0; i < 60; i++) y += vtx(buf, i)[1] / 60;
		expect(y).toBeCloseTo(-2, 4);

		// Radii 6 and 11 units around the axis
		const r = v => Math.hypot(v[1] + 2, v[0] - 0.5);
		expect(r(base)).toBeCloseTo(6 / 5, 4);
		expect(r(top)).toBeCloseTo(11 / 5, 4);

		// U steps 0.25 and wraps every four segments
		expect([0, 1, 2, 3, 4].map(s => vtx(buf, s * 6)[3])).toEqual([0, 0.25, 0.5, 0.75, 0]);
	});

	it('drifts forward 0.7 a tick, slowing to 0.35, and fades out from tick 8', () => {
		const state = createPrimState(hit81);
		advancePrim(state, 1);
		expect(state.drift).toBeCloseTo(0.7 - 0.7 / 30, 6);
		expect(state.driftOffset).toBeCloseTo(0.7 - 0.7 / 30, 6);

		advancePrim(state, 8);
		expect(state.alpha).toBe(254);
		advancePrim(state, 9);
		expect(state.alpha).toBeCloseTo(254 - 254 / 7, 4);

		advancePrim(state, 15);
		expect(state.alpha).toBeCloseTo(0, 4);
		expect(state.drift).toBeCloseTo(0.35, 6);
	});

	it('grows its circles and caps the height at 100', () => {
		const grow = {
			prim: 'cone',
			frames: 20,
			baseRadius: 3,
			baseSpeed: 0.5,
			baseAccel: -0.03,
			topRadius: 8,
			topSpeed: 0.5,
			topAccel: -0.03,
			coneHeight: 99,
			coneHeightSpeed: 0.5
		};
		const state = createPrimState(grow);
		advancePrim(state, 2);
		expect(state.baseRadius).toBeCloseTo(3 + 0.47 + 0.44, 6);
		expect(state.topRadius).toBeCloseTo(8 + 0.47 + 0.44, 6);
		advancePrim(state, 5);
		expect(state.coneHeight).toBe(100);
	});

	it('switches a ring to its second growth on the change tick', () => {
		const ring = {
			prim: 'ring',
			frames: 50,
			radius: 8,
			radiusSpeed: 0.7,
			radiusAccel: -0.7 / 30,
			radiusChangeFrame: 20,
			radiusChangeSpeed: 0.08,
			radiusChangeAccel: 0
		};
		const state = createPrimState(ring);
		advancePrim(state, 20);
		const at20 = state.radius;
		advancePrim(state, 22);
		expect(state.radius - at20).toBeCloseTo(0.16, 6);
		expect(state.radiusSpeed).toBeCloseTo(0.08, 6);
	});
});
