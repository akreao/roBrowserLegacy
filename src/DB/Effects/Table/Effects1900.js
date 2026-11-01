/**
 * @module DB/Effects/Table/Effects1900
 *
 * Effects 1900 to 1999 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import CastRing from 'Renderer/Effects/CastRing.js';

export default {
	1938: [
		{
			// Spark Blaster / Triple Laser cast: the cast-aura ring in
			// new_battle_w/abr_battle_warior.tga, argument 0 (white, additive) (CastRingSim.js).
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
						'new_battle_w/abr_battle_warior.tga',
						[0, 0]
					),
					Params
				);
			}
		}
	]
};
