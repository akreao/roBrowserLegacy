import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Release Ninja Spell (KO_KAIHOU, skill 3019): the official client's skilleffectinfo row plays
// 닌자_던지기.wav (and throws a charm orb, 989, not ported) when the use packet has the result set, and
// launches 1008 (술식해방.str) on the target as each damage packet arrives. No hit flash.
// kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Release Ninja Spell', () => {
	it('plays the throw sound on success and 술식해방.str on each target at damage arrival', () => {
		expect(SkillEffect[SK.KO_KAIHOU]).toEqual({
			successEffectIdOnCaster: 'ef_ko_bakuretsu_sound',
			damageEffectIdOnTarget: 'ef_ko_kaihou'
		});
		expect(EffectTable.ef_ko_kaihou[0]).toMatchObject({
			type: 'STR',
			file: '\xbc\xfa\xbd\xc4\xc7\xd8\xb9\xe6',
			texturePath: ''
		});
	});
});
