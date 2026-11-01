/**
 * @module DB/Effects/Table/Jobs/Taekwon/SoulLinker
 *
 * The Taekwon line's SoulLinker effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//410: [{}],	//EF_RAINBOW	   Rainbow
	//411: [{}],	//EF_PEONG	   Leap
	//412: [{}],	//EF_TANJI2	   Like Throw Spirit Sphere
	//413: [{}],	//EF_PRESSEDBODY	   Axe Kick
	//414: [{}],	//EF_SPINEDBODY	   Round Kick
	//415: [{}],	//EF_KICKEDBODY	   Counter Kick
	//416: [{}],	//EF_AIRTEXTURE	   (Nothing)
	//417: [{}],	//EF_HITBODY	   Flash
	//418: [{}],	//EF_DOUBLEGUMGANG	   Warmth Lightning
	//419: [{}],	//EF_REFLECTBODY	   Kaite (Visual Effect)

	420: [
		{
			//EF_BABYBODY	Eswoo (Small) (Visual Effect)
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectSmallTransition(Params) {
				const entity = Params.Init.ownerEntity;
				const xSize = entity.xSize;
				const ySize = entity.ySize;

				entity.animations.add(function (tick) {
					entity.xSize = xSize + (2.5 - xSize) * (Math.min(tick, 300) / 300);
					entity.ySize = ySize + (2.5 - ySize) * (Math.min(tick, 300) / 300);

					return tick > 300;
				});
			}
		}
	],

	//538: [{}],	//EF_GREENBODY	   Player Become Green with Green Aura
	//539: [{}],	//EF_THROWITEM4	   Throw Random Bottle
	//540: [{}],	//EF_BABYBODY_BACK	   Instant Small->Normal
	//541: [{}],	//EF_THROWITEM5	   (Nothing)
	//542: [{}],	//EF_BLUEBODY	   KA-Spell (1st Part)

	543: [
		{
			//EF_HATED	   Kahii
			wav: 'effect/t_\xba\xb8\xc1\xb6\xb8\xb6\xb9\xfd'
		}
	],

	//544: [{}],	//EF_REDLIGHTBODY	   Warmth Red Sprite
	//545: [{}],	//EF_RO2YEAR	   Sound And... PUFF Client Crash :P
	//546: [{}],	//EF_SMA_READY	   Kaupe

	547: [
		{
			//EF_STIN	   Estin
			wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2'
		}
	],

	//548: [{}],	//EF_RED_HIT	   Instant Red Sprite
	//549: [{}],	//EF_BLUE_HIT	   Instant Blue Sprite
	//550: [{}],	//EF_QUAKEBODY3	   Another Effect like Running Hit
	//551: [{}],	//EF_SMA	   Effect Like Estun but with Circle
	//552: [{}],	//EF_SMA2	   (Nothing)

	553: [
		{
			//EF_STIN2	   Esma
			duplicate: 5,
			timeBetweenDupli: 200,
			wav: 'effect/t_\xb3\xaf\xb6\xf3\xc2\xf7\xb1\xe2'
		}
	],

	//554: [{}],	//EF_HITTEXTURE	   Large White Cloud

	555: [
		{
			//EF_STIN3	   Estun
			wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2'
		}
	],

	589: [
		{
			//EF_M07	Eswoo
			type: 'SPR',
			file: 'm_ef07',
			wav: 'effect/t_\xba\xb8\xc1\xb6\xb8\xb6\xb9\xfd',
			attachedEntity: true
		}
	],

	590: [
		{
			//EF_KAIZEL	   Running Stop //Conflicting info, will use it as Kaizel
			wav: 'effect/priest_resurrection'
		}
	],

	// Spirit of the Assasin (SL_ASSASIN), from the client's own effect folders.
	ef_sl_assasin: [
		{
			type: 'STR',
			file: 'assasin_poisonreact',
			texturePath: ''
		},
		{
			type: 'STR',
			file: 'assasin_poisonreact_1st',
			texturePath: ''
		}
	],

	// Spirit of the Hunter (SL_HUNTER), from the client's own effect folders.
	ef_sl_hunter: [
		{
			type: 'STR',
			file: 'hunter_loud',
			texturePath: ''
		},
		{
			type: 'STR',
			file: 'hunter_poison',
			texturePath: ''
		},
		{
			type: 'STR',
			file: 'hunter_shockwave_blue',
			texturePath: ''
		}
	],

	// Estun (SL_STUN), from the client's own effect folders.
	ef_sl_stun: [
		{
			type: 'STR',
			file: 'stun',
			texturePath: '',
			wav: 'effect/_stun'
		}
	]
};
