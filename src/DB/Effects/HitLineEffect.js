/**
 * DB/Effects/HitLineEffect.js
 *
 * Effects 429 (EF_HITLINE4: Prominence Kick, Estun, Roundhouse), 430
 * (EF_HITLINE5: Counter Kick) and 431 (EF_HITLINE6: Heel Drop, Esma), the kick
 * hit lines as the official client draws them (kRO 2025-07-16, 0xbf0000 /
 * 0xbf0400 / 0xbef9f0 with mode 3): thin grey arcs with a blue glow sweeping out
 * from the target. Drawn by Renderer/Effects/HitLine.js, numbers in
 * Renderer/Effects/HitLineSim.js. Spec: effect-port/hit-lines.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import HitLine from 'Renderer/Effects/HitLine.js';
import { HITLINE_LAST_TICK, HITLINE_KINDS, hitLineLastTick } from 'Renderer/Effects/HitLineSim.js';

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

/** EffectTable rows for 430: 12 lines aimed at the target from the caster (the effect's other entity). */
export const hitLine5Effect = [
	{
		//EF_HITLINE5	Counter Kick hit lines: 12 arcs aimed from the caster (kRO 2025 0xbf0400, primitive 100)
		type: 'FUNC',
		attachedEntity: true,
		duration: Math.ceil((hitLineLastTick(HITLINE_KINDS[430]) + 1) * PRIM_TICK_MS),
		func: function (Params) {
			const source = Params.Init.otherEntity ? Params.Init.otherEntity.position : Params.Inst.otherPosition;
			this.add(
				new HitLine(Params.Init.ownerEntity, Params.Inst.startTick, Math.random, HITLINE_KINDS[430], source),
				Params
			);
		}
	}
];

/** EffectTable rows for 431: 20 lines, later and wider than 429's. */
export const hitLine6Effect = [
	{
		//EF_HITLINE6	Heel Drop / Esma hit lines: 20 arcs (kRO 2025 0xbef9f0, primitive 100)
		type: 'FUNC',
		attachedEntity: true,
		duration: Math.ceil((hitLineLastTick(HITLINE_KINDS[431]) + 1) * PRIM_TICK_MS),
		func: function (Params) {
			this.add(
				new HitLine(Params.Init.ownerEntity, Params.Inst.startTick, Math.random, HITLINE_KINDS[431]),
				Params
			);
		}
	}
];
