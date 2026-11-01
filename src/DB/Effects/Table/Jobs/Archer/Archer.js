/**
 * @module DB/Effects/Table/Jobs/Archer/Archer
 *
 * The Archer line's Archer effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	153: [
		{
			//EF_CONCENTRATION	Increase Concentration
			type: 'STR',
			file: 'concentration',
			wav: 'effect/ac_concentration',
			attachedEntity: true
		}
	]
};
