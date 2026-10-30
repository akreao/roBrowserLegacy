/**
 * DB/Effects/HitLineEffect.js
 *
 * Effect 429 (EF_HITLINE4), the kick hit lines of Prominence Kick and Estun,
 * as the official client draws them (kRO 2025-07-16, 0xbf0000 with mode 3):
 * 16 thin grey arcs with a blue glow sweeping out from the target. Drawn by
 * Renderer/Effects/HitLine.js, numbers in Renderer/Effects/HitLineSim.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import HitLine from 'Renderer/Effects/HitLine.js';
import { HITLINE_LAST_TICK } from 'Renderer/Effects/HitLineSim.js';

/** EffectTable rows for 429. */
export const hitLine4Effect = [
	{
		//EF_HITLINE4	Kick hit lines: 16 arcs sweeping out from the target (kRO 2025 0xbf0000, primitive 100)
		type: 'FUNC',
		attachedEntity: true,
		// Also lets the manager drop the lines while they are culled and not drawn.
		duration: Math.ceil((HITLINE_LAST_TICK + 1) * PRIM_TICK_MS),
		func: function (Params) {
			this.add(new HitLine(Params.Init.ownerEntity, Params.Inst.startTick), Params);
		}
	}
];
