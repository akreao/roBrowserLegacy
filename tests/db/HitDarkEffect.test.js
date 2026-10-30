import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { darkConeBand, darkSparkRow } from 'DB/Effects/HitDarkEffect.js';
import { DARK_SPARK, planDarkSparks, darkSparkAt, darkTrailLook } from 'Renderer/Effects/HitDarkSim.js';

// EF_HITDARK (180), the dark hit flash: kRO 2025-07-16 0xbb2460.

const fixed = v => () => v;

describe('Dark hit flash (180)', () => {
	it('is the hit flash of Curse Explosion and Espa', () => {
		expect(SkillEffect[SK.SP_CURSEEXPLOSION].hitEffectId).toBe(180);
		expect(SkillEffect[SK.SP_SPA].hitEffectId).toBe(180);
		expect(EffectTable[180][0].type).toBe('FUNC');
	});

	it('opens a ring_blue cone band the way the target faces for 10 ticks', () => {
		expect(darkConeBand).toMatchObject({
			prim: 'cone',
			texture: 'ring_blue',
			frames: 10,
			facing: true,
			pitch: -90,
			height: 10,
			baseRadius: 5,
			topRadius: 10,
			coneHeight: 3.5,
			drift: 0.7,
			fadeOutFrame: 5
		});
		expect(darkConeBand.driftAccel).toBeCloseTo(-0.035);
	});

	it('plans two sparks ahead and two thrown up behind', () => {
		const sparks = planDarkSparks(90, fixed(0));
		expect(sparks.map(s => s.kind)).toEqual([5, 5, 6, 6]);
		expect(sparks[0]).toMatchObject({ yaw: 50, pitch: -50, start: 4, life: 6, speed: 0.6, scale: 0.6 });
		expect(sparks[2]).toMatchObject({ yaw: 230, pitch: 0, start: 4, life: 6, speed: 0.6, throwUp: 0.3 });
		const top = planDarkSparks(0, fixed(0.999));
		expect(top[0]).toMatchObject({ yaw: 39, pitch: 49, start: 7, life: 29, scale: 1.59 });
		expect(top[0].speed).toBeCloseTo(1.49);
	});

	it('moves a level spark along its yaw, slowing to half speed', () => {
		const s = { kind: 5, yaw: 0, pitch: 0, start: 4, life: 10, speed: 1, throwUp: 0, scale: 1 };
		const p1 = darkSparkAt(s, 1);
		expect(p1.y).toBeCloseTo(4.95);
		expect(p1.x).toBeCloseTo(0);
		expect(p1.up).toBeCloseTo(10);
		const end = darkSparkAt(s, 10);
		expect(end.y).toBeCloseTo(4 + 10 - 0.05 * 55);
		expect(end.alpha).toBeCloseTo(0);
	});

	it('throws a behind spark up and lets it fall back to about its height', () => {
		const s = { kind: 6, yaw: 180, pitch: 0, start: 4, life: 10, speed: 0, throwUp: 1, scale: 1 };
		expect(darkSparkAt(s, 1).up).toBeCloseTo(10.8);
		expect(darkSparkAt(s, 5).up).toBeCloseTo(12);
		expect(darkSparkAt(s, 10).up).toBeCloseTo(9);
	});

	it('draws its trail fainter and smaller', () => {
		const s = { scale: 1.2 };
		expect(darkTrailLook(s, 254, 0)).toEqual({ alpha: 254, scale: 1.2 });
		const last = darkTrailLook(s, 254, DARK_SPARK.trail - 1);
		expect(last.alpha).toBeCloseTo(254 / 3);
		expect(last.scale).toBeCloseTo(0.8);
	});

	it('tints the spark sprite dark on the row, which the sprite layers read', () => {
		const row = darkSparkRow(planDarkSparks(0, fixed(0))[0], 0);
		for (const channel of [row.red, row.green, row.blue]) {
			expect(channel).toBeCloseTo(20 / 255);
		}
	});
});
