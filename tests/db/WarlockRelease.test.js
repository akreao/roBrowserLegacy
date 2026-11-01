import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { releaseBalls } from 'DB/Effects/ReleaseEffect.js';

// Release (WL_RELEASE 2230), kRO 2025-07-16: on success 751 EF_FIREBALL2 on the caster aimed at the target: Fire
// Ball's fireballs in three tinted sets of four (ticks 0-3, 6-9, 12-15), and EF_FireBall.wav on tick 5.

describe('Release', () => {
	it('plays 751 on the caster on success', () => {
		expect(SkillEffect[SK.WL_RELEASE]).toEqual({ successEffectIdOnCaster: 751 });
	});

	it('throws three tinted sets of four fireballs at the target', () => {
		const balls = releaseBalls();
		expect(balls.map(b => b.tick)).toEqual([0, 1, 2, 3, 6, 7, 8, 9, 12, 13, 14, 15]);
		expect(balls.slice(0, 4).map(b => b.alpha)).toEqual([200, 160, 120, 80]);
		expect(balls[0].color).toEqual([155, 155, 255]);
		expect(balls[4].color).toEqual([155, 255, 155]);
		expect(balls[8].color).toEqual([255, 155, 155]);
		const parts = EffectTable[751];
		expect(parts).toHaveLength(13);
		expect(parts[0]).toMatchObject({ type: '3D', spriteName: 'fireball', fromSrc: true, size: 100 });
		expect(parts[12].wav).toBe('effect/ef_fireball');
		expect(parts[12].delayWav).toBeCloseTo(5 * (1000 / 60));
	});
});
