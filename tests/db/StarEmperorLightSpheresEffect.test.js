import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Light of the Moon / Stars / Sun (SJ_LIGHTOFMOON 2574, SJ_LIGHTOFSTAR 2577, SJ_LIGHTOFSUN 2590): when the use
// packet has the result set, the official client's skilleffectinfo row plays t_피링.wav and launches the
// light sphere (1198 / 1199 / 1197, CLightSphereEffect, not ported) on the caster. kRO 2025-07-16.
// Spec: effect-port/star-emperor-soul-reaper-skills.md.

describe('Light of the Moon / Stars / Sun', () => {
	it('plays the use sound on the caster on success', () => {
		for (const sk of [SK.SJ_LIGHTOFMOON, SK.SJ_LIGHTOFSTAR, SK.SJ_LIGHTOFSUN]) {
			expect(SkillEffect[sk]).toEqual({ successEffectIdOnCaster: 'ef_sj_lightof_sound' });
		}
		expect(EffectTable.ef_sj_lightof_sound).toEqual([{ wav: 'effect/t_\xc7\xc7\xb8\xb5', attachedEntity: true }]);
	});
});
