/**
 * DB/Effects/JudexEffect.js
 *
 * Judex's falling lights as the official client (kRO 2025-07-16, damage
 * arrival 0xd914c8) places them for each damage packet: twelve pairs of 1633
 * (new_judex_light) and 1634 (its floor). Each pair stands r units from the
 * target, r = max(r(15), 2), turned by r(36) x 10 (the client hands that
 * number straight to its rotation helper, so it is in radians), and starts
 * r(10) x 50 ms late. They stand free where they start, placed round
 * where the target is when the damage is due.
 * Spec: effect-port/arch-bishop-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Renderer from 'Renderer/Renderer.js';
import { UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';

/** Lights a damage packet drops round its target. */
export const JUDEX_LIGHTS = 12;

const r = (random, k) => Math.floor(random() * k);

/**
 * The lights of one damage packet.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} { dx, dy } (cells), delay (ms)
 */
export function planJudexLights(random = Math.random) {
	const lights = [];
	for (let i = 0; i < JUDEX_LIGHTS; i++) {
		const distance = Math.max(r(random, 15), 2);
		const angle = r(random, 36) * 10;
		const delay = r(random, 10) * 50;
		lights.push({
			dx: (distance * Math.cos(angle)) / UNITS_PER_CELL,
			dy: (-distance * Math.sin(angle)) / UNITS_PER_CELL,
			delay
		});
	}
	return lights;
}

/** EffectTable row: the lights round the target of a damage packet. */
export const judexLightsEffect = [
	{
		type: 'FUNC',
		attachedEntity: false,
		func: function (Params) {
			// The damage packet comes before its damage is due: place the lights
			// round the target where it stands then.
			const owner = Params.Init.ownerEntity;
			const place = () => {
				const position = owner && owner.position ? owner.position : Params.Inst.position;
				if (!position) {
					return;
				}
				planJudexLights().forEach(light => {
					const at = [position[0] + light.dx, position[1] + light.dy, position[2]];
					[1633, 1634].forEach(effectId => {
						this.spam({
							effectId,
							position: at.slice(),
							startTick: Params.Inst.startTick + light.delay
						});
					});
				});
			};
			const wait = Params.Inst.startTick - Renderer.tick;
			if (wait > 0) {
				setTimeout(place, wait);
			} else {
				place();
			}
		}
	}
];
