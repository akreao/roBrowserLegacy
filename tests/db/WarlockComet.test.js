import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Comet (WL_COMET 2213): cast aura 1418 (not ported) + 1415 + 1421 while casting; ZC_NOTIFY_SKILL: 1413 + 1414 on the
// target.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Comet cast effects while casting, the comet on each target as its packet arrives', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_COMET]).toEqual({ hideCastAura: true, beginCastEffectId: [1415, 1421], damageEffectIdOnTarget: [1413, 1414] });
		expect(EffectTable[1421][0]).toMatchObject({ file: 'new_comet/new_comet_cast/new_comet_cast', castLoop: true });
		expect(EffectTable[1413][0].file).toBe('new_comet/new_comet/new_comet');
	});
});
