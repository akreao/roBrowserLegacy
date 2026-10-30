import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import StatusConst from 'DB/Status/StatusConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Cross Slash (KO_JYUMONJIKIRI, skill 3004): the official client's skilleffectinfo row plays
// cru_holy cross.wav when the use packet has the result set and launches 996 (jyumonjikiri.str) on the
// target as each damage packet arrives. No hit flash. The KO_JYUMONJIKIRI status keeps 998
// (red_cross.str) on the marked actor while it is on. kRO 2025-07-16. Spec: effect-port/kagerou-oboro-skills.md.

describe('Cross Slash', () => {
	it('plays the sound on the caster on success and jyumonjikiri.str on each target at damage arrival', () => {
		expect(SkillEffect[SK.KO_JYUMONJIKIRI]).toEqual({
			successEffectIdOnCaster: 'ef_ko_jyumonjikiri_sound',
			damageEffectIdOnTarget: 'ef_ko_jyumonjikiri'
		});
		expect(EffectTable.ef_ko_jyumonjikiri_sound).toEqual([{ wav: 'effect/cru_holy cross', attachedEntity: true }]);
		expect(EffectTable.ef_ko_jyumonjikiri[0]).toMatchObject({ type: 'STR', file: 'jyumonjikiri' });
	});

	it('keeps red_cross.str on the marked actor while the status is on', () => {
		expect(StatusEffectTable[StatusConst.KO_JYUMONJIKIRI]).toEqual({ loop: ['ef_ko_red_cross'] });
		expect(EffectTable.ef_ko_red_cross[0]).toMatchObject({ type: 'STR', file: 'red_cross', repeat: true });
	});
});
