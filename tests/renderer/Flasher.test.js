import { describe, expect, it, vi } from 'vitest';
import { FLASH, RAY, flashAlphas, createRay, stepRay, rayTriangle } from 'Renderer/Effects/FlasherSim.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Flasher's flash (effect 99), kRO 2025-07-16 0xbad270: a thunder_center.bmp
// square facing the camera and 20 alpha_center.tga rays, 70 ticks.

vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload, onerror) {
			onerror();
		}
	}
}));

const fixed = v => () => v;

describe('Flasher square', () => {
	it('fades in to 200, dips to 120 on tick 40, and fades out over the last 10 ticks', () => {
		const a = flashAlphas();
		expect(a).toHaveLength(FLASH.life);
		expect(a[0]).toBeCloseTo(33.33);
		expect(a[5]).toBe(200);
		expect(a[40]).toBeCloseTo(153.33);
		expect(a[43]).toBe(200);
		expect(a[60]).toBe(180);
		expect(a[69]).toBeCloseTo(0);
	});
});

describe('Flasher rays', () => {
	it('start from the client ranges', () => {
		const low = createRay(fixed(0));
		expect(low).toMatchObject({ angle: 0, spin: 1, half: 0.5, length: 20, grow: 5 });
		const high = createRay(fixed(0.999));
		expect(high).toMatchObject({ angle: 359, half: 2.9, length: 59 });
		expect(high.spin).toBeCloseTo(6.9);
		expect(high.grow).toBeCloseTo(7.9);
	});

	it('turn ever slower, grow, and fade in by 20 a tick and out from tick 47', () => {
		const ray = createRay(fixed(0));
		const alphas = [];
		for (let i = 0; i < RAY.life; i++) {
			stepRay(ray);
			alphas.push(ray.alpha);
		}
		expect(alphas.slice(0, 3)).toEqual([20, 40, 60]);
		expect(alphas[46]).toBe(200);
		expect(alphas[69]).toBeCloseTo(0);
		expect(ray.length).toBe(20 + 5 * 70);
		// spun 70 ticks, slowing by a third
		expect(ray.angle).toBeCloseTo(70 - (1 / 70 / 1.5) * ((70 * 71) / 2));
	});

	it('are triangles from their point, angle 0 pointing up', () => {
		const ray = createRay(fixed(0));
		const [p, a, b] = rayTriangle(ray);
		expect(p).toEqual([0, 0]);
		expect(a[1]).toBeLessThan(0);
		expect(a[0]).toBeLessThan(0);
		expect(b[0]).toBeGreaterThan(0);
		expect(Math.hypot(a[0], a[1])).toBeCloseTo(20);
	});
});

describe('Flasher effect', () => {
	it('draws the flash at the trap and plays hunter_flasher', () => {
		const rows = EffectTable[99];
		expect(rows[0]).toMatchObject({ type: 'FUNC', attachedEntity: false });
		// a duration, so the manager can drop it while it is out of view
		expect(rows[0].duration).toBeGreaterThanOrEqual(70 * (1000 / 60));
		expect(rows[1]).toEqual({ wav: 'effect/hunter_flasher', attachedEntity: false });
	});

	it('is cleaned up after 70 ticks, also when its textures cannot load', async () => {
		const { default: Flasher } = await import('Renderer/Effects/Flasher.js');
		const { PRIM_TICK_MS } = await import('Renderer/Effects/EffectPrimSim.js');
		const flash = new Flasher([0, 0, 0], 0, fixed(0));
		flash.init({});
		expect(flash.ready).toBe(true);
		flash.render({}, 10 * PRIM_TICK_MS);
		expect(flash.needCleanUp).toBeFalsy();
		flash.render({}, 71 * PRIM_TICK_MS);
		expect(flash.needCleanUp).toBe(true);
	});
});
