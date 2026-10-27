/**
 * DB/Skills/AutoCounterBar.js
 *
 * Auto Counter's stance bar, as the official client (kRO 2020-12-29) shows it:
 * on the use packet (result set) it opens a cast bar of skill level x 400 ms,
 * for the local player only, and closes it when ZC_DISPEL arrives (the counter
 * fires). The client plays no effect for the stance or the counter itself.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Bar length per skill level, in ms. */
export const AUTO_COUNTER_MS_PER_LEVEL = 400;

/**
 * Length of the stance bar for a use packet, or 0 for none.
 *
 * @param {number} level skill level from the packet
 * @param {boolean} isLocalPlayer whether the caster is the player's own character
 * @param {number} result the packet's result byte
 * @return {number} ms
 */
export function autoCounterBarMs(level, isLocalPlayer, result) {
	if (!isLocalPlayer || !result || !(level > 0)) {
		return 0;
	}
	return level * AUTO_COUNTER_MS_PER_LEVEL;
}
