/**
 * @module DB/Effects/Table/Jobs/Archer/Hunter
 *
 * The Archer line's Hunter effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	69: [
		{
			//EF_SKIDTRAP	Skid Trap
			type: 'STR',
			file: 'skidtrap',
			wav: 'effect/hunter_skidtrap', // or hallucinationwalk ?
			attachedEntity: false
		}
	],

	99: [
		{
			//EF_FLASHER	Flasher Trap
			//type: 'FUNC',
			// Again two sprites... one attached one not. But here the 'main' sprite is ment to stay a little longer
			wav: 'effect/hunter_flasher',
			attachedEntity: false
		}
	],

	100: [
		{
			//EF_REMOVETRAP	Yellow ball fountain
			//type: 'FUNC',
			wav: 'effect/hunter_removetrap',
			attachedEntity: false
		}
	],

	106: [
		{
			//EF_BLASTMINEBOMB	Blast Mine Trap
			type: 'STR',
			file: 'blastmine',
			wav: 'effect/hunter_blastmine', //hun_blastmine
			attachedEntity: false
		}
	],

	107: [
		{
			//EF_CLAYMORE	Claymore Trap
			type: 'STR',
			file: 'claymore',
			wav: 'effect/hunter_claymoretrap',
			attachedEntity: false
		}
	],

	108: [
		{
			//EF_FREEZING	Freezing Trap
			type: 'STR',
			file: 'freezing',
			wav: 'effect/hunter_freezingtrap',
			attachedEntity: false
		}
	],

	111: [
		{
			//EF_SPRINGTRAP	Spring Trap
			type: 'STR',
			file: 'spring',
			wav: 'effect/hunter_springtrap',
			attachedEntity: false
		}
	],

	115: [
		{
			//blitzbeat on target hit	//EF_BLITZBEAT	Blitz Beat
			wav: 'effect/hunter_blitzbeat',
			attachedEntity: true
		}
	],

	119: [
		{
			//EF_DETECTING	Detect
			wav: 'effect/hunter_detecting',
			attachedEntity: true
		}
	],

	139: [
		{
			//EF_SANDMAN	Sandman Trap
			type: 'STR',
			file: 'sandman',
			wav: 'effect/hunter_sandman',
			attachedEntity: false
		}
	],

	/*145: [{	//EF_SHOCKWAVE	Shockwave Trap
			type: 'STR',
			file: 'shockwave',
			wav:  'effect/hunter_shockwavetrap',
			attachedEntity: true
		}],*/

	145: [
		{
			type: 'SPR',
			file: 'shockwave',
			wav: 'effect/hunter_shockwavetrap',
			attachedEntity: true
		}
	],

	146: [
		{
			//EF_SHOCKWAVEHIT	Shockwave Trap Hit
			type: 'STR',
			file: 'shockwavehit',
			attachedEntity: true
		}
	],

	// Earlier classes: art from the client data for skills that had none.
	// Land Mine (HT_LANDMINE), from the client's own effect folders.
	ef_ht_landmine: [
		{
			type: 'STR',
			file: 'landmine',
			texturePath: ''
		}
	]
};
