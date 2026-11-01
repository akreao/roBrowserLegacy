/**
 * DB/Skills/CastAuraRule.js
 *
 * Which skills the official client gives an element cast aura. Its cast-aura
 * picker answers "none" for every skill id in 5401-5507 (4th jobs: Night Watch
 * to Spirit Handler), 6001-6006 (DK_DRAGONIC_BREATH to BO_MAYHEMIC_THORNS) and
 * 6525-6606 (Druid, Karnos and Alitea: DR_ENRAGE_WOLF to AT_NATURE_AID) that has
 * no skilleffectinfo row, and data.grf has no row for any of them. Whatever such
 * a skill shows while casting comes from its own cast slot, which roBrowser keeps
 * in SkillEffect (castAuraEffectId, beginCastEffectId). See
 * effect-port/druid-cast-aura.md and effect-port/fourth-job-cast.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Skill id ranges, inclusive, with no element cast aura. */
export const NO_ELEMENT_AURA_RANGES = [
	[5401, 5507],
	[6001, 6006],
	[6525, 6606]
];

/**
 * Does the client play the element cast aura for this skill?
 *
 * @param {number} skillId
 * @return {boolean}
 */
export function hasElementCastAura(skillId) {
	return !NO_ELEMENT_AURA_RANGES.some(([first, last]) => skillId >= first && skillId <= last);
}

/**
 * The aura shown for one of a skill's own cast auras. The official client's
 * picker (kRO 2025-07-16, 0xd85467) turns an aura of 12 into the element
 * aura when the cast's element is 1-6 (water to holy), whichever case set it;
 * other elements keep 12. Other auras are shown as they are.
 *
 * @param {number} effectId the skill's own aura
 * @param {number} element the cast packet's element
 * @param {number} elementAura the element's aura
 * @return {number}
 */
export function fixedCastAura(effectId, element, elementAura) {
	return effectId === 12 && element >= 1 && element <= 6 ? elementAura : effectId;
}
