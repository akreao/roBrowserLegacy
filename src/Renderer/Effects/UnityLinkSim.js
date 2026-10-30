/**
 * Renderer/Effects/UnityLinkSim.js
 *
 * The numbers of Soul Unity's link (effect 1210) in the official client
 * (kRO 2025-07-16: 0xbf1af0 with 0, primitive 38: update 0xb46b50 case 0x26,
 * draw 0xb75640), without any WebGL.
 *
 * A cloud11.tga tube from the target to the caster, 8 units up at both ends,
 * following them both for 200 ticks:
 *  - ten-sided, around the line, an inner tube yellow (255, 255, 0) and an
 *    outer one twice as wide, blue (0, 0, 255) at twice the alpha, both added;
 *  - 0.4 units wide, swelling by sin(tick) * 0.005 a tick;
 *  - it reaches out from the target over 15 ticks (sin(6 * tick) of the way);
 *  - alpha 45, up by 1 a tick to 125 on tick 80.
 *
 * Units: the client's world units (5 to a cell), y down; angles in degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

export const LINK = {
	life: 200,
	up: 8,
	sides: 10,
	width: 0.4,
	swell: 0.005,
	reachTicks: 15,
	reachStep: 6, // degrees of the sine a tick
	alpha: 45,
	alphaUntil: 80,
	inner: [255, 255, 0],
	outer: [0, 0, 255]
};

const rad = Math.PI / 180;

/**
 * Alpha (0..255) of the inner tube after `n` updates; the outer has twice it.
 *
 * @param {number} n
 * @return {number}
 */
export function linkAlpha(n) {
	return LINK.alpha + Math.min(n, LINK.alphaUntil);
}

/**
 * Width of the inner tube after `n` updates; the outer is twice as wide.
 *
 * @param {number} n
 * @return {number}
 */
export function linkWidth(n) {
	let w = LINK.width;
	for (let c = 1; c <= n; c++) {
		w += Math.sin((c % 360) * rad) * LINK.swell;
	}
	return w;
}

/**
 * How much of the way to the caster the tube reaches after `n` updates.
 *
 * @param {number} n
 * @return {number} 0..1
 */
export function linkReach(n) {
	return n < LINK.reachTicks ? Math.sin(n * LINK.reachStep * rad) : 1;
}

/**
 * The ring of a tube end: `sides + 1` points around the line, relative to
 * the end, the first and last the same. The ring stands across the line:
 * sideways and up.
 *
 * @param {Array} dir unit direction of the line, [x, z]
 * @param {number} radius
 * @return {Array} [x, y, z] points
 */
export function linkRing(dir, radius) {
	const px = -dir[1];
	const pz = dir[0];
	const out = [];
	for (let k = 0; k <= LINK.sides; k++) {
		const a = ((k * 360) / LINK.sides) * rad;
		const s = radius * Math.cos(a);
		out.push([s * px, radius * Math.sin(a), s * pz]);
	}
	return out;
}
