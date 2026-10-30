import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Soul Reaper (SP_SOULREAPER, skill 2607): when the use packet has the result set, the official client's
// skilleffectinfo row plays ef_signum.wav and launches 1234 (CSpriteEffect, 이팩트\soul_reaper\soul_reaper.spr
// at 4 ticks a frame) on the caster. kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Soul Reaper', () => {
	it('plays the reaper sprite and its sound on the caster on success', () => {
		expect(SkillEffect[SK.SP_SOULREAPER]).toMatchObject({ successEffectIdOnCaster: 'ef_sp_soulreaper' });
		expect(EffectTable.ef_sp_soulreaper).toEqual([
			{
				type: 'SPR',
				file: 'soul_reaper/soul_reaper',
				delayFrame: 67,
				stackable: true,
				wav: 'effect/ef_signum',
				attachedEntity: true
			}
		]);
	});
});
