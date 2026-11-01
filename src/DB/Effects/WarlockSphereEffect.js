/**
 * DB/Effects/WarlockSphereEffect.js
 *
 * A Warlock's summoned spheres (WL_SUMMONFB / BL / WB / STONE), as the official
 * client (kRO 2025-07-16) draws them: one looping tetra_ball STR a filled slot,
 * at the actor's feet and following it. The ball's orbit is drawn in the STR;
 * the client spreads the balls round it by starting each a little way in.
 * Spec: effect-port/warlock-spheres.md.
 *
 *  - The server sends the five slots as EFST_SUMMON1..5, each with the element
 *    (0x44 fire, 0x45 wind, 0x46 water, 0x47 stone); the client reads value & 3.
 *  - Whenever a slot is filled, changed or emptied and two or more are filled,
 *    every filled slot restarts, skipping floor(fps x slot / count) frames
 *    (slot 0-4, count = filled slots).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Effect id by element (value & 3): fire, wind, water, stone. */
export const SPHERE_EFFECT_BY_ELEMENT = [1262, 1264, 1263, 1265];

/** Every sphere effect id. */
export const SPHERE_EFFECTS = [1262, 1263, 1264, 1265];

/** Slots a Warlock has. */
export const SPHERE_SLOTS = 5;

/**
 * The effect id for a slot's value
 *
 * @param {number} value the status value (0x44-0x47)
 * @return {number} effect id
 */
export function sphereEffectId(value) {
	return SPHERE_EFFECT_BY_ELEMENT[value & 3];
}

/**
 * The balls to play for the slots
 *
 * The client re-spaces the balls only when two or more are filled; a lone
 * ball keeps running. Here every change restarts the balls, so a lone ball
 * left after a change starts again from its first frame.
 *
 * @param {Array} slots slot values (0 = empty), SPHERE_SLOTS long
 * @return {Array} { slot, effectId, lead } (lead in seconds of the file's frames)
 */
export function sphereLayout(slots) {
	const filled = [];
	for (let slot = 0; slot < SPHERE_SLOTS; slot++) {
		if (slots[slot]) {
			filled.push(slot);
		}
	}
	const count = filled.length;
	return filled.map(slot => ({
		slot,
		effectId: sphereEffectId(slots[slot]),
		lead: count > 1 ? slot / count : 0
	}));
}

/**
 * One sphere's row: its looping STR on the actor
 *
 * @param {string} name folder and file, under tetravortex/
 * @return {Array} effect table row
 */
function sphereRow(name) {
	const [folder, file] = name.split('/');
	return [
		{
			type: 'STR',
			file: `tetravortex/${folder}/${file}`,
			texturePath: `tetravortex/${folder}/`,
			loop: true,
			attachedEntity: true
		}
	];
}

/** EffectTable rows 1262-1265 (CTetraBallEffect). */
export default {
	1262: sphereRow('tetra_ball_01_fire/tetra_01_fire'),
	1263: sphereRow('tetra_ball_04_water/tetra_04_water'),
	1264: sphereRow('tetra_ball_02_wind/tetra_02_wind'),
	1265: sphereRow('tetra_ball_03_earth/tetra_03_earth')
};
