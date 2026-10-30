import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import StarEmperorStatusEffects, { SOUL_UNITY } from 'DB/Effects/StarEmperorStatusEffects.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import StatusConst from 'DB/Status/StatusConst.js';
import { stancePartAt, STANCE_TEXTURES } from 'Renderer/Effects/SunStanceSim.js';
import { SCHEDULES, liftOf } from 'Renderer/Effects/BodyMotionSim.js';

// Numbers from the official client (kRO 2025-07-16): CSunStanceEffect 0x6f5cc0 / 0x6f5e50,
// CGravityControlEffect 0x6e2ff0 / 0x6e3100, CSoulUnityEffect 0x6f35e0 / 0x6f3700.
// Spec: effect-port/star-emperor-soul-reaper-audit.md.
describe('Star Emperor / Soul Reaper status looks', () => {
	it('puts three stance pictures 8 units out, 10 up, 120 degrees apart', () => {
		const parts = [0, 1, 2].map(i => stancePartAt(i, 0));
		for (const p of parts) {
			expect(Math.hypot(p.x, p.y)).toBeCloseTo(8 / 5);
			expect(p.z).toBe(2);
			expect(p.size).toBe(42);
		}
		const a = parts.map(p => Math.atan2(p.y, p.x));
		expect(Math.abs(Math.cos(a[1] - a[0]) - Math.cos((2 * Math.PI) / 3))).toBeLessThan(1e-9);
	});

	it('turns the stance pictures 0.02 radians a tick', () => {
		const a = age => {
			const p = stancePartAt(0, age);
			return Math.atan2(p.y, p.x);
		};
		expect(a(0)).toBeCloseTo(0.02);
		expect(a(10)).toBeCloseTo(0.22);
	});

	it('shows sun, lunar and star for Universal Stance and one picture for the others', () => {
		expect(STANCE_TEXTURES[1217]).toEqual(['sun_stance', 'lunar_stance', 'star_stance']);
		expect(EffectTable[1215].map(r => r.file)).toEqual(Array(3).fill('effect/sun_stance/lunar_stance.tga'));
		expect(EffectTable[1214]).toBe(StarEmperorStatusEffects[1214]);
	});

	it('lifts a Gravity Control target 0.5 units a tick up to 20 and loops the STR', () => {
		expect(liftOf([SCHEDULES[1201](0)])).toBe(0.5);
		expect(liftOf([SCHEDULES[1201](19)])).toBe(10);
		expect(liftOf([SCHEDULES[1201](500)])).toBe(20);
		expect(liftOf([{ ready: 5 }])).toBe(0);
		expect(EffectTable[1201][0]).toMatchObject({ type: 'STR', file: 'wl_telekinesis_intense', repeat: true });
	});

	it('draws Soul Unity 5 units across, 15 units up', () => {
		expect(SOUL_UNITY).toEqual({ half: 2.5, height: 15 });
		expect(EffectTable[1222][0].track(0)).toEqual({ x: 0, y: 0, z: 3, size: 35 });
	});

	it('holds each look while its status is on', () => {
		expect(StatusEffectTable[StatusConst.SUNSTANCE]).toEqual({ loop: [1214] });
		expect(StatusEffectTable[StatusConst.LUNARSTANCE]).toEqual({ loop: [1215] });
		expect(StatusEffectTable[StatusConst.STARSTANCE]).toEqual({ loop: [1216] });
		expect(StatusEffectTable[StatusConst.UNIVERSESTANCE]).toEqual({ loop: [1217] });
		expect(StatusEffectTable[StatusConst.GRAVITYCONTROL]).toEqual({ loop: [1201] });
		expect(StatusEffectTable[StatusConst.SOULUNITY]).toEqual({ loop: [1222] });
	});
});
