import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Adoramus (AB_ADORAMUS 2040): nothing at use; as each damage packet's damage arrives: AB_adoramus.wav, 1258 + 1259 on the target.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Adoramus plays the new lightning on the target as the damage arrives', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_ADORAMUS]).toEqual({ arrivalEffectIdOnTarget: ['ef_ab_adoramus_sound', 1258, 1259] });
		expect(EffectTable.ef_ab_adoramus_sound).toEqual([{ wav: 'effect/ab_adoramus', attachedEntity: true }]);
		expect(EffectTable[1258][0]).toMatchObject({ type: 'STR', file: 'new_adoramus/new_adoramus/new_adoramus', min: 'mineffect/new_adoramus/new_adoramus/new_adoramus' });
		expect(EffectTable[1259][0]).toMatchObject({ file: 'new_adoramus/new_adoramus_bottom/new_adoramus_bottom', renderBeforeEntities: true });
	});
});
