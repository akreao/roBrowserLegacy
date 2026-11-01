/**
 * @module DB/Effects/Table/Jobs/Merchant/Merchant
 *
 * The Merchant line's Merchant effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	10: [
		{
			//EF_COIN	Mammonite
			type: 'STR',
			file: 'maemor',
			min: 'memor_min',
			wav: 'effect/ef_coin2',
			attachedEntity: true
		}
	],

	170: [
		{
			//EF_CARTREVOLUTION	Cart Revolution
			type: 'STR',
			file: 'cartrevolution',
			wav: 'effect/ef_magnumbreak',
			attachedEntity: true
		}
	],

	//310: [{}],	//EF_SPRINKLESAND	   Sprinkle Sand

	311: [
		{
			//crazy uproar	//EF_LOUD	Crazy Uproar
			type: 'STR',
			file: 'loud',
			wav: 'effect/\xb0\xed\xbc\xba\xb9\xe6\xb0\xa1',
			attachedEntity: true
		}
	]
};
