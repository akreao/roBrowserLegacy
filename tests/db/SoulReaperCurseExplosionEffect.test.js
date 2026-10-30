import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Curse Explosion (SP_CURSEEXPLOSION, skill 2600): the official client's skilleffectinfo row launches 1233
// (CSpriteEffect, 이팩트\curse_explosion\curse_explosion.spr at 4 ticks a frame) on the target as each damage
// packet arrives (splash included). Hit flash 180 (EF_HITDARK, HitDarkEffect.js). kRO 2025-07-16.
// Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Curse Explosion', () => {
	it('plays the explosion sprite on each target at damage arrival', () => {
		expect(SkillEffect[SK.SP_CURSEEXPLOSION]).toMatchObject({ damageEffectIdOnTarget: 'ef_sp_curseexplosion' });
		expect(EffectTable.ef_sp_curseexplosion).toEqual([
			{
				type: 'SPR',
				file: 'curse_explosion/curse_explosion',
				delayFrame: 67,
				stackable: true,
				attachedEntity: true
			}
		]);
	});
});
