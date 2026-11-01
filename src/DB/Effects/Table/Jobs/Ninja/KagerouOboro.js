/**
 * @module DB/Effects/Table/Jobs/Ninja/KagerouOboro
 *
 * The Ninja line's KagerouOboro effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	// Cross Slash (KO_JYUMONJIKIRI), from the client's own effect folders.
	ef_ko_jyumonjikiri: [
		{
			type: 'STR',
			file: 'jyumonjikiri',
			texturePath: ''
		}
	],

	// Soul Cutter (KO_SETSUDAN), from the client's own effect folders.
	ef_ko_setsudan: [
		{
			type: 'STR',
			file: 'setsudan',
			texturePath: ''
		}
	]
};
