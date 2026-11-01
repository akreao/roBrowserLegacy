/**
 * @module DB/Effects/Table/Jobs/Merchant/Mechanic
 *
 * The Merchant line's Mechanic effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//776: [{}],	//EF_VULCANWAV	   Like Desperado sound effect
	//777: [{}],	//EF_AGIUP2	   Faded light from the ground [S]
	//778: [{}],	//EF_DETECT3	   Expanding white aura (like Clearance)
	//779: [{}],	//EF_AGIUP3	   Faded light from the ground [S]
	//780: [{}],	//EF_DETECT4	   Expanding red aura (from Infrared Scan)
	//781: [{}],	//EF_ELECTRIC3	   Magnetic Field (purple chains)
	//782: [{}],	//EF_GUARD4	   All-around shield [S]
	//783: [{}],	//EF_BOTTOM_BARRIER	   Yellow shaft of light
	//784: [{}],	//EF_BOTTOM_STEALTH	   White shaft of light
	//785: [{}],	//EF_REPAIRTIME	   Upward flying wrenches
	//786: [{}],	//EF_NC_ANAL	   Symbol with bleeping sound [S]
	//787: [{}],	//EF_FIRETHROW	   Flare Launcher (line of fire)
	//788: [{}],	//EF_VENOMIMPRESS	   Venom Impress (green skull)
	//789: [{}],	//EF_FROSTMISTY	   Freezing Status Effect (two ancillas)
	//790: [{}],	//EF_BURNING	   Burning Status Effect (flame symbol)
	//791: [{}],	//EF_COLDTHROW	   Two ice shots
	//792: [{}],	//EF_MAKEHALLU	   Upward streaming white particles
	//793: [{}],	//EF_HALLUTIME	   Same, but more brief
	//794: [{}],	//EF_INFRAREDSCAN	   Infrared Scan (red lasers)

	795: [
		{
			//EF_CRASHAXE	Power Swing (axe crash)
			type: 'STR',
			file: 'powerswing',
			attachedEntity: true
		}
	],

	1050: [
		{
			//EF_NC_MAGMA_ERUPTION
			type: 'STR',
			file: 'nc_magma_eruption',
			wav: 'effect/nc_magma_eruption',
			attachedEntity: true
		}
	],

	// Vulcan Arm (NC_VULCANARM), from the client's own effect folders.
	ef_nc_vulcanarm: [
		{
			type: 'STR',
			file: 'new_vulcanarm/new_vulcanarm/new_vulcanarm',
			texturePath: 'new_vulcanarm/new_vulcanarm/'
		},
		{
			type: 'STR',
			file: 'new_vulcanarm/new_vulcanarm_bottom/new_vulcanarm_bottom',
			texturePath: 'new_vulcanarm/new_vulcanarm_bottom/',
			renderBeforeEntities: true
		}
	],

	// Arm Cannon (NC_ARMSCANNON), from the client's own effect folders.
	ef_nc_armscannon_cast: [
		{
			type: 'STR',
			file: 'new_armscannon/new_armscannon_cast/new_armscannon_cast',
			texturePath: 'new_armscannon/new_armscannon_cast/'
		},
		{
			type: 'STR',
			file: 'new_armscannon/new_armscannon_cast_bottom/new_armscannon_cast_bottom',
			texturePath: 'new_armscannon/new_armscannon_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Repair (NC_REPAIR), from the client's own effect folders.
	ef_nc_repair: [
		{
			type: 'STR',
			file: 'repair weapon',
			texturePath: ''
		},
		{
			type: 'STR',
			file: 'repairweapon',
			texturePath: ''
		}
	],

	// Axe Boomerang (NC_AXEBOOMERANG), from the client's own effect folders.
	ef_nc_axeboomerang: [
		{
			type: 'STR',
			file: 'new_axeboomerang/new_axeboomerang/new_axeboomerang',
			texturePath: 'new_axeboomerang/new_axeboomerang/'
		}
	],

	// Axe Boomerang (NC_AXEBOOMERANG), from the client's own effect folders.
	ef_nc_axeboomerang_cast: [
		{
			type: 'STR',
			file: 'new_axeboomerang/new_axeboomerang_cast/new_axeboomerang_cast',
			texturePath: 'new_axeboomerang/new_axeboomerang_cast/'
		},
		{
			type: 'STR',
			file: 'new_axeboomerang/new_axeboomerang_cast_bottom/new_axeboomerang_cast_bottom',
			texturePath: 'new_axeboomerang/new_axeboomerang_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Axe Boomerang (NC_AXEBOOMERANG), from the client's own effect folders.
	ef_nc_axeboomerang_hit: [
		{
			type: 'STR',
			file: 'new_axeboomerang/new_axeboomerang_hit/new_axeboomerang_hit',
			texturePath: 'new_axeboomerang/new_axeboomerang_hit/'
		}
	],

	// Axe Tornado (NC_AXETORNADO), from the client's own effect folders.
	ef_nc_axetornado: [
		{
			type: 'STR',
			file: 'new_axetornado/new_axetornado/new_axetornado',
			texturePath: 'new_axetornado/new_axetornado/'
		},
		{
			type: 'STR',
			file: 'new_axetornado/new_axetornado_bottom/new_axetornado_bottom',
			texturePath: 'new_axetornado/new_axetornado_bottom/',
			renderBeforeEntities: true
		}
	]
};
