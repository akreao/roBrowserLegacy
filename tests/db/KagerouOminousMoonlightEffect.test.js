import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Ominous Moonlight (OB_AKAITSUKI, skill 3029): the official client's skilleffectinfo row plays t_에너지방출.wav and launches
// 1009 (불길한붉은달빛.str) on the target as each damage packet arrives (rAthena sends a no-damage one). Nothing
// from the use packet, no hit flash. kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Ominous Moonlight', () => {
	it('plays its STR and sound on the target at damage arrival', () => {
		expect(SkillEffect[SK.OB_AKAITSUKI]).toEqual({ damageEffectIdOnTarget: 'ef_ob_akaitsuki' });
		expect(EffectTable.ef_ob_akaitsuki).toEqual([
			{ type: 'STR', file: '\xba\xd2\xb1\xe6\xc7\xd1\xba\xd3\xc0\xba\xb4\xde\xba\xfb', texturePath: '', wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2', attachedEntity: true }
		]);
	});
});
