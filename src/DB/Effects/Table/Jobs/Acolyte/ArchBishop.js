/**
 * @module DB/Effects/Table/Jobs/Acolyte/ArchBishop
 *
 * The Acolyte line's ArchBishop effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	313: [
		{
			//EF_HEAL2	   Heal Effect 2
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.7,
			bottomSize: 1.1,
			duration: 1500,
			fade: true,
			green: 1,
			height: 15,
			red: 0.7,
			rotate: true,
			textureName: 'ring_white',
			topSize: 1.1,
			type: 'CYLINDER',
			wav: '_heal_effect'
		},
		{
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.7,
			bottomSize: 1,
			duration: 1500,
			fade: true,
			green: 1,
			height: 13,
			red: 0.7,
			rotate: true,
			textureName: 'ring_white',
			topSize: 1,
			type: 'CYLINDER',
			wav: '_heal_effect'
		},
		{
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.7,
			bottomSize: 1.1,
			duration: 1500,
			fade: true,
			green: 1,
			height: 2,
			red: 0.7,
			rotate: true,
			textureName: 'ring_white',
			topSize: 3,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			duration: 1500,
			duplicate: 4,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1.2,
			posyRand: 1.2,
			poszEndRand: 1,
			poszEndRandMiddle: 8,
			poszStart: 0,
			red: 1,
			size: 9,
			sizeRand: 2,
			sparkling: true,
			sparkNumber: 2,
			timeBetweenDupli: 10,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			duration: 1300,
			delayOffset: 400,
			duplicate: 20,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1.5,
			posyRand: 1.5,
			poszEndRand: 3,
			poszEndRandMiddle: 6,
			poszStart: 0,
			red: 1,
			size: 9,
			sizeRand: 2,
			sparkling: true,
			sparkNumber: 2,
			timeBetweenDupli: 10,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			duration: 1100,
			delayLate: 200,
			duplicate: 10,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1,
			posyRand: 1,
			poszEnd: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 0,
			red: 1,
			size: 9,
			sizeRand: 2,
			timeBetweenDupli: 50,
			type: '3D',
			zIndex: 1
		}
	],
	//322: [{}],	//EF_FORESTLIGHT2	   Forest Light 2
	//323: [{}],	//EF_FORESTLIGHT3	   Forest Light 3
	//324: [{}],	//EF_FORESTLIGHT4	   Forest Light 4
	325: [
		{
			//EF_HEAL4	   Heal Effect 4
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.7,
			bottomSize: 1.1,
			duration: 1500,
			fade: true,
			green: 1,
			height: 18,
			red: 0.7,
			rotate: true,
			textureName: 'ring_white',
			topSize: 1.1,
			type: 'CYLINDER',
			wav: '_heal_effect'
		},
		{
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.7,
			bottomSize: 1,
			duration: 1500,
			fade: true,
			green: 1,
			height: 15,
			red: 0.7,
			rotate: true,
			textureName: 'ring_white',
			topSize: 1,
			type: 'CYLINDER',
			wav: '_heal_effect'
		},
		{
			alphaMax: 0.3,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.7,
			bottomSize: 1.1,
			duration: 1500,
			fade: true,
			green: 1,
			height: 3,
			red: 0.7,
			rotate: true,
			textureName: 'ring_white',
			topSize: 3,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			duration: 1500,
			duplicate: 7,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1.2,
			posyRand: 1.2,
			poszEndRand: 1,
			poszEndRandMiddle: 8,
			poszStart: 0,
			red: 1,
			size: 9,
			sizeRand: 2,
			sparkling: true,
			sparkNumber: 3,
			timeBetweenDupli: 10,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			duration: 1300,
			delayOffset: 400,
			duplicate: 25,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1.5,
			posyRand: 1.5,
			poszEndRand: 3,
			poszEndRandMiddle: 6,
			poszStart: 0,
			red: 1,
			size: 10,
			sizeRand: 5,
			sparkling: true,
			sparkNumber: 3,
			timeBetweenDupli: 10,
			type: '3D',
			zIndex: 1
		},
		{
			alphaMax: 0.8,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			duration: 1100,
			delayLate: 200,
			duplicate: 15,
			fadeIn: true,
			fadeOut: true,
			file: 'effect/pok3.tga',
			green: 1,
			posxRand: 1,
			posyRand: 1,
			poszEnd: 6,
			poszStartRand: 1,
			poszStartRandMiddle: 0,
			red: 1,
			size: 11,
			sizeRand: 2,
			timeBetweenDupli: 50,
			type: '3D',
			zIndex: 1
		}
	],

	718: [
		{
			//EF_FIREPILLARON2	   Judex (Visual Effect)
			wav: 'effect/ab_judex'
		},
		{
			type: 'CYLINDER',
			attachedEntity: false,
			topSize: 0.5,
			bottomSize: 0.4,
			textureName: 'ring_white',
			height: 3.5,
			duration: 1000,
			rotate: true
		},
		{
			type: 'CYLINDER',
			attachedEntity: false,
			topSize: 0.75,
			bottomSize: 0.45,
			textureName: 'ring_white',
			height: 2.5,
			duration: 1000,
			rotate: true
		},
		{
			type: 'CYLINDER',
			attachedEntity: false,
			topSize: 1,
			bottomSize: 0.5,
			textureName: 'ring_white',
			height: 1.5,
			duration: 1000,
			rotate: true
		}
	],
	//720: [{}],	//EF_SOULBREAKER3	   Yellow version of Soul Breaker

	721: [
		{
			//EF_ADO_STR	Adoramus (lightning bolt)
			type: 'STR',
			file: 'ado',
			wav: 'effect/ab_adoramus',
			attachedEntity: true
		}
	],

	//751: [{}],	//EF_FIREBALL2	   Releasing summoned warlock spheres
	//752: [{}],	//EF_BUNSINJYUTSU2	   Like Energy Coat, but not as dark
	//753: [{}],	//EF_CLEARTIME	   Clearance

	754: [
		{
			//EF_GLASSWALL3	   Green warp portal (root of Epiclesis)
			alphaMax: 0.4,
			animation: 4,
			attachedEntity: true,
			blendMode: 2,
			red: 0.6,
			green: 1.0,
			blue: 0.6,
			bottomSize: 2.4,
			duration: 500,
			duplicate: 150,
			fadeOut: true,
			height: 0.1,
			posZ: 0.1,
			rotate: true,
			textureName: 'magic_green',
			timeBetweenDupli: 200,
			topSize: 3.9,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.4,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			red: 0.6,
			green: 1.0,
			blue: 0.6,
			bottomSize: 0.6,
			duration: 30000,
			fade: true,
			height: 7,
			rotate: true,
			textureName: 'magic_green',
			topSize: 0.6,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.4,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			red: 0.6,
			green: 1.0,
			blue: 0.6,
			bottomSize: 0.8,
			duration: 30000,
			fade: true,
			height: 6,
			rotate: true,
			textureName: 'magic_green',
			topSize: 0.8,
			type: 'CYLINDER'
		},
		{
			alphaMax: 0.5,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			red: 0.6,
			green: 1.0,
			blue: 0.6,
			bottomSize: 1,
			duration: 30000,
			fade: true,
			height: 1,
			posZ: 2,
			rotate: true,
			totalCircleSides: 20,
			circleSides: 10,
			repeatTextureX: 2,
			textureName: 'alpha1',
			topSize: 1,
			type: 'CYLINDER'
		}
	],

	//880: [{}],	//EF_BEGINSPELL_150	   Bluish castish cone
	//881: [{}],	//EF_LEVEL99_150	   Blue aura
	//882: [{}],	//EF_PRIMECHARGE	   Whirl of fireflies (red)

	883: [
		{
			//EF_GLASSWALL4	   Epiclesis (transparent green tree)
			type: '3D',
			alphaMax: 0.6,
			attachedEntity: true,
			blendMode: 2,
			duration: 30000,
			red: 0.0001,
			green: 1.0,
			blue: 0.0001,
			size: 400,
			posz: 7,
			zIndex: 1,
			wav: 'effect/ef_readyportal',
			file: 'effect/ef_epitree.tga'
		},
		{
			type: '3D',
			alphaMax: 0.6,
			attachedEntity: true,
			blendMode: 2,
			duration: 990,
			duplicate: 15,
			timeBetweenDupli: 2000,
			red: 0.0001,
			green: 1.0,
			blue: 0.0001,
			sizeStart: 380,
			sizeEnd: 420,
			posz: 7,
			zIndex: 1,
			file: 'effect/ef_epitree.tga'
		},
		{
			type: '3D',
			alphaMax: 0.6,
			attachedEntity: true,
			blendMode: 2,
			duration: 990,
			duplicate: 15,
			timeBetweenDupli: 2000,
			delayOffset: 1000,
			red: 0.0001,
			green: 1.0,
			blue: 0.0001,
			sizeStart: 420,
			sizeEnd: 380,
			posz: 7,
			zIndex: 1,
			file: 'effect/ef_epitree.tga'
		}
	],

	1047: [
		{
			//EF_AB_OFFERTORIUM
			type: 'STR',
			file: 'ab_offertorium',
			wav: 'effect/ab_offertorium',
			attachedEntity: true
		}
	],

	ef_ancilla: [
		{
			wav: 'effect/ab_ancilla',
			attachedEntity: true
		}
	],

	ef_duplelight: [
		{
			wav: 'effect/ab_duplelight',
			attachedEntity: true
		}
	],

	// Secrament (AB_SECRAMENT), from the client's own effect folders.
	ef_ab_secrament: [
		{
			type: 'STR',
			file: 'new_secrament/new_secrament/new_secrament',
			texturePath: 'new_secrament/new_secrament/'
		}
	]
};
