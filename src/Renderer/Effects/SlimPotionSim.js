/**
 * Renderer/Effects/SlimPotionSim.js
 *
 * Motion of the official client's falling slim potion (Slim Potion Pitcher,
 * effects 497-499, EF_SLIM to EF_SLIM3), without any WebGL, so it can be
 * tested on its own. The client draws it with the primitive of Gloria Domini's
 * falling cross (type 87), in its potion variants 1-3:
 *
 *  - A camera-facing square of the potion's item image, half size 8, starting
 *    80 units above the target cell with a random roll and alpha 0, tinted by
 *    the variant and alpha-blended.
 *  - Each update the alpha climbs 20 (to 200 on update 10). For 24 updates it
 *    turns 15 degrees back and falls 3 units (80 -> 8 units up), then stays.
 *    From update 33 it loses 5 alpha an update (gone on update 72).
 *  - Three trailing copies: copy c shows the potion as it was c updates
 *    before, with 100 less alpha, then 25 less for each further copy.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second), degrees.
 * See effect-port/creator-skills.md.
 */

/** Half the potion's side, units. */
export const HALF_SIZE = 8;

/** Height the potion starts at, units. */
export const START_UP = 80;

/** Updates it falls and turns for. */
const FALL_UPDATES = 24;

/** Update from which it fades. */
const FADE_FROM = 33;

/** The last update anything shows. */
export const LAST_UPDATE = 72;

/** Effects 497-499's lifetime, ticks. */
export const LIFETIME = 250;

/** Item images under data/texture/유저인터페이스/item. */
const ITEM = '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/';

/**
 * The three potions: effect id, item image and tint (0-255). Slim Potion
 * Pitcher picks 497 for levels 1-5, 498 for 6-9 and 499 for 10.
 */
export const SLIM_POTIONS = {
	497: { texture: ITEM + '\xb7\xb9\xb5\xe5\xbd\xbd\xb8\xb2\xc6\xf7\xbc\xc7.bmp', color: [255, 135, 135] }, // 레드슬림포션
	498: { texture: ITEM + '\xbf\xbb\xb7\xce\xbf\xec\xbd\xbd\xb8\xb2\xc6\xf7\xbc\xc7.bmp', color: [255, 255, 135] }, // 옐로우슬림포션
	499: { texture: ITEM + '\xc8\xad\xc0\xcc\xc6\xae\xbd\xbd\xb8\xb2\xc6\xf7\xbc\xc7.bmp', color: [255, 255, 255] } // 화이트슬림포션
};

/** The ground packet's effect for a skill level. */
export function slimPotionFor(level) {
	return level < 6 ? 497 : level < 10 ? 498 : 499;
}

/**
 * The potion after update `k` (1 on the first; 0 is the start).
 *
 * @param {number} roll starting roll, degrees
 * @param {number} k
 * @return {{up: number, angle: number, alpha: number}}
 */
export function potionAt(roll, k) {
	const moved = Math.min(Math.max(k, 0), FALL_UPDATES);
	const alpha = k < FADE_FROM ? Math.min(200, 20 * Math.max(k, 0)) : Math.max(0, 200 - 5 * (k - FADE_FROM + 1));
	return {
		up: START_UP - 3 * moved,
		angle: (((roll - 15 * moved) % 360) + 360) % 360,
		alpha
	};
}

/**
 * Trailing copy `copy` (1-3) after update `k`: the potion `copy` updates
 * before, fainter; null before it has anything to show.
 *
 * @param {number} roll
 * @param {number} copy 1 to 3
 * @param {number} k
 * @return {{up: number, angle: number, alpha: number}|null}
 */
export function trailAt(roll, copy, k) {
	if (k <= copy) {
		return null;
	}
	const p = potionAt(roll, k - copy);
	return Object.assign(p, { alpha: Math.max(0, p.alpha - 100 - 25 * (copy - 1)) });
}
