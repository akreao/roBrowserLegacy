import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Rune Knight cast auras: the official client gives 12 (yellow) whatever the element to Enchant Blade,
// Sonic Wave, Hundred Spear, Millennium Shield and Crush Strike (the others are in their own tests); Wind
// Cutter none; Death Bound, Dragon Howling, Vitality Activation, Storm Blast and Lux Anima the element aura.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Rune Knight cast auras', () => {
	it('uses the yellow aura for the 12 skills', () => {
		for (const sk of [SK.RK_ENCHANTBLADE, SK.RK_SONICWAVE, SK.RK_HUNDREDSPEAR, SK.RK_MILLENNIUMSHIELD, SK.RK_CRUSHSTRIKE]) {
			expect(SkillEffect[sk].castAuraEffectId).toBe(12);
		}
		expect(SkillEffect[SK.RK_WINDCUTTER].hideCastAura).toBe(true);
		for (const sk of [SK.RK_DEATHBOUND, SK.RK_DRAGONHOWLING, SK.RK_VITALITYACTIVATION, SK.RK_STORMBLAST, SK.RK_LUXANIMA]) {
			expect(SkillEffect[sk].castAuraEffectId).toBeUndefined();
		}
	});
});
