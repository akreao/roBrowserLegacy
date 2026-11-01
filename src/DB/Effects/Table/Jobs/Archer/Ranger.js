/**
 * @module DB/Effects/Table/Jobs/Archer/Ranger
 *
 * The Archer line's Ranger effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//735: [{}],	//EF_CHOOKGI_FIRE	   (Nothing) - Used for elemental spheres (warlock)
	//736: [{}],	//EF_CHOOKGI_WIND	   (Nothing) - Used for elemental spheres (warlock)
	//737: [{}],	//EF_CHOOKGI_WATER	   (Nothing) - Used for elemental spheres (warlock)
	//738: [{}],	//EF_CHOOKGI_GROUND	   (Nothing) - Used for elemental spheres (warlock)
	//739: [{}],	//EF_MAGENTA_TRAP	   Old Magenta Trap
	//740: [{}],	//EF_COBALT_TRAP	   Old Cobald Trap
	//741: [{}],	//EF_MAIZE_TRAP	   Old Maize Trap
	//742: [{}],	//EF_VERDURE_TRAP	   Old Verdure Trap
	//743: [{}],	//EF_NORMAL_TRAP	   White Ranger Trap
	//744: [{}],	//EF_CLOAKING2	   Camouflage

	745: [
		{
			//EF_AIMED_STR	Aimed Bolt (crosshairs)
			type: 'STR',
			file: 'aimed',
			attachedEntity: true
		}
	],

	746: [
		{
			//EF_ARROWSTORM_STR	Arrow Storm
			type: 'STR',
			file: 'arrowstorm',
			attachedEntity: true
		}
	],

	750: [
		{
			//EF_CONCENTRATION2	Detonator (blue sparkles)
			type: 'STR',
			file: 'concentration',
			attachedEntity: true
		}
	],

	ef_wugbite: [
		{
			wav: 'wug_bite',
			attachedEntity: true
		}
	],

	ef_wugstrike: [
		{
			wav: 'wug_strike',
			attachedEntity: true
		}
	],

	ef_wugrider: [
		{
			wav: 'wolf_stand',
			attachedEntity: true
		}
	],

	// Fear Breeze (RA_FEARBREEZE), from the client's own effect folders.
	ef_ra_fearbreeze: [
		{
			type: 'STR',
			file: 'new_fearbreeze/new_fearbreeze',
			texturePath: 'new_fearbreeze/'
		}
	],

	// Unlimited (RA_UNLIMIT), from the client's own effect folders.
	ef_ra_unlimit: [
		{
			type: 'STR',
			file: 'new_unlimit/new_unlimit/new_unlimit',
			texturePath: 'new_unlimit/new_unlimit/',
			wav: 'ra_unlimit'
		},
		{
			type: 'STR',
			file: 'new_unlimit/new_unlimit_bottom/new_unlimit_bottom',
			texturePath: 'new_unlimit/new_unlimit_bottom/',
			renderBeforeEntities: true
		}
	]
};
