import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { SCHEDULES } from 'Renderer/Effects/BodyMotionSim.js';

// Prominence Kick (SJ_PROMINENCEKICK 2593): when the damage arrives, the official client plays 1224 (and
// 429, EF_HITLINE4, HitLineEffect.js) on the target. 1224 (kRO 2025-07-16 case 0xbc0798) plays mon_침투경.wav
// on its tick 5 and, from tick 14 until its 50 ticks are up, spins the target's sprite one full turn.

describe('Prominence Kick', () => {
	it('plays 1224 and 429 on the target as the damage arrives', () => {
		expect(SkillEffect[SK.SJ_PROMINENCEKICK]).toMatchObject({ damageEffectIdOnTarget: [1224, 429] });
	});

	it('plays mon_침투경 on tick 5 and spins the target', () => {
		const rows = EffectTable[1224];
		expect(rows[0]).toMatchObject({ wav: 'effect/mon_\xc4\xa7\xc5\xf5\xb0\xe6', attachedEntity: true });
		expect(rows[0].delayWav).toBe(Math.round(5 * (1000 / 60)));
		expect(rows[1]).toMatchObject({ type: 'FUNC', attachedEntity: true });
	});

	it('spins from tick 14 to 49, as Roundhouse does', () => {
		expect(SCHEDULES[1224](13)).toBeNull();
		expect(SCHEDULES[1224](14)).toEqual({ spin: 0 });
		expect(SCHEDULES[1224](49)).toEqual({ spin: 35 });
		expect(SCHEDULES[1224](50)).toBeNull();
		for (let age = 0; age < 60; age++) {
			expect(SCHEDULES[1224](age)).toEqual(SCHEDULES[466](age));
		}
	});
});
