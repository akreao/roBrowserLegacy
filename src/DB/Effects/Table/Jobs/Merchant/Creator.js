/**
 * @module DB/Effects/Table/Jobs/Merchant/Creator
 *
 * The Merchant line's Creator effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Camera from 'Renderer/Camera.js';

export default {
	537: [
		{
			//EF_ACIDDEMON	   Acid Demonstration
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 200;
				Camera.setQuake(start);
			}
		}
	]
};
