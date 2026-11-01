/**
 * @module DB/Effects/Table/Jobs/Swordman/Crusader
 *
 * The Swordman line's Crusader effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//221: [{}],	//EF_POTIONPILLAR	   Intense light beam

	222: [
		{
			//EF_DEFENDER	   Defender (Crusader)
			type: 'CYLINDER',
			alphaMax: 0.6,
			animation: 1,
			blendMode: 8,
			bottomSize: 1.5,
			topSize: 1.5,
			duration: 3000,
			fade: true,
			height: 10,
			rotate: true,
			textureName: 'ring_black',
			attachedEntity: true
		}
	],

	//223: [{}],	//EF_GANBANTEIN	   Holy Cast Aura
	//224: [{}],	//EF_WIND	   Wind (Map effect)
	//225: [{}],	//EF_VOLCANO	   Volcano casting effect

	226: [
		{
			//EF_GRANDCROSS	   Grand Cross Effect
			type: 'CYLINDER', // Center
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500
		},
		{
			type: 'CYLINDER', // West
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: -1
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: -2
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: -3
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: -4
		},
		{
			type: 'CYLINDER', // East
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: 1
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: 2
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: 3
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: 4
		},
		{
			type: 'CYLINDER', // North
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posY: 1
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posY: 2
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posY: 3
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posY: 4
		},
		{
			type: 'CYLINDER', // South
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posY: -1
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posY: -2
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posY: -3
		},
		{
			type: 'CYLINDER',
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posY: -4
		},
		{
			type: 'CYLINDER', // NE
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: 1,
			posY: 1
		},
		{
			type: 'CYLINDER', // SE
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: 1,
			posY: -1
		},
		{
			type: 'CYLINDER', // SW
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: -1,
			posY: -1
		},
		{
			type: 'CYLINDER', // NW
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			topSize: 0.7,
			bottomSize: 0.7,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 45,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: -1,
			posY: 1
		},
		{
			type: 'CYLINDER', // NE arc
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 20,
			circleSides: 5,
			topSize: 3,
			bottomSize: 3,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: -180,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: 3.5,
			posY: 3.5
		},
		{
			type: 'CYLINDER', // SE arc
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 20,
			circleSides: 5,
			topSize: 3,
			bottomSize: 3,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 90,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: 3.5,
			posY: -3.5
		},
		{
			type: 'CYLINDER', // SW arc
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 20,
			circleSides: 5,
			topSize: 3,
			bottomSize: 3,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: 0,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: -3.5,
			posY: -3.5
		},
		{
			type: 'CYLINDER', // NW arc
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: false,
			blendMode: 2,
			totalCircleSides: 20,
			circleSides: 5,
			topSize: 3,
			bottomSize: 3,
			duration: 1000,
			fade: true,
			height: 5,
			rotate: false,
			angleY: -90,
			textureName: 'ring_red',
			duplicate: 3,
			timeBetweenDupli: 500,
			posX: -3.5,
			posY: 3.5
		},
		{
			wav: 'effect/cru_grand cross'
		}
	],

	245: [
		{
			//EF_HOLYCROSS	Holy Cross
			type: 'STR',
			file: 'holy_cross',
			wav: 'effect/cru_holy cross',
			attachedEntity: true
		}
	],

	246: [
		{
			//EF_SHIELDCHARGE	Shield Charge
			type: 'STR',
			file: 'shield_charge',
			attachedEntity: true
		}
	],

	//247: [{}],	//EF_MAPPILLAR2	   Map Light Pillar Animation 2

	248: [
		{
			//EF_PROVIDENCE	Resistant Souls
			type: 'STR',
			file: 'providence',
			attachedEntity: true
		}
	],

	249: [
		{
			//EF_SHIELDBOOMERANG	Shield Boomerang
			wav: 'effect/cru_shield boomerang'
		}
	],

	250: [
		{
			//EF_SPEARQUICKEN	   Spear Quicken
			type: 'STR',
			file: 'twohand',
			wav: 'effect/knight_twohandquicken',
			head: true,
			attachedEntity: true
		}
	],

	251: [
		{
			//EF_DEVOTION	Devotion
			type: 'STR',
			file: 'devotion',
			attachedEntity: true
		}
	],

	252: [
		{
			//EF_REFLECTSHIELD	   Reflect Shield
			type: 'CYLINDER',
			alphaMax: 0.6,
			animation: 1,
			blendMode: 8,
			bottomSize: 1.5,
			topSize: 1.5,
			duration: 3000,
			fade: true,
			height: 10,
			rotate: true,
			textureName: 'ring_yellow',
			attachedEntity: true
		}
	]
};
