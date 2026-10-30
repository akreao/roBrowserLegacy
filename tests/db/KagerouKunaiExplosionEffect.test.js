import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Kunai Explosion (KO_BAKURETSU, skill 3006): the official client's skilleffectinfo row plays
// 닌자_던지기.wav (and throws a kunai, 983, not ported) when the use packet has the result set, and plays
// 폭염룡.wav and launches 990 (CSpriteEffect: m_ef03 at scale 1.5) on the target as each damage packet
// arrives. No hit flash. kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Kunai Explosion', () => {
	it('plays the throw sound on the caster on success and the explosion on each target at damage arrival', () => {
		expect(SkillEffect[SK.KO_BAKURETSU]).toEqual({
			successEffectIdOnCaster: 'ef_ko_bakuretsu_sound',
			damageEffectIdOnTarget: 'ef_ko_ground_explosion'
		});
		expect(EffectTable.ef_ko_bakuretsu_sound).toEqual([
			{ wav: 'effect/\xb4\xd1\xc0\xda_\xb4\xf8\xc1\xf6\xb1\xe2', attachedEntity: true }
		]);
		expect(EffectTable.ef_ko_ground_explosion[0]).toMatchObject({
			type: 'SPR',
			file: 'm_ef03',
			scale: 1.5,
			delayFrame: 67,
			stackable: true,
			wav: 'effect/\xc6\xf8\xbf\xb0\xb7\xe6'
		});
	});
});
