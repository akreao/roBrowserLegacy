/**
 * Engine/MapEngine/FalconFlight.js
 *
 * The official client sends a Hunter's falcon to a spot (actor message 0x1d)
 * for Blitz Beat and Falcon Assault (the target), Detect (the cell) and
 * Spring Trap (the trap): it flies there in its attack pose and comes back.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/**
 * Send the owner's falcon to a cell
 *
 * @param {Entity} owner the falcon's master
 * @param {number} x
 * @param {number} y
 * @return {boolean} whether a falcon flew
 */
export function sendFalcon(owner, x, y) {
	if (!owner || !owner.falcon) {
		return false;
	}

	owner.falcon.action = owner.action;
	owner.falcon.walk.speed = 35;
	owner.falcon.walkToNonWalkableGround(owner.falcon.position[0], owner.falcon.position[1], x, y, 0, true, true);
	return true;
}

export default sendFalcon;
