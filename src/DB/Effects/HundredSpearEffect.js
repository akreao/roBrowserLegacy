/**
 * DB/Effects/HundredSpearEffect.js
 *
 * Hundred Spear's arrival effects as the official client (kRO 2025-07-16)
 * plays them, on the caster aimed at the target. Spec: effect-port/hundred-spear.md.
 *
 * - 723 EF_CHIMTO2: hundred.wav and the 헌드레드스피어 sprite standing at the
 *   target's position, its action (0-3) picked from the on-screen direction
 *   from the target to the caster.
 * - 835 EF_CHEMICAL2DASH2: a screen quake on tick 44, and from tick 20 to 100
 *   the caster's glow copy in a pale yellow (CasterMarks.js). Its dash streaks
 *   are not drawn yet.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Camera from 'Renderer/Camera.js';
import CasterMarks from 'Renderer/Effects/CasterMarks.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';

/** 헌드레드스피어, in the client's encoding. */
const SPRITE = '\xc7\xe5\xb5\xe5\xb7\xb9\xb5\xe5\xbd\xba\xc7\xc7\xbe\xee';

/**
 * The client's whole-degree heading of a vector (dx, dz): the first angle c
 * from 0 with cos(c) at or below dx / length, mirrored to 360 - c when dz < 0.
 *
 * @param {number} dx
 * @param {number} dz
 * @return {number} 0 to 359 (180 when both are 0)
 */
export function clientHeading(dx, dz) {
	const length = Math.hypot(dx, dz);
	const nx = length ? dx / length : -1;
	let c = 0;
	while (c < 180 && nx < Math.cos((c * Math.PI) / 180) - 1e-9) {
		c++;
	}
	return dz < 0 && c ? 360 - c : c;
}

/**
 * The sprite's action: the heading from the target to the caster (map y as
 * the client's z) plus the camera's turn, split in four.
 *
 * @param {Array} caster position
 * @param {Array} target position
 * @param {number} [cameraTurn] degrees, Camera.angle[1] by default
 * @return {number} 0 to 3
 */
export function hundredSpearAction(caster, target, cameraTurn = Camera.angle[1]) {
	const heading = clientHeading(caster[0] - target[0], caster[1] - target[1]);
	const angle = (((heading + Math.trunc(cameraTurn)) % 360) + 360) % 360;
	if (angle >= 180 && angle < 270) {
		return 0;
	}
	if (angle >= 90 && angle < 180) {
		return 1;
	}
	if (angle < 90) {
		return 2;
	}
	return 3;
}

/** EffectTable row for 723. */
export const hundredSpearEffect = [
	{
		//EF_CHIMTO2	Hundred Spear: the sound on the caster
		wav: 'hundred',
		attachedEntity: true
	},
	{
		// The sprite at the target's position, turned towards the caster
		type: 'FUNC',
		attachedEntity: false,
		func: function (Params) {
			const caster = Params.Init.ownerEntity;
			const target = Params.Init.otherEntity;
			if (!caster || !target) {
				return;
			}
			const position = [target.position[0], target.position[1], target.position[2]];
			this.spamEffect({
				effect: {
					type: 'SPR',
					file: SPRITE,
					frame: hundredSpearAction(caster.position, target.position)
				},
				Inst: { effectID: 723, startTick: Params.Inst.startTick },
				Init: { ...Params.Init, ownerEntity: null, ownerAID: -1, position }
			});
		}
	}
];

/** EffectTable row for 835. */
export const hundredSpearDashEffect = [
	{
		//EF_CHEMICAL2DASH2	Hundred Spear: quake on tick 44, the caster's pale yellow glow on ticks 20-100
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			Camera.setQuake(Params.Inst.startTick + 44 * PRIM_TICK_MS);
			this.add(new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 101, 835), Params);
		}
	}
];
