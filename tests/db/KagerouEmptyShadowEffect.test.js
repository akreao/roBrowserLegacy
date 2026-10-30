import { describe, expect, it } from 'vitest';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Empty Shadow (KG_KYOMU, skill 3024): the official client's skilleffectinfo row plays t_에너지방출.wav and launches
// 1001 (허무의그림자.str) on the target as each damage packet arrives (rAthena sends a no-damage one). Nothing
// from the use packet, no hit flash. kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Empty Shadow', () => {
	it('plays its STR and sound on the target at damage arrival', () => {
		expect(SkillEffect[SK.KG_KYOMU]).toEqual({ damageEffectIdOnTarget: 'ef_kg_kyomu' });
		expect(EffectTable.ef_kg_kyomu).toEqual([
			{ type: 'STR', file: '\xc7\xe3\xb9\xab\xc0\xc7\xb1\xd7\xb8\xb2\xc0\xda', texturePath: '', wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2', attachedEntity: true }
		]);
	});
});
