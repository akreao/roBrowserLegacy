/**
 * @module DB/Effects/Table/Jobs/Swordman/RuneKnight
 *
 * The Swordman line's RuneKnight effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	587: [
		{
			//EF_M05	Big Purple Flame
			type: 'SPR',
			file: 'm_ef05',
			wav: 'dragon_breath',
			attachedEntity: true
		}
	],

	722: [
		{
			//EF_IGN_STR	Ignition Break (big explosion)
			type: 'STR',
			file: '\xc0\xcc\xb1\xd7\xb4\xcf\xbc\xc7\xba\xea\xb7\xb9\xc0\xcc\xc5\xa9',
			wav: 'effect/wl_jackfrost',
			attachedEntity: true
		}
	],
	//730: [{}],	//EF_SPR_SOULE	   Small, cartoony explosion (part of Soul Expansion)

	731: [
		{
			//EF_DHOWL_STR	Dragon Howling (blinking, expanding circle)
			type: 'STR',
			file: 'dragon_h',
			wav: 'dragon_h',
			attachedEntity: true
		}
	],

	749: [
		{
			//EF_MILSHIELD_STR	Millennium Shield
			type: 'STR',
			file: 'mil_shield',
			attachedEntity: true
		}
	],

	//755: [{}],	//EF_ORATIO	   Oratio (spinning blue symbol)

	756: [
		{
			//EF_POTION_BERSERK2	Enchant Blade (like Berserk Potion)
			type: 'STR',
			file: '\xb9\xf6\xbc\xad\xc5\xa9',
			attachedEntity: true
		}
	],

	832: [
		{
			//EF_HEAL_N	   Sonic Wave
			wav: 'effect/\xb1\xe2\xb0\xf8\xc6\xf7'
		}
	],

	1044: [
		{
			//EF_RK_LUXANIMA
			type: 'STR',
			file: 'rk_luxanima',
			attachedEntity: true
		}
	],

	ef_dragonbreath_water: [
		{
			type: 'SPR',
			file: 'rk_dragonbreath_water',
			wav: 'dragon_breath',
			attachedEntity: true
		}
	],

	// Wind Cutter (RK_WINDCUTTER), from the client's own effect folders.
	ef_rk_windcutter: [
		{
			type: 'STR',
			file: 'new_windcutter/new_windcutter/new_windcutter',
			texturePath: 'new_windcutter/new_windcutter/'
		}
	]
};
