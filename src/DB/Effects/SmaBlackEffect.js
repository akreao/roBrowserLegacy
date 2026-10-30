/**
 * DB/Effects/SmaBlackEffect.js
 *
 * Effect 1204 (EF_SMA_BLACK), Espa's: a point moving from the caster toward
 * the target that leaves a dark swirl (1205, SmaSwirl.js) every 8 ticks.
 * Numbers in Renderer/Effects/SmaSwirlSim.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import SmaSwirl from 'Renderer/Effects/SmaSwirl.js';
import { planSwirls, SMA, SWIRL } from 'Renderer/Effects/SmaSwirlSim.js';

/**
 * Where each swirl stands, in cells, on its way from `from` toward `to`.
 *
 * @param {Array} from caster [x, y, z]
 * @param {Array} to target [x, y, z]
 * @param {Array} swirls from planSwirls
 * @return {Array} [x, y, z] each
 */
export function swirlPositions(from, to, swirls) {
	const dx = to[0] - from[0];
	const dy = to[1] - from[1];
	const length = Math.hypot(dx, dy);
	// With no distance the client's angle is 0: along the map's x.
	const ux = length ? dx / length : 1;
	const uy = length ? dy / length : 0;
	return swirls.map(swirl => {
		const along = swirl.along / UNITS_PER_CELL;
		return [from[0] + ux * along, from[1] + uy * along, from[2]];
	});
}

/** EffectTable rows for 1204. */
export const smaBlackEffect = [
	{
		//EF_SMA_BLACK	Espa: dark swirls from the caster toward the target (kRO 2025 0xbfb5b0, 1205 0xbfb760)
		type: 'FUNC',
		attachedEntity: false,
		// The last swirl starts by tick 100 and lives 100 more. A duration also lets the
		// manager drop the swirls while they are culled and not drawn.
		duration: Math.ceil((SMA.life + SWIRL.life + 1) * PRIM_TICK_MS),
		func: function (Params) {
			const from = Params.Inst.position;
			const to = Params.Inst.otherPosition || from;
			const swirls = planSwirls();
			swirlPositions(from, to, swirls).forEach((at, i) => {
				this.add(new SmaSwirl(at, swirls[i].up, Params.Inst.startTick + swirls[i].tick * PRIM_TICK_MS), Params);
			});
		}
	}
];
