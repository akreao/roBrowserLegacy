/**
 * @module DB/Effects/Table/Jobs/Archer/Sniper
 *
 * The Archer line's Sniper effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Camera from 'Renderer/Camera.js';

export default {
	//385: [{}],	//EF_LINKLIGHT	   Soul Change (Visual Effect)

	386: [
		{
			//EF_TRUESIGHT	   True Sight
			wav: 'effect/hunter_detecting',
			attachedEntity: true
		}
	],

	387: [
		{
			//EF_FALCONASSAULT	   Falcon Assault
			wav: 'effect/hunter_blitzbeat',
			attachedEntity: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 300;
				Camera.setQuake(start);
			}
		}
	],

	388: [
		{
			//EF_TRIPLEATTACK2	   Focused Arrow Strike (Sound Effect)
			wav: 'effect/\xbb\xfe\xc7\xc1\xbd\xb4\xc6\xc3',
			attachedEntity: true
		}
	],

	389: [
		{
			//windwalk	//EF_PORTAL4	Wind Walk
			wav: 'effect/\xc0\xa9\xb5\xe5\xbf\xf6\xc5\xa9', //Ŕ©µĺżöĹ©
			attachedEntity: true
		}
	]
};
