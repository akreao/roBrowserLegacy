import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Rapid Throw (KO_MUCHANAGE, skill 3008): the official client's skilleffectinfo row plays 닌자_던지기.wav
// from the ground packet (it has no ground effect), and launches 330 (EF_HITLINE, not in roBrowser) on the
// target as each damage packet arrives. Its effectID list is empty, so the use packet launches nothing.
// No hit flash. kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Rapid Throw', () => {
	it('plays the throw sound on the caster from the ground packet', () => {
		expect(SkillEffect[SK.KO_MUCHANAGE]).toEqual({
			groundEffectIdOnCaster: 'ef_ko_bakuretsu_sound',
			arrivalEffectIdOnTarget: 330
		});
		expect(EffectTable.ef_ko_bakuretsu_sound).toEqual([
			{ wav: 'effect/\xb4\xd1\xc0\xda_\xb4\xf8\xc1\xf6\xb1\xe2', attachedEntity: true }
		]);
	});
});
