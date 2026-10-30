import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Moonlight Fantasy (OB_OBOROGENSOU, skill 3027): the official client's skilleffectinfo row plays sign_up.wav and launches
// 1011 (흐린달빛환상2.str) on the target as each damage packet arrives (rAthena sends a no-damage one). Nothing
// from the use packet, no hit flash. kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Moonlight Fantasy', () => {
	it('plays its STR and sound on the target at damage arrival', () => {
		expect(SkillEffect[SK.OB_OBOROGENSOU]).toEqual({ damageEffectIdOnTarget: 'ef_ob_gensou' });
		expect(EffectTable.ef_ob_gensou).toEqual([
			{ type: 'STR', file: '\xc8\xe5\xb8\xb0\xb4\xde\xba\xfb\xc8\xaf\xbb\xf32', texturePath: '', wav: 'effect/sign_up', attachedEntity: true }
		]);
	});
});
