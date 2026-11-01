import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Warg Strike 2243, Warg Bite 2244, Sensitive Keen 2246: damage arrival plays wug_strike.wav / wug_bite.wav /
// were_wolf_attack.wav. No use effect.
// kRO 2025-07-16, spec: effect-port/ranger-skills.md.

describe('Warg Strike, Warg Bite and Sensitive Keen sounds as the damage arrives', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.RA_WUGSTRIKE]).toEqual({ arrivalEffectIdOnTarget: 'ef_wugstrike' });
		expect(SkillEffect[SK.RA_WUGBITE]).toEqual({ arrivalEffectIdOnTarget: 'ef_wugbite' });
		expect(SkillEffect[SK.RA_SENSITIVEKEEN]).toEqual({ arrivalEffectIdOnTarget: 'ef_ra_sensitivekeen_sound' });
		expect(EffectTable.ef_wugstrike).toEqual([{ wav: 'wug_strike', attachedEntity: true }]);
		expect(EffectTable.ef_wugbite).toEqual([{ wav: 'wug_bite', attachedEntity: true }]);
		expect(EffectTable.ef_ra_sensitivekeen_sound).toEqual([{ wav: 'were_wolf_attack', attachedEntity: true }]);
	});
});
