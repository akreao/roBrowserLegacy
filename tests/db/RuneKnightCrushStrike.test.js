import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Crush Strike (RK_CRUSHSTRIKE 2012): no use effect; as a damage packet with its id arrives at the target: quake, 589
// and _enemy_hit_wind2.wav. rAthena sends none (the boost rides a normal attack).
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Crush Strike', () => {
	it('plays the official use effects on success', () => {
		expect(SkillEffect[SK.RK_CRUSHSTRIKE]).toMatchObject({ firstHitEffectId: ['quake', 589, 'ef_rk_crushstrike_sound'] });
		expect(EffectTable.ef_rk_crushstrike_sound).toEqual([{ wav: '_enemy_hit_wind2', attachedEntity: true }]);
	});
});
