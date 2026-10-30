import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Soul Explosion (SP_SOULEXPLOSION, skill 2610): the official client's skilleffectinfo row plays
// hunter_landmine.wav and launches 1208 (EF_ENERGYDRAIN_BLACK, not ported) and 1242 (CSpriteEffect,
// 이팩트\soul_explosion\soul_explosion.spr at 4 ticks a frame) on the target as each damage packet arrives.
// No use case, no hit flash. kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Soul Explosion', () => {
	it('plays the explosion sprite and its sound on each target at damage arrival', () => {
		expect(SkillEffect[SK.SP_SOULEXPLOSION]).toEqual({ damageEffectIdOnTarget: 'ef_sp_soulexplosion' });
		expect(EffectTable.ef_sp_soulexplosion).toEqual([
			{
				type: 'SPR',
				file: 'soul_explosion/soul_explosion',
				delayFrame: 67,
				stackable: true,
				wav: 'effect/hunter_landmine',
				attachedEntity: true
			}
		]);
	});
});
