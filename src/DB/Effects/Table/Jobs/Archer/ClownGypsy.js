/**
 * @module DB/Effects/Table/Jobs/Archer/ClownGypsy
 *
 * The Archer line's ClownGypsy effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import FlatColorTile from 'Renderer/Effects/FlatColorTile.js';

export default {
	393: [
		{
			//EF_TRIPLEATTACK3	   Arrow Vulcan
			wav: 'effect/\xbe\xd6\xb7\xce\xbf\xec\x20\xb9\xdf\xc4\xad'
		}
	],

	394: [
		{
			// Moonlit water mill/sheltering bliss	//EF_SPHEREWIND2	Sheltering Bliss
			type: 'FUNC',
			wav: 'effect/\xb4\xde\xba\xfb\xbc\xbc\xb7\xb9\xb3\xaa\xb5\xa5',
			attachedEntity: false,
			func: function (Params) {
				const BlueTile = FlatColorTile('salmon', { r: 0xff / 255, g: 0x8a / 255, b: 0xbb / 255, a: 0.6 });
				this.add(new BlueTile(Params.Inst.position, Params.Inst.startTick), Params);
			}
		}
	],

	517: [
		{
			//EF_BOTTOM_HERMODE	   (Nothing)
		}
	],

	'517_music': [
		{
			wav: 'effect/\xc7\xec\xb8\xa3\xb8\xf0\xb5\xe5\xc0\xc7\x20\xc1\xf6\xc6\xce\xc0\xcc',
			attachedEntity: true
		}
	]
};
