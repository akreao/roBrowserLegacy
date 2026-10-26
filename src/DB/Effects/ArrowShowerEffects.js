/**
 * DB/Effects/ArrowShowerEffects.js
 *
 * Arrow Shower (AC_SHOWER), played like the official client: arrows fly from
 * the caster to the centre of the cells around a point. From the ground
 * packet: the 8 cells around the target cell (the client's arrow to the
 * centre has no length, so nothing shows). From each damage packet: the
 * damaged actor and the 8 cells around it. Each arrow waits 18 frames of
 * 24 ms before it shows, then flies 8 frames, 2 cells (10 official units)
 * above the ground. Spec: effect-port/archer-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** The 8 cells around the centre, in the client's order. */
export const NEIGHBOUR_CELLS = [
	[1, 0],
	[1, 1],
	[1, -1],
	[-1, 0],
	[-1, 1],
	[-1, -1],
	[0, 1],
	[0, -1]
];

/** The client's arrow frame. */
const FRAME_MS = 24;

/** Wait before an arrow shows: 18 frames. */
export const START_DELAY_MS = 18 * FRAME_MS;

/** Flight: 8 frames. */
export const FLIGHT_MS = 8 * FRAME_MS;

/**
 * One arrow from the caster (the effect's other entity) to its owner's
 * position plus a cell offset.
 * @param {number[]} offset [x, y] in cells
 */
function arrow(offset) {
	return {
		type: '3D',
		alphaMax: 1,
		angle: 180,
		attachedEntity: false,
		delayStart: START_DELAY_MS,
		duration: FLIGHT_MS,
		absoluteSpriteName: 'data/sprite/npc/skel_archer_arrow',
		toSrc: true,
		endCellOffset: offset,
		rotateToTarget: true,
		rotateWithCamera: true,
		size: 100,
		zOffset: 2,
		zIndex: 1
	};
}

/** EffectTable rows. */
export function arrowShowerEffects() {
	return {
		// Ground packet: the 8 cells around the target cell
		ef_arrow_shower_ground: NEIGHBOUR_CELLS.map(arrow),
		// Each damage packet: the damaged actor and the 8 cells around it
		ef_arrow_shower_target: [arrow([0, 0]), ...NEIGHBOUR_CELLS.map(arrow)]
	};
}
