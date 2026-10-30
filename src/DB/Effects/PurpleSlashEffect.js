/**
 * DB/Effects/PurpleSlashEffect.js
 *
 * The official client's purple slashes as EffectTable rows: each part of a
 * prim 86 / 92 (PurpleSlashSim.js) is one level purpleslash.tga square
 * (EffectPrim quad) following its path. Spec: effect-port/assassin-cross-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import { SLASH, headingTo, planAimedSlash, planOutwardSlash, slashAt } from 'Renderer/Effects/PurpleSlashSim.js';

/**
 * The PRIM row drawing one part: a square whose corners are 20 units from its
 * centre, turned so the texture's left edge (the arc) leads.
 *
 * @param {object} part from PurpleSlashSim's slashPath
 * @return {object}
 */
export function slashPartEffect(part) {
	return {
		type: 'PRIM',
		prim: 'quad',
		texture: 'purpleslash',
		attachedEntity: false,
		frames: part.end,
		duration: part.end * PRIM_TICK_MS,
		size: SLASH.corner / Math.SQRT2,
		height: part.up,
		color: SLASH.color,
		alpha: 0,
		track(frame) {
			const p = slashAt(part, frame);
			return p && { x: p.x, y: p.y, alpha: p.alpha, yaw: p.heading - 90 };
		}
	};
}

/**
 * Spawn the parts of one primitive.
 *
 * @param {object} manager the EffectManager (`this` in a FUNC row)
 * @param {object} Params the FUNC row's params
 * @param {Array<object>} parts
 * @param {number} first duplicate id of the first part
 */
export function spawnSlashParts(manager, Params, parts, first = 0) {
	parts.forEach((part, i) => {
		manager.spamEffect({
			effect: slashPartEffect(part),
			Inst: {
				effectID: Params.Inst.effectID,
				duplicateID: first + i,
				startTick: Params.Inst.startTick
			},
			Init: Params.Init
		});
	});
}

/**
 * EffectTable row for Soul Destroyer's slash (361): one prim 86 from the
 * caster, aimed at where the target stands as the effect starts.
 */
export const aimedSlashEffect = {
	//EF_SOULBREAKER	four purple slashes from the caster toward the target (prim 86)
	type: 'FUNC',
	attachedEntity: false,
	func: function (Params) {
		const from = Params.Inst.position;
		const to = Params.Init.otherEntity ? Params.Init.otherEntity.position : from;
		spawnSlashParts(this, Params, planAimedSlash(headingTo(to[0] - from[0], to[1] - from[1])));
	}
};

/**
 * EffectTable row for Meteor Assault's slashes (409): eight prim 92 from the
 * caster, flying out at 0, 45, ... 315 degrees.
 */
export const outwardSlashEffect = {
	//EF_SOULBREAKER2	eight sets of four purple slashes flying out from the caster (prim 92)
	type: 'FUNC',
	attachedEntity: false,
	func: function (Params) {
		for (let k = 0; k < 8; k++) {
			spawnSlashParts(this, Params, planOutwardSlash(k * 45), k * SLASH.parts);
		}
	}
};
