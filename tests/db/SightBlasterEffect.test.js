import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SightBlasterEffect from 'DB/Effects/SightBlasterEffect.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import StatusConst from 'DB/Status/StatusConst.js';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import { SIGHT_SLOTS, sightSpriteAt, tableDegree } from 'Renderer/Effects/SightBlasterSim.js';

// Numbers from the official client (kRO 2025-07-16): CRagEffect case for 601 at 0xbbdeb6,
// prim type 5 update 0xb4f2b0, prim alpha update 0xb5e180, EFST 198 case 0xc4f7b0.
describe('Sight Blaster ring (effect 601)', () => {
	const alive = age =>
		Array.from({ length: SIGHT_SLOTS }, (_, s) => sightSpriteAt(s, age)).filter(Boolean);

	it('leaves a sprite every 2 ticks, 15 units out and 20 up, ten alive at once', () => {
		expect(SIGHT_SLOTS).toBe(36);
		expect(alive(0)).toHaveLength(1);
		expect(alive(19)).toHaveLength(10);
		expect(alive(500)).toHaveLength(10);
		for (const p of alive(300)) {
			expect(Math.hypot(p.x, p.y)).toBeCloseTo(15 / 5);
			expect(p.z).toBe(4);
		}
	});

	it('places the sprite of tick 0 straight south, the client z axis at -15', () => {
		const p = sightSpriteAt(0, 0);
		expect(p.x).toBeCloseTo(0);
		expect(p.y).toBeCloseTo(-3);
	});

	it('reads the client sin/cos tables one degree on for a negative angle', () => {
		expect(tableDegree(-5)).toBe(356);
		expect(tableDegree(-360)).toBe(1);
		expect(tableDegree(-365)).toBe(356);
		expect(tableDegree(-720)).toBe(0);
		expect(tableDegree(90)).toBe(90);
	});

	it('shrinks by 0.1 and fades by 3 a tick, living 20 ticks', () => {
		expect(sightSpriteAt(0, 0)).toMatchObject({ scale: 2.4, alpha: 47, frame: 0 });
		const last = sightSpriteAt(0, 19);
		expect(last.scale).toBeCloseTo(0.5);
		expect(last.alpha).toBe(0);
		expect(last.frame).toBe(6);
		expect(sightSpriteAt(0, 20)).toBeNull();
		expect(sightSpriteAt(0, 72)).toMatchObject({ scale: 2.4 });
		expect(sightSpriteAt(5, 9)).toBeNull();
	});

	it('is held by the status, not by the skill', () => {
		expect(EffectTable[601]).toBe(SightBlasterEffect[601]);
		expect(EffectTable[601]).toHaveLength(36);
		expect(EffectTable[601][0].spriteName).toBe('sight');
		expect(StatusEffectTable[StatusConst.WZ_SIGHTBLASTER]).toEqual({ restart: [601], stop: [601] });
		expect(SkillEffect[SK.WZ_SIGHTBLASTER].effectId).toBeUndefined();
	});

	it('draws nothing from a slot before its first sprite', () => {
		const row = EffectTable[601][3];
		expect(row.track(5)).toBeNull();
		expect(row.track(6)).toMatchObject({ size: 240, frame: 0 });
	});
});
