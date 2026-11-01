/**
 * @module DB/Effects/Table/Jobs/Taekwon/SoulReaper
 *
 * The Taekwon line's SoulReaper effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	// Golem's Soul (SP_SOULGOLEM), from the client's own effect folders.
	ef_sp_soulgolem: [
		{
			type: 'STR',
			file: 'soul_golem/soul_golem',
			texturePath: 'soul_golem/'
		}
	],

	// Soul Curse (SP_SOULCURSE), from the client's own effect folders.
	ef_sp_soulcurse: [
		{
			type: 'STR',
			file: 'soul_curse/soul_curse',
			texturePath: 'soul_curse/'
		}
	],

	// Soul Revolution (SP_SOULREVOLVE), from the client's own effect folders.
	ef_sp_soulrevolve: [
		{
			type: 'STR',
			file: 'soul_revolve/soul_revolve',
			texturePath: 'soul_revolve/'
		}
	]
};
