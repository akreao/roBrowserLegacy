import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SoulBodyEffects from 'DB/Effects/SoulBodyEffects.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import StatusConst from 'DB/Status/StatusConst.js';
import {
	SCHEDULES,
	glowLayers,
	linkAlpha,
	hasReflect,
	reflectRipples,
	hatedCounter,
	READY_COLOR
} from 'Renderer/Effects/BodyMotionSim.js';

// Numbers from the official client (kRO 2025-07-16): effect-port/soul-linker-audit.md,
// effect-port/star-gladiator-audit.md. Player draw 0xd37790, effect cases 0xbc98b0 (419),
// 0xbc98df (424), 0xbc6bb0 (488), 0xbbe0e3 (542), 0xbbe1c4 (543), ripples 0xc41760.
describe('Soul Linker / Star Gladiator body looks', () => {
	it('fades the Soul Link glow in over 200 ticks and holds it', () => {
		expect(linkAlpha([SCHEDULES[424](0)])).toBe(0);
		expect(linkAlpha([SCHEDULES[424](120)])).toBe(120);
		expect(linkAlpha([SCHEDULES[424](5000)])).toBe(200);
	});

	it("takes Comfort's glow up to 200 and back down by its byte arithmetic", () => {
		expect(SCHEDULES[488](199)).toEqual({ link: 199 });
		expect(SCHEDULES[488](200)).toEqual({ link: 200 });
		expect(SCHEDULES[488](300)).toEqual({ link: 100 });
		expect(SCHEDULES[488](399)).toEqual({ link: 1 });
		expect(SCHEDULES[488](400)).toBeNull();
	});

	it('glows Kaupe blue for 150 ticks at a third of the age', () => {
		expect(SCHEDULES[542](30)).toEqual({ ready: 10 });
		expect(glowLayers([SCHEDULES[542](45)])).toEqual([{ color: READY_COLOR, alpha: 160 }]);
		expect(SCHEDULES[542](150)).toEqual({ ready: 50 });
		expect(SCHEDULES[542](151)).toBeNull();
	});

	it("climbs, holds and lowers Kaahi's counter", () => {
		expect([0, 10, 25, 26, 150, 151, 175, 176].map(hatedCounter)).toEqual([0, 10, 25, 25, 25, 24, 0, 0]);
		expect(glowLayers([SCHEDULES[543](100)])).toEqual([{ color: READY_COLOR, alpha: 130 }]);
		expect(SCHEDULES[543](200)).toBeNull();
	});

	it("grows Kaite's four ripples 0-20 px, 50 draws apart, fading as they grow", () => {
		expect(hasReflect([SCHEDULES[419](0)])).toBe(true);
		expect(hasReflect([{ ready: 1 }])).toBe(false);
		const at0 = reflectRipples(0);
		expect(at0.map(r => r.pad)).toEqual([5, 10, 15, 0]);
		expect(at0.map(r => r.alpha)).toEqual([75, 50, 25, 100]);
		expect(reflectRipples(200)).toEqual(at0);
		expect(reflectRipples(50).map(r => r.pad)).toEqual([10, 15, 0, 5]);
	});

	it('lives as long as the client table says and is spread into EffectTable', () => {
		for (const id of [419, 424, 488, 542, 543]) {
			expect(EffectTable[id]).toBe(SoulBodyEffects[id]);
		}
		expect(SoulBodyEffects[488][0].wav).toBe('effect/t_\xbe\xc8\xb6\xf4\xc7\xd1\xb8\xb6\xb9\xfd');
		expect(SoulBodyEffects[543].some(row => row.wav)).toBe(false);
	});

	it('removes Soul Link when the status ends and keeps Kaite and Warmth with their statuses', () => {
		for (const id of ['SOULLINK', 'SOULSHADOW', 'SOULFAIRY', 'SOULFALCON', 'SOULGOLEM']) {
			expect(StatusEffectTable[StatusConst[id]]).toEqual({ stop: [424] });
		}
		expect(StatusEffectTable[StatusConst.KAITE]).toEqual({ restart: [419], stop: [419] });
		for (const id of ['SG_SUN_WARM', 'SG_MOON_WARM', 'SG_STAR_WARM']) {
			expect(StatusEffectTable[StatusConst[id]]).toEqual({ restart: [544], stop: [544] });
		}
	});
});
