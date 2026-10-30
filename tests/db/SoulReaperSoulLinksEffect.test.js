import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Golem's / Shadow's / Falcon's / Fairy's Soul (SP_SOULGOLEM 2596, SP_SOULSHADOW 2597, SP_SOULFALCON 2598,
// SP_SOULFAIRY 2599): the official client's hard-coded use case (result set, target known) launches 503 on the
// target, removes its 424 and launches 424 again, then spawns the soul: 1228 (soul_golem.str) or a
// CSpriteEffect (1235 soul_shadow, 1237 soul_falcon, 1236 soul_fairy). kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

const SPR = { delayFrame: 67, stackable: true, attachedEntity: true, type: 'SPR' };

describe("Golem's / Shadow's / Falcon's / Fairy's Soul", () => {
	it('plays the soul link and the soul on the target on success', () => {
		expect(SkillEffect[SK.SP_SOULGOLEM]).toMatchObject({ successEffectId: [503, 424, 'ef_sp_soulgolem'] });
		expect(SkillEffect[SK.SP_SOULSHADOW]).toMatchObject({ successEffectId: [503, 424, 'ef_sp_soulshadow'] });
		expect(SkillEffect[SK.SP_SOULFALCON]).toMatchObject({ successEffectId: [503, 424, 'ef_sp_soulfalcon'] });
		expect(SkillEffect[SK.SP_SOULFAIRY]).toMatchObject({ successEffectId: [503, 424, 'ef_sp_soulfairy'] });
		expect(EffectTable.ef_sp_soulgolem).toEqual([
			{ type: 'STR', file: 'soul_golem/soul_golem', texturePath: 'soul_golem/', attachedEntity: true }
		]);
		expect(EffectTable.ef_sp_soulshadow).toEqual([{ ...SPR, file: 'soul_shadow/soul_shadow' }]);
		expect(EffectTable.ef_sp_soulfalcon).toEqual([{ ...SPR, file: 'soul_falcon/soul_falcon' }]);
		expect(EffectTable.ef_sp_soulfairy).toEqual([{ ...SPR, file: 'soul_fairy/soul_fairy' }]);
	});
});
