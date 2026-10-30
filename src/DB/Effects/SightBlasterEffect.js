/**
 * DB/Effects/SightBlasterEffect.js
 *
 * Effect 601 (EF_SIGHT2, Sight Blaster) as the official client (kRO
 * 2025-07-16) keeps it on the caster while the status is on: a ring of Sight
 * sprites going round 15 units out and 20 units up (SightBlasterSim.js).
 * StatusEffectTable.js starts it with the status and removes it when the
 * status ends.
 *
 * Each slot of the ring is one row that draws its own sprite, one at a time.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { SIGHT_SLOTS, sightSpriteAt } from 'Renderer/Effects/SightBlasterSim.js';

/** Long enough that a held look does not restart in play (the status removes it). */
const HELD_MS = 60 * 60 * 1000;

/**
 * @param {number} slot 0 to SIGHT_SLOTS - 1
 * @return {object} effect table row
 */
function sightSlot(slot) {
	return {
		type: '3D',
		spriteName: 'sight',
		alphaMax: 1,
		attachedEntity: true,
		duration: HELD_MS,
		zIndex: 1,
		track(age) {
			const p = sightSpriteAt(slot, age);
			if (!p) {
				return null;
			}
			return {
				x: p.x,
				y: p.y,
				z: p.z,
				size: p.scale * 100,
				alpha: p.alpha / 255,
				frame: p.frame
			};
		}
	};
}

const rows = [];
for (let slot = 0; slot < SIGHT_SLOTS; slot++) {
	rows.push(sightSlot(slot));
}

export default {
	601: rows
};
