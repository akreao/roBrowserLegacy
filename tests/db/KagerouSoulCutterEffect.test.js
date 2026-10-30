import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Soul Cutter (KO_SETSUDAN, skill 3005): the official client's skilleffectinfo row plays T_전기.wav and
// launches 997 (setsudan.str) on the target as each damage packet arrives (splash and misses included).
// No hit flash, nothing from the use packet. kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Soul Cutter', () => {
	it('plays setsudan.str and its sound on each target at damage arrival', () => {
		expect(SkillEffect[SK.KO_SETSUDAN]).toEqual({ damageEffectIdOnTarget: 'ef_ko_setsudan' });
		expect(EffectTable.ef_ko_setsudan[0]).toMatchObject({
			type: 'STR',
			file: 'setsudan',
			wav: 'effect/t_\xc0\xfc\xb1\xe2'
		});
	});
});
