/**
 * DB/Effects/StarEmperorStatusEffects.js
 *
 * Effect table entries for the looks the official client (kRO 2025-07-16)
 * keeps on a Star Emperor or a Soul Reaper's target while a status is on,
 * spread into EffectTable.js and held by StatusEffectTable.js.
 * Spec: effect-port/star-emperor-soul-reaper-audit.md.
 *
 * - 1214-1217 CSunStanceEffect (Sun, Lunar, Star, Universal Stance): three
 *   pictures going round the actor (SunStanceSim.js);
 * - 1201 CGravityControlEffect (Gravity Control): wl_telekinesis_intense.str,
 *   looping, and the target's body lifted to 20 units (BodyMotion.js);
 * - 1222 CSoulUnityEffect (Soul Unity): soul_unity.bmp, 5 units across, 15
 *   units above the actor's feet.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import BodyMotion from 'Renderer/Effects/BodyMotion.js';
import { UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { STANCE_TEXTURES, PX_PER_UNIT, stancePartAt } from 'Renderer/Effects/SunStanceSim.js';

/** Long enough that a held look does not restart in play (the status removes it). */
const HELD_MS = 60 * 60 * 1000;

/**
 * One stance picture.
 *
 * @param {string} name texture in effect/sun_stance/
 * @param {number} index part 0-2
 * @return {object} effect table row
 */
function stancePart(name, index) {
	return {
		type: '3D',
		file: `effect/sun_stance/${name}.tga`,
		sharedTexture: true,
		attachedEntity: true,
		duration: HELD_MS,
		alphaMax: 1,
		zIndex: 10,
		track(age) {
			const p = stancePartAt(index, age);
			return { x: p.x, y: p.y, z: p.z, size: p.size };
		}
	};
}

const stanceRows = {};
Object.keys(STANCE_TEXTURES).forEach(id => {
	stanceRows[id] = STANCE_TEXTURES[id].map((name, i) => stancePart(name, i));
});

/** Soul Unity's picture: half side 2.5 units, 15 units up. */
export const SOUL_UNITY = { half: 2.5, height: 15 };

export default {
	...stanceRows,

	1201: [
		{
			//CGravityControlEffect	Gravity Control
			type: 'STR',
			file: 'wl_telekinesis_intense',
			repeat: true,
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new BodyMotion(Params.Init.ownerEntity, Params.Inst.startTick, 1201, Infinity), Params);
			}
		}
	],

	1222: [
		{
			//CSoulUnityEffect	Soul Unity
			type: '3D',
			file: 'effect/soul_unity/soul_unity.bmp',
			attachedEntity: true,
			duration: HELD_MS,
			alphaMax: 1,
			zIndex: 10,
			track() {
				return {
					x: 0,
					y: 0,
					z: SOUL_UNITY.height / UNITS_PER_CELL,
					size: 2 * SOUL_UNITY.half * PX_PER_UNIT
				};
			}
		}
	]
};
