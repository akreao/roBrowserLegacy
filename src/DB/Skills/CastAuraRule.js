/**
 * DB/Skills/CastAuraRule.js
 *
 * Which skills the official client gives an element cast aura. Its cast-aura
 * picker answers "none" for every skill id in 6525-6606 (Druid, Karnos and
 * Alitea: DR_ENRAGE_WOLF to AT_NATURE_AID) that has no skilleffectinfo row,
 * and data.grf has no row for any of them. Whatever such a skill shows while
 * casting comes from its own cast slot, which roBrowser keeps in SkillEffect
 * (castAuraEffectId, beginCastEffectId). See effect-port/druid-cast-aura.md.
 *
 * The client applies the same rule to 5401-5507 and 6001-6006, but then plays
 * a per-skill cast effect from another table for many of them, which roBrowser
 * does not have yet, so those ranges are left out here.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Skill id ranges, inclusive, with no element cast aura. */
export const NO_ELEMENT_AURA_RANGES = [[6525, 6606]];

/**
 * Does the client play the element cast aura for this skill?
 *
 * @param {number} skillId
 * @return {boolean}
 */
export function hasElementCastAura(skillId) {
	return !NO_ELEMENT_AURA_RANGES.some(([first, last]) => skillId >= first && skillId <= last);
}
