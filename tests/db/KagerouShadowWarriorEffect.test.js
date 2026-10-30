import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Shadow Warrior (KG_KAGEMUSYA, skill 3025): the official client's skilleffectinfo row plays
// mon_금강불괴.wav and launches 169 (EF_ENERGYCOAT) on the target as each damage packet arrives (rAthena
// sends a no-damage one). Nothing from the use packet, no hit flash. kRO 2025-07-16.
// Spec: effect-port/kagerou-oboro-skills.md.

describe('Shadow Warrior', () => {
	it('plays its sound and the Energy Coat look on the target at damage arrival', () => {
		expect(SkillEffect[SK.KG_KAGEMUSYA]).toEqual({ damageEffectIdOnTarget: ['ef_kg_kagemusya_sound', 169] });
		expect(EffectTable.ef_kg_kagemusya_sound).toEqual([
			{ wav: 'effect/mon_\xb1\xdd\xb0\xad\xba\xd2\xb1\xab', attachedEntity: true }
		]);
		expect(EffectTable[169][0]).toMatchObject({ type: 'STR', file: 'energycoat' });
	});
});
