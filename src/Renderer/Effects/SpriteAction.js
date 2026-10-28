/**
 * Renderer/Effects/SpriteAction.js
 *
 * Which action of an effect sprite an SPR row plays. A row's `frame` is a
 * number, or a list of actions to pick one from at random each time it plays:
 * the official client picks some effect sprites' action so (Shadow Slash's
 * 그림자베기 plays action 0 or 4). Spec: effect-port/ninja-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/**
 * @param {number|number[]} [frame] the row's frame
 * @param {function} [random] returns 0 <= x < 1
 * @return {number|undefined}
 */
export function spriteAction(frame, random = Math.random) {
	return Array.isArray(frame) ? frame[Math.floor(random() * frame.length)] : frame;
}
