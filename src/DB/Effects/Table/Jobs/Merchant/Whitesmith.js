/**
 * @module DB/Effects/Table/Jobs/Merchant/Whitesmith
 *
 * The Merchant line's Whitesmith effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	390: [
		{
			//EF_MELTDOWN	Shattering Strike
			type: 'STR',
			file: 'melt',
			attachedEntity: true
		}
	],

	391: [
		{
			//EF_CARTBOOST	Cart Boost
			type: 'STR',
			file: 'cart',
			wav: 'effect/ef_incagility',
			attachedEntity: true
		}
	]
};
