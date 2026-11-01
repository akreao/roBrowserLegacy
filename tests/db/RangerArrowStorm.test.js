import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Arrow Storm (RA_ARROWSTORM 2233): no use or ground effect; as each damage packet's damage arrives, on a target that is
// not the caster: arrowstorm.wav, 1293 (new_arrowstorm_00), then 1294 (new_arrowstorm_01) three times, 600 / 800 / 1000 ms in.
// kRO 2025-07-16, spec: effect-port/ranger-skills.md.

describe('Arrow Storm plays the new arrow rain on each target as the damage arrives', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.RA_ARROWSTORM]).toEqual({ arrivalEffectIdOnTarget: ['ef_ra_arrowstorm_sound', 1293, 1294] });
		expect(EffectTable.ef_ra_arrowstorm_sound).toEqual([{ wav: 'arrowstorm', attachedEntity: true }]);
		expect(EffectTable[1293][0]).toMatchObject({ type: 'STR', file: 'new_arrowstorm/new_arrowstorm_00/new_arrowstorm_00', min: 'mineffect/new_arrowstorm/new_arrowstorm_00/new_arrowstorm_00' });
		expect(EffectTable[1294][0]).toMatchObject({ file: 'new_arrowstorm/new_arrowstorm_01/new_arrowstorm_01', duplicate: 3, timeBetweenDupli: 200, delayStart: 600 });
	});
});
