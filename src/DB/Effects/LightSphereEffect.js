/**
 * DB/Effects/LightSphereEffect.js
 *
 * Effects 1197 / 1198 / 1199 (CLightSphereEffect: Light of the Sun, Moon and
 * Stars) as the official client (kRO 2025-07-16) draws them on the caster: a
 * glowing centre 10 units up and a sphere of 640 rays around it, red for the
 * Sun, yellow for the Moon and blue for the Stars (LightSphereSim.js). The
 * rays are drawn by Renderer/Effects/LightSphere.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import LightSphere from 'Renderer/Effects/LightSphere.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { SPHERE, SPHERE_COLORS, CENTER_LIFE, centerAt } from 'Renderer/Effects/LightSphereSim.js';

/** Sprite pixels to a unit. */
const PX_PER_UNIT = 7;

/**
 * One of the centre's four copies.
 *
 * @param {number} effectId
 * @return {object} effect table row
 */
function centerRow(effectId) {
	const [red, green, blue] = SPHERE_COLORS[effectId].center.map(c => c / 255);
	return {
		type: '3D',
		file: 'effect/thunder_center.bmp',
		sharedTexture: true,
		alphaMax: 1,
		blendMode: 2,
		red,
		green,
		blue,
		attachedEntity: true,
		duration: CENTER_LIFE * PRIM_TICK_MS,
		zIndex: 1,
		track(age) {
			const c = centerAt(age);
			if (c.alpha < 1) {
				return null;
			}
			return {
				x: 0,
				y: 0,
				z: SPHERE.height / UNITS_PER_CELL,
				size: 2 * c.half * PX_PER_UNIT,
				alpha: c.alpha / 255
			};
		}
	};
}

/**
 * @param {number} effectId 1197, 1198 or 1199
 * @return {Array<object>} effect table rows
 */
function sphereRows(effectId) {
	const rows = [];
	for (let i = 0; i < SPHERE.centers; i++) {
		rows.push(centerRow(effectId));
	}
	rows.push({
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			this.add(new LightSphere(effectId, Params.Init.ownerEntity, Params.Inst.startTick), Params);
		}
	});
	return rows;
}

export default {
	//CLightSphereEffect	Light of the Sun
	1197: sphereRows(1197),
	//CLightSphereEffect	Light of the Moon
	1198: sphereRows(1198),
	//CLightSphereEffect	Light of the Stars
	1199: sphereRows(1199)
};
