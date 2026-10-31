import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Death Bound (RK_DEATHBOUND 2003): use packet (result set): 441 on the caster. The reflect damage packet
// (attacker -> rune knight): 183 on the rune knight.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Death Bound', () => {
	it('plays the blue flash on success and 183 on the reflecting knight', () => {
		expect(SkillEffect[SK.RK_DEATHBOUND]).toMatchObject({ successEffectIdOnCaster: 'ef_rk_bluecasting', damageEffectIdOnTarget: 183 });
		const [blue] = EffectTable.ef_rk_bluecasting;
		expect(blue).toMatchObject({ type: 'CYLINDER', textureName: 'ring_blue', duration: 1000 });
		expect(EffectTable[183]).toBeDefined();
	});
});
