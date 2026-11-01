/**
 * @module DB/Effects/Table/Common/Effects2300
 *
 * Effects 2300 to 2399 of the effect table that no single class's skills
 * use: shared rows, monsters, items, statuses. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import CastRing from 'Renderer/Effects/CastRing.js';

export default {
	2367: [
		{
			// Night Watch, Soul Ascetic and Spirit Handler cast aura: the client's cast-aura ring in
			// ring_yellow.tga, argument 0 (white, additive), twice (CastRingSim.js).
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastRing(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_yellow.tga',
						[0, 0]
					),
					Params
				);
			}
		}
	],

	2369: [
		{
			// Breaking Limit, Rule Break and Talisman of Four Bearing God cast: the colour-cycling
			// ring (client primitive 139) in ring_white.tga, argument 0, twice: blue, red, green and
			// pale yellow, 25 ticks each (CastRingSim.js).
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastRing(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_white.tga',
						[0, 0],
						true
					),
					Params
				);
			}
		}
	]
};
