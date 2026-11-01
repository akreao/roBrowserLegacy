/**
 * @module DB/Effects/Table/Common/Effects0900
 *
 * Effects 0900 to 999 of the effect table that no single class's skills
 * use: shared rows, monsters, items, statuses. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

export default {
	//935: [{}],	//EF_FIREBALL6	   Green magic projectile
	//936: [{}],	//EF_GUMGANG7	   Red, castishly expanding cone
	//937: [{}],	//EF_GUMGANG8	   Yellow, castishly expanding cone
	//938: [{}],	//EF_GUMGANG9	   Dark-red, castishly expanding cone
	//939: [{}],	//EF_BOTTOM_DE2	   Blue, conish aura
	//940: [{}],	//EF_COLDSTATUS	   Snow flake
	//941: [{}],	//EF_SPR_LIGHTPRINT3	   Explosion of red, demonic fire
	//942: [{}],	//EF_WATERBALL3	   Expanding, white dome
	//943: [{}],	//EF_HEAL_N2	   Green, fluffy projectile
	//944: [{}],	//EF_RAIN_PARTICLE2	   Falling gems
	//945: [{}],	//EF_CLOUD9	   (Nothing)
	//946: [{}],	//EF_YELLOWFLY3	   Floating lights
	//947: [{}],	//EF_EL_GUST	   Blue lightning sphere
	//948: [{}],	//EF_EL_BLAST	   Two blue lightning spheres
	//949: [{}],	//EF_EL_AQUAPLAY	   Flat, spinning diamond
	//950: [{}],	//EF_EL_UPHEAVAL	   Circling, planetlike spheres
	//951: [{}],	//EF_EL_WILD_STORM	   Three lightning spheres
	//952: [{}],	//EF_EL_CHILLY_AIR	   Flat, spinning gem and two lightning spheres
	//953: [{}],	//EF_EL_CURSED_SOIL	   Spinning, planetlike spheres
	//954: [{}],	//EF_EL_COOLER	   Two lightblue glowing spheres
	//955: [{}],	//EF_EL_TROPIC	   Three spinning flame spheres
	//956: [{}],	//EF_EL_PYROTECHNIC	   Flame
	//957: [{}],	//EF_EL_PETROLOGY	   Spinning planetlike sphere
	//958: [{}],	//EF_EL_HEATER	   Two flames

	959: [
		{
			//EF_POISON_MIST	Purple flame
			type: 'STR',
			file: 'poison_mist',
			attachedEntity: true
		}
	],

	960: [
		{
			//EF_ERASER_CUTTER	Small yellow explosion
			type: 'STR',
			file: 'eraser_cutter',
			attachedEntity: true
		}
	],

	//961: [{}],	//EF_SILENT_BREEZE	   Cartoony whirlwind
	//962: [{}],	//EF_MAGMA_FLOW	   Rising fire
	//963: [{}],	//EF_GRAYBODY	   Dark filter (like Stone Curse)

	964: [
		{
			//EF_LAVA_SLIDE	Same as 920
			type: 'STR',
			file: 'lava_slide',
			attachedEntity: true
		}
	],

	965: [
		{
			//EF_SONIC_CLAW	Small white explosion
			type: 'STR',
			file: 'sonic_claw',
			attachedEntity: true
		}
	],

	966: [
		{
			//EF_TINDER_BREAKER	Bone crack
			type: 'STR',
			file: 'tinder',
			attachedEntity: true
		}
	],

	967: [
		{
			//EF_MIDNIGHT_FRENZY	Another little explosion
			type: 'STR',
			file: 'mid_frenzy',
			attachedEntity: true
		}
	],

	975: [
		{
			//EF_VOLCANIC_ASH
			type: 'STR',
			file: 'vash00',
			attachedEntity: true
		}
	],

	987: [
		{
			//EF_2011RWC
			type: 'STR',
			file: 'rwc2011',
			attachedEntity: true
		}
	],

	988: [
		{
			//EF_2011RWC2
			type: 'STR',
			file: 'rwc2011_2',
			attachedEntity: true
		}
	]
};
