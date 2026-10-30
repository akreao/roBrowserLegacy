import { describe, expect, it, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import LightSphereEffect from 'DB/Effects/LightSphereEffect.js';
import {
	SPHERE_COLORS,
	CENTER_LIFE,
	createSphere,
	stepSphere,
	sphereAlive,
	rayCorners,
	centerAt
} from 'Renderer/Effects/LightSphereSim.js';

// Light of the Moon / Stars / Sun (SJ_LIGHTOFMOON 2574, SJ_LIGHTOFSTAR 2577, SJ_LIGHTOFSUN 2590): when the use
// packet has the result set, the official client's skilleffectinfo row plays t_피링.wav and launches the
// light sphere (1198 / 1199 / 1197, CLightSphereEffect: vfunc1 0xb05230, parts 0xb04d60, vfunc3 0xb05390,
// vfunc6 0xb05330) on the caster. kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Light of the Moon / Stars / Sun', () => {
	const fixed = value => () => value;

	it('plays the use sound and the sphere on the caster on success', () => {
		expect(SkillEffect[SK.SJ_LIGHTOFMOON]).toEqual({ successEffectIdOnCaster: ['ef_sj_lightof_sound', 1198] });
		expect(SkillEffect[SK.SJ_LIGHTOFSTAR]).toEqual({ successEffectIdOnCaster: ['ef_sj_lightof_sound', 1199] });
		expect(SkillEffect[SK.SJ_LIGHTOFSUN]).toEqual({ successEffectIdOnCaster: ['ef_sj_lightof_sound', 1197] });
		expect(EffectTable.ef_sj_lightof_sound).toEqual([{ wav: 'effect/t_\xc7\xc7\xb8\xb5', attachedEntity: true }]);
		for (const id of [1197, 1198, 1199]) {
			expect(EffectTable[id]).toBe(LightSphereEffect[id]);
			expect(EffectTable[id].filter(row => row.file === 'effect/thunder_center.bmp')).toHaveLength(4);
		}
	});

	it('tints the Sun red, the Moon yellow and the Stars blue', () => {
		expect(SPHERE_COLORS[1197].center).toEqual([255, 124, 128]);
		expect(SPHERE_COLORS[1198].center).toEqual([255, 255, 55]);
		expect(SPHERE_COLORS[1199].center).toEqual([59, 204, 255]);
	});

	it('fades the centre in 1 a tick until tick 300, then out', () => {
		expect(centerAt(0)).toEqual({ half: expect.closeTo(3.5 + 3.5 * Math.sin((2 * Math.PI) / 180) * 0.05), alpha: 2 });
		expect(centerAt(299).alpha).toBe(255);
		expect(centerAt(300).alpha).toBe(254);
		expect(centerAt(CENTER_LIFE - 1).alpha).toBe(0);
		expect(EffectTable[1197][0].track(CENTER_LIFE - 1)).toBeNull();
		expect(EffectTable[1197][0].track(0).z).toBe(2);
	});

	it('grows 640 rays 2% a tick up to 10 and fades them after tick 500', () => {
		const sphere = createSphere(1198, fixed(0));
		expect(sphere.rays).toHaveLength(640);
		expect(sphere.rays[0]).toMatchObject({ size: 1, alpha: 40, color: [255, 255, 155] });
		for (let i = 0; i < 120; i++) {
			stepSphere(sphere);
		}
		expect(sphere.rays[0].size).toBeGreaterThanOrEqual(10);
		expect(sphere.rays[0].size).toBeLessThan(10.3);
		expect(sphere.rays[0].q).toBe(120);
		while (sphere.ticks < 541) {
			stepSphere(sphere);
		}
		expect(sphere.rays.every(ray => ray.alpha === 0)).toBe(true);
		expect(sphereAlive(sphere)).toBe(true);
		while (sphere.ticks < CENTER_LIFE) {
			stepSphere(sphere);
		}
		expect(sphereAlive(sphere)).toBe(false);
	});

	it('runs each ray from a 1 unit base at the centre to a point on the sphere', () => {
		const ray = { group: 0, t: 90, s: 0, q: 90, size: 5, alpha: 40 };
		const [tip, tip2, a, b] = rayCorners(ray);
		expect(tip).toEqual(tip2);
		expect(tip[0]).toBeCloseTo(0);
		expect(tip[1]).toBeCloseTo(0);
		expect(a).toEqual([-0.5, -10, 0]);
		expect(b).toEqual([0.5, -10, 0]);
		expect(rayCorners({ ...ray, group: 1 })[2]).toEqual([0, -10, -0.5]);
	});
});
