import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Warg Mastery (RA_WUGMASTERY 2240): use packet (result set): wolf_attack.wav; cast aura 441.
// Warg Rider (RA_WUGRIDER 2241): use packet (result set): wolf_stand.wav; no cast aura.
// kRO 2025-07-16, spec: effect-port/ranger-skills.md.

describe('Warg Mastery and Warg Rider sounds on success only', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.RA_WUGMASTERY]).toEqual({ successEffectIdOnCaster: 'ef_ra_wugmastery_sound', castAuraEffectId: 441 });
		expect(SkillEffect[SK.RA_WUGRIDER]).toEqual({ successEffectIdOnCaster: 'ef_wugrider' });
		expect(EffectTable.ef_ra_wugmastery_sound).toEqual([{ wav: 'wolf_attack', attachedEntity: true }]);
		expect(EffectTable.ef_wugrider).toEqual([{ wav: 'wolf_stand', attachedEntity: true }]);
	});
});
