import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Distorted Crescent (OB_ZANGETSU, skill 3026): the official client's skilleffectinfo row plays t_따듯한마법.wav and launches
// 1010 (초승달2.str) on the target as each damage packet arrives (rAthena sends a no-damage one). Nothing
// from the use packet, no hit flash. kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Distorted Crescent', () => {
	it('plays its STR and sound on the target at damage arrival', () => {
		expect(SkillEffect[SK.OB_ZANGETSU]).toEqual({ damageEffectIdOnTarget: 'ef_ob_zangetsu' });
		expect(EffectTable.ef_ob_zangetsu).toEqual([
			{ type: 'STR', file: '\xc3\xca\xbd\xc2\xb4\xde2', texturePath: '', wav: 'effect/t_\xb5\xfb\xb5\xed\xc7\xd1\xb8\xb6\xb9\xfd', attachedEntity: true }
		]);
	});
});
