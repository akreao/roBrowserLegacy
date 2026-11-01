/**
 * @module DB/Effects/Table/Effects1900
 *
 * Effects 1900 to 1999 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import CastCircle from 'Renderer/Effects/CastCircle.js';
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
	],
	ef_cast_circle_red: [
		{
			// Effect 55: tinted circle, ring_yellow.tga, mode 1 (reddish, additive)
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCircle(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_yellow.tga',
						1
					),
					Params
				);
			}
		}
	],
	ef_cast_circle_violet: [
		{
			// Effect 59: untinted circle, magic_violet.tga
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCircle(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'magic_violet.tga'
					),
					Params
				);
			}
		}
	]
};
