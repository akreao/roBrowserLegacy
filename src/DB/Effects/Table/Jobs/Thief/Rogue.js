/**
 * @module DB/Effects/Table/Jobs/Thief/Rogue
 *
 * The Thief line's Rogue effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	227: [
		{
			//Intimidate / Snatch	//EF_INTIMIDATE	Snatch
			wav: 'effect/rog_intimidate',
			attachedEntity: true
		}
	],

	268: [
		{
			//EF_STEALCOIN	Steal Coin
			type: 'STR',
			file: 'steal_coin',
			attachedEntity: true
		}
	],

	269: [
		{
			//EF_STRIPWEAPON	Divest Weapon
			type: 'STR',
			file: 'strip_weapon',
			wav: 'effect/\x74\x5f\xba\xae\xc6\xa8\xb1\xe8',
			attachedEntity: true
		}
	],

	270: [
		{
			//EF_STRIPSHIELD	Divest Shield
			type: 'STR',
			file: 'strip_shield',
			wav: 'effect/\x74\x5f\xba\xae\xc6\xa8\xb1\xe8',
			attachedEntity: true
		}
	],

	271: [
		{
			//EF_STRIPARMOR	Divest Armor
			type: 'STR',
			file: 'strip_armor',
			wav: 'effect/\x74\x5f\xba\xae\xc6\xa8\xb1\xe8',
			attachedEntity: true
		}
	],

	272: [
		{
			//EF_STRIPHELM	Divest Helm
			type: 'STR',
			file: 'strip_helm',
			wav: 'effect/\x74\x5f\xba\xae\xc6\xa8\xb1\xe8',
			attachedEntity: true
		}
	],

	274: [
		{
			//EF_RG_COIN	   Steal Coin Animation
			type: '2D',
			overlay: true,
			file: 'effect/coin_a.bmp',
			blendMode: 2,
			alphaMax: 0.8,
			duplicate: 30,
			timeBetweenDupli: 50,
			duration: 1500,
			fadeOut: true,
			posxEndRand: 10,
			posyEndRand: 10,
			posz: 2,
			size: 20,
			rotateToTarget: true,
			attachedEntity: true
		},
		{
			wav: 'effect/rog_steal coin'
		}
	],

	275: [
		{
			//backstab on target hit	//EF_BACKSTAP	Back Stab Animation
			wav: 'effect/rog_back stap',
			attachedEntity: true
		}
	],

	276: [
		{
			//Sightless Mind	//EF_TEIHIT3	Sightless Mind (RG_RAID)
			type: '3D',
			duplicate: 20,
			timeBetweenDupli: 0,
			file: 'effect/lens1.tga',
			delayStart: 100,
			duration: 550,
			alphaMax: 0.8,
			fadeIn: true,
			fadeOut: true,
			posxStart: 0,
			posyStart: 0,
			posxEndRand: 40,
			posyEndRand: 40,
			sizeStartX: 10,
			sizeStartY: 150,
			sizeEndX: 10,
			sizeEndY: 150,
			blendMode: 2,
			attachedEntity: true,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			overlay: true,
			rotateToTarget: true,
			rotateWithCamera: true
		}
	],

	604: [
		{
			//EF_NPC_STOP2	Close Confine (Ground Effect)
			type: 'SPR',
			file: 'cconfine',
			attachedEntity: true,
			wav: 'effect/ef_hit6',
			stopAtEnd: true
		}
	]
};
