/**
 * DB/Skills/SplashHit.js
 *
 * Hits from a splash damage packet, as the official client (kRO 2025-07-16)
 * shows them. A skill damage packet of type 5 or 14 whose target is a known
 * actor queues its hit straight away with no hit effects: no hit flash (0, 49,
 * 51...) and no hit-map effect. Only the damage number and the hit itself are
 * shown. A few skills are exceptions:
 *  - skills whose splash packets go on as normal ones (SPLASH_AS_NORMAL);
 *  - a list of newer skills whose splash hit carries the skill's own effects
 *    (SPLASH_HIT_OWN_EFFECTS);
 *  - skills roBrowser cannot place (UNKNOWN_RANGES), left as they were.
 * Damage from a ground skill unit goes through the unit, not this path.
 * See effect-port/merchant-audit.md "2025 re-check".
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { SPLASH_AS_NORMAL, SPLASH_DAMAGE_TYPES, UNKNOWN_RANGES } from './SkillMotionEffect.js';

/** Skills whose splash hits carry their own caster-map and hit-map effects. */
export const SPLASH_HIT_OWN_EFFECTS = [
	5215, 5225, 5226, 5234, 5235, 5236, 5237, 5241, 5244, 5245, 5294, 5295, 5296, 5298, 5314, 5319, 5329, 5383, 5384,
	5385
];

const inRanges = (ranges, id) => ranges.some(([first, last]) => id >= first && id <= last);

/**
 * Does the hit of this damage packet, on a known target, play the skill's hit
 * effects?
 *
 * @param {number} skillId
 * @param {number} damageType the packet's action field
 * @return {boolean}
 */
export function hitHasEffects(skillId, damageType) {
	if (!SPLASH_DAMAGE_TYPES.includes(damageType)) {
		return true;
	}
	return (
		SPLASH_AS_NORMAL.includes(skillId) ||
		SPLASH_HIT_OWN_EFFECTS.includes(skillId) ||
		inRanges(UNKNOWN_RANGES, skillId)
	);
}
