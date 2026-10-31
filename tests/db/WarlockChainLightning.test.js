import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Chain Lightning (WL_CHAINLIGHTNING 2214, WL_CHAINLIGHTNING_ATK 2215): no cast aura, 1635 + 1636 while casting; damage
// arrival: 1638 on the target.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Chain Lightning cast effects while casting, the bolt on each target as the damage arrives', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_CHAINLIGHTNING]).toEqual({ hideCastAura: true, beginCastEffectId: [1635, 1636], arrivalEffectIdOnTarget: 1638 });
		expect(SkillEffect[SK.WL_CHAINLIGHTNING_ATK]).toEqual({ arrivalEffectIdOnTarget: 1638 });
		expect(EffectTable[1638][0].file).toBe('new_chainlightning/new_chainlightning_target/new_chainlightning_target');
	});
});
