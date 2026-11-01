/**
 * @module DB/Effects/Table/Jobs/Mage/Sorcerer
 *
 * The Mage line's Sorcerer effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//912: [{}],	//EF_WALLOFTHORN	   Wall of Thorns unit (green fog cloud)
	//913: [{}],	//EF_FIREBALL5	   Magic projectiles
	//914: [{}],	//EF_THROWITEM11	   (Nothing)
	//915: [{}],	//EF_SPR_PLANT9	   Crazy Weed
	//916: [{}],	//EF_DEMONICFIRE	   Demonic Fire
	//917: [{}],	//EF_DEMONICFIRE2	   More angry, demonic flames
	//918: [{}],	//EF_DEMONICFIRE3	   Fire Insignia (demonic flames)
	//919: [{}],	//EF_HELLSPLANT	   Hell's Plant (green snapping plant)

	920: [
		{
			//EF_FIREWALL2	Fire Walk unit
			type: 'STR',
			file: 'firewall_per',
			attachedEntity: true
		}
	],

	//921: [{}],	//EF_VACUUM	   Vacuum Extreme (whirlwind)
	922: [
		{
			//EF_SPR_PLANT10	   Psychic Wave
			wav: 'effect/s\xbb\xe7\xc0\xcc\xc5\xb1\xbf\xfe\xc0\xcc\xba\xea'
		}
	],
	//923: [{}],	//EF_SPR_LIGHTPRINT2	   Poison Buster
	//924: [{}],	//EF_POISONSMOKE2	   Poisoning animation
	//925: [{}],	//EF_MAKEHALLU2	   Some filter

	926: [
		{
			//EF_SHOCKWAVE2	Electric Walk unit
			type: 'STR',
			file: 'hunter_shockwave_blue',
			attachedEntity: true
		}
	],

	//927: [{}],	//EF_SPR_PLANT11	   Earth Grave (speary roots)
	928: [
		{
			//EF_COLDTHROW2	   Ice cloud projectiles
			wav: 'effect/wl_jackfrost'
		}
	],
	929: [
		{
			//EF_DEMONICFIRE4	   Warmer (field of flames)
			wav: 'effect/s\xbf\xf6\xb8\xd3'
		}
	],

	930: [
		{
			//EF_PRESSURE3	   Varetyr Spear (falling spear)
			type: '3D',
			alphaMax: 0.6,
			attachedEntity: true,
			blendMode: 2,
			duration: 500,
			rotate: true,
			angle: 0,
			toAngle: -611,
			poszStart: 20,
			poszEnd: 5,
			size: 100,
			zIndex: 1,
			file: 'effect/cross1.bmp',
			wav: 'effect/\xc7\xc1\xb7\xb9\xbc\xc5'
		},
		{
			type: '3D',
			alphaMax: 0.6,
			attachedEntity: true,
			blendMode: 2,
			duration: 500,
			delayOffset: 501,
			fadeOut: true,
			angle: -611,
			posz: 5,
			size: 100,
			zIndex: 1,
			file: 'effect/cross1.bmp'
		}
	],

	1046: [
		{
			//EF_SO_ELEMENTAL_SHIELD
			type: 'STR',
			file: 'so_elemental_shield',
			wav: 'effect/so_elemental_shield',
			attachedEntity: true
		}
	],

	// Earth Grave (SO_EARTHGRAVE), from the client's own effect folders.
	ef_so_earthgrave: [
		{
			type: 'STR',
			file: 'new_earthgrave/new_earthgrave/new_earthgrave',
			texturePath: 'new_earthgrave/new_earthgrave/'
		},
		{
			type: 'STR',
			file: 'new_earthgrave/new_earthgrave_bottom/new_earthgrave_bottom',
			texturePath: 'new_earthgrave/new_earthgrave_bottom/',
			renderBeforeEntities: true
		}
	],

	// Earth Grave (SO_EARTHGRAVE), from the client's own effect folders.
	ef_so_earthgrave_hit: [
		{
			type: 'STR',
			file: 'new_earthgrave/new_earthgrave_hit/new_earthgrave_hit',
			texturePath: 'new_earthgrave/new_earthgrave_hit/'
		}
	],

	// Diamond Dust (SO_DIAMONDDUST), from the client's own effect folders.
	ef_so_diamonddust: [
		{
			type: 'STR',
			file: 'new_diamonddust/new_diamonddust/new_diamonddust',
			texturePath: 'new_diamonddust/new_diamonddust/'
		},
		{
			type: 'STR',
			file: 'new_diamonddust/new_diamonddust_bottom/new_diamonddust_bottom',
			texturePath: 'new_diamonddust/new_diamonddust_bottom/',
			renderBeforeEntities: true
		}
	],

	// Diamond Dust (SO_DIAMONDDUST), from the client's own effect folders.
	ef_so_diamonddust_cast: [
		{
			type: 'STR',
			file: 'new_diamonddust/new_diamonddust_cast/new_diamonddust_cast',
			texturePath: 'new_diamonddust/new_diamonddust_cast/'
		}
	],

	// Poison Buster (SO_POISON_BUSTER), from the client's own effect folders.
	ef_so_poison_buster: [
		{
			type: 'STR',
			file: 'poison',
			texturePath: ''
		}
	],

	// Psychic Wave (SO_PSYCHIC_WAVE), from the client's own effect folders.
	ef_so_psychic_wave: [
		{
			type: 'STR',
			file: 'new_psychicwave/new_psychicwave/new_psychicwave',
			texturePath: 'new_psychicwave/new_psychicwave/'
		},
		{
			type: 'STR',
			file: 'new_psychicwave/new_psychicwave_bottom/new_psychicwave_bottom',
			texturePath: 'new_psychicwave/new_psychicwave_bottom/',
			renderBeforeEntities: true
		}
	],

	// Psychic Wave (SO_PSYCHIC_WAVE), from the client's own effect folders.
	ef_so_psychic_wave_cast: [
		{
			type: 'STR',
			file: 'new_psychicwave/new_psychicwave_cast/new_psychicwave_cast',
			texturePath: 'new_psychicwave/new_psychicwave_cast/'
		}
	],

	// Spirit Recovery (SO_EL_CURE), from the client's own effect folders.
	ef_so_el_cure: [
		{
			type: 'STR',
			file: 'cure',
			texturePath: ''
		}
	]
};
