import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// The official client's cast-aura picker gives these skills a fixed aura, whatever the packet's element:
// 58 (EF_BEGINSPELL6) for Star Emperor Advent, Nova Explosion, Gravity Control and Book of Creating Star;
// 441 (EF_BLUECASTING) for the four souls, Soul Unity, Soul Reaper and Soul Revolution; 454
// (EF_DARKCASTING) for Curse Explosion, Soul Curse, Espa, Esha, Eswhoo, Soul Division and Soul Explosion.
// kRO 2025-07-16. Spec: effect-port/star-emperor-soul-reaper-skills.md.

const AURAS = {
	58: [SK.SJ_STAREMPEROR, SK.SJ_NOVAEXPLOSING, SK.SJ_GRAVITYCONTROL, SK.SJ_BOOKOFCREATINGSTAR],
	441: [
		SK.SP_SOULGOLEM,
		SK.SP_SOULSHADOW,
		SK.SP_SOULFALCON,
		SK.SP_SOULFAIRY,
		SK.SP_SOULUNITY,
		SK.SP_SOULREAPER,
		SK.SP_SOULREVOLVE
	],
	454: [
		SK.SP_CURSEEXPLOSION,
		SK.SP_SOULCURSE,
		SK.SP_SPA,
		SK.SP_SHA,
		SK.SP_SWHOO,
		SK.SP_SOULDIVISION,
		SK.SP_SOULEXPLOSION
	]
};

describe('Star Emperor / Soul Reaper cast auras', () => {
	it('uses the fixed aura for each skill', () => {
		for (const [aura, skills] of Object.entries(AURAS)) {
			for (const sk of skills) {
				expect(SkillEffect[sk].castAuraEffectId).toBe(Number(aura));
			}
			expect(EffectTable[aura]).toBeDefined();
		}
	});
});
