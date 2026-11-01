/**
 * @module DB/Effects/Table/Jobs/Thief/Stalker
 *
 * The Thief line's Stalker effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Events from 'Core/Events.js';
import MagicRing from 'Renderer/Effects/MagicRing.js';

export default {
	392: [
		{
			//EF_REJECTSWORD	Reject Sword
			type: 'STR',
			file: 'sword',
			wav: 'effect/kyrie_guard',
			attachedEntity: true
		}
	],

	//494: [{}],	//EF_SHIELDBOOMERANG2	   Throwing Tomahawk
	//495: [{}],	//EF_RG_COIN2	   Full Strip Sound

	'496_beforecast': [
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				this.add(new MagicRing(entity, 2.45, 0.8, 2.8, 'ring_jadu', Params.Inst.startTick + 10000), Params);
			}
		}
	],

	496: [
		{
			//EF_GUARD2	  Preserve
			wav: 'effect/black_maximize_power_sword_bic'
		}
	],

	//497: [{}],	//EF_SLIM	   Twilight Alchemy 1
	//498: [{}],	//EF_SLIM2	   Twilight Alchemy 2
	//499: [{}],	//EF_SLIM3	   Twilight Alchemy 3
	//500: [{}],	//EF_CHEMICALBODY	   Player Become Blue with Blue Aura

	501: [
		{
			//EF_CASTSPIN	   Chase Walk Animation
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const duration = 500;
				const count = 50;
				const delay = duration / count;

				for (let i = 0; i < count; i++) {
					let delta = 1;

					if (i <= 15) {
						delta = 12 * (8 / 360);
					} else if (i <= 30) {
						delta = 18 * (8 / 360);
					} else if (i <= 40) {
						delta = 24 * (8 / 360);
					} else {
						delta = 48 * (8 / 360);
					}

					Events.setTimeout(function () {
						entity.direction = Math.floor(entity.direction + delta) % 8;
					}, delay * i);
				}
			}
		}
	]
};
