/**
 * @module DB/Effects/Table/Common/Effects0700
 *
 * Effects 0700 to 799 of the effect table that no single class's skills
 * use: shared rows, monsters, items, statuses. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

export default {
	//700: [{}],	//EF_MAPSPHERE2	   Big Colored Green Sphere.
	//701: [{}],	//EF_GLOW11	   Huge Blue Sphere
	//702: [{}],	//EF_GLOW12	   Little Colored Violet Sphere
	//703: [{}],	//EF_CIRCLELIGHT	   Light Infiltration with fall of pownder

	704: [
		{
			//EF_ITEM315	Client Error (mobile_ef02.str)
			type: 'STR',
			file: 'mobile_ef02',
			attachedEntity: true
		}
	],

	705: [
		{
			//EF_ITEM316	Client Error (mobile_ef01.str)
			type: 'STR',
			file: 'mobile_ef01',
			attachedEntity: true
		}
	],

	706: [
		{
			//EF_ITEM317	Client Error (mobile_ef03.str)
			type: 'STR',
			file: 'mobile_ef03',
			attachedEntity: true
		}
	],

	//707: [{}],	//EF_ITEM318	   Client Crash :P

	708: [
		{
			//EF_STORM_MIN	Storm Gust (same as 89)
			type: 'STR',
			file: 'storm_min',
			wav: 'effect/wizard_stormgust',
			attachedEntity: true
		}
	],

	709: [
		{
			//EF_POK_JAP	A Firework that split in 4 mini fireworks
			type: 'STR',
			file: 'pokjuk_jap',
			attachedEntity: false
		}
	],

	//710: [{}],	//EF_MAP_GREENLIGHT	   A Sphere like Effect 701 but Green, and a bit more larger
	//711: [{}],	//EF_MAP_MAGICWALL	   A big violet wall
	//712: [{}],	//EF_MAP_GREENLIGHT2	   A Little Flame Sphere
	//713: [{}],	//EF_YELLOWFLY1	   A lot of Very Small and Yellow Sphere
	//714: [{}],	//EF_YELLOWFLY2	   (Nothing)
	715: [
		// EF_BOTTOM_BLUE - Little blue Basilica
		{
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 1.5,
			topSize: 1.5,
			height: 2.0,
			alphaMax: 40 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			red: 0.2,
			green: 0.6,
			blue: 1.0,
			duration: 20000,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 1.58,
			topSize: 1.58,
			height: 2.1,
			alphaMax: 32 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 10,
			red: 0.2,
			green: 0.6,
			blue: 1.0,
			duration: 20000,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 1.65,
			topSize: 1.65,
			height: 2.0,
			alphaMax: 15 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 26.6,
			red: 0.1,
			green: 0.4,
			blue: 1.0,
			duration: 20000,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 1.65,
			topSize: 1.65,
			height: 2.0,
			alphaMax: 15 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 79.8,
			red: 0.1,
			green: 0.4,
			blue: 1.0,
			duration: 20000,
			attachedEntity: true
		}
	],

	716: [
		// EF_BOTTOM_BLUE2 - Little blue Basilica
		{
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 1.5,
			topSize: 1.5,
			height: 2.0,
			alphaMax: 40 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			red: 0.2,
			green: 0.6,
			blue: 1.0,
			duration: 20000,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 1.58,
			topSize: 1.58,
			height: 2.1,
			alphaMax: 32 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 10,
			red: 0.2,
			green: 0.6,
			blue: 1.0,
			duration: 20000,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 1.65,
			topSize: 1.65,
			height: 2.0,
			alphaMax: 15 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 26.6,
			red: 0.1,
			green: 0.4,
			blue: 1.0,
			duration: 20000,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 1.65,
			topSize: 1.65,
			height: 2.0,
			alphaMax: 15 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 79.8,
			red: 0.1,
			green: 0.4,
			blue: 1.0,
			duration: 20000,
			attachedEntity: true
		}
	],

	717: [
		{
			//EF_WEWISH	Christmas Carol (copy of Angelus)
			type: 'STR',
			file: 'angelus',
			wav: 'effect/wewish',
			min: 'jong_mini',
			attachedEntity: true
		}
	],

	719: [
		{
			//EF_FORESTLIGHT5	   Renovatio (light beam)
			wav: 'effect/ab_renovation'
		}
	],

	747: [
		{
			//EF_LAULAMUS_STR	Falling white feathers
			type: 'STR',
			file: 'laulamus',
			attachedEntity: true
		}
	],

	748: [
		{
			//EF_LAUAGNUS_STR	Falling blue feathers
			type: 'STR',
			file: 'lauagnus',
			attachedEntity: true
		}
	],

	//757: [{}],	//EF_CIRCLEPOWER	   Third Class Aura (Middle)
	758: [
		{
			//EF_ROLLING1	   Rolling Cutter - Spin Count 1
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd1.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd1.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd1.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd1.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd1.tga'
		}
	],

	759: [
		{
			//EF_ROLLING2	   Rolling Cutter - Spin Count 2
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd2.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd2.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd2.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd2.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd2.tga'
		}
	],

	760: [
		{
			//EF_ROLLING3	   Rolling Cutter - Spin Count 3
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd3.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd3.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd3.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd3.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd3.tga'
		}
	],

	761: [
		{
			//EF_ROLLING4	   Rolling Cutter - Spin Count 4
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd4.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd4.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd4.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd4.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd4.tga'
		}
	],

	762: [
		{
			//EF_ROLLING5	   Rolling Cutter - Spin Count 5
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd5.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd5.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd5.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd5.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd5.tga'
		}
	],

	763: [
		{
			//EF_ROLLING6	   Rolling Cutter - Spin Count 6
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd6.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd6.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd6.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd6.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd6.tga'
		}
	],

	764: [
		{
			//EF_ROLLING7	   Rolling Cutter - Spin Count 7
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd7.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd7.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd7.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd7.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd7.tga'
		}
	],

	765: [
		{
			//EF_ROLLING8	   Rolling Cutter - Spin Count 8
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd8.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd8.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd8.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd8.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd8.tga'
		}
	],

	766: [
		{
			//EF_ROLLING9	   Rolling Cutter - Spin Count 9
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd9.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd9.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd9.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd9.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd9.tga'
		}
	],

	767: [
		{
			//EF_ROLLING10	   Rolling Cutter - Spin Count 10
			alphaMax: 1,
			blendMode: 1,
			red: 1.0,
			green: 1.0,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 200,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd10.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.7,
			green: 0.7,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 220,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd10.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.5,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 240,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd10.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.3,
			green: 0.3,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 260,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd10.tga'
		},
		{
			alphaMax: 0.2,
			blendMode: 2,
			red: 0.1,
			green: 0.1,
			blue: 1.0,
			attachedEntity: true,
			duration: 1000,
			fadeIn: true,
			fadeOut: true,
			posz: 4,
			sizeEnd: 20,
			sizeSmooth: true,
			sizeStart: 280,
			type: '3D',
			zIndex: 10,
			file: 'effect/\xc8\xb8\xc0\xfc\xc4\xab\xbf\xee\xc5\xcd10.tga'
		}
	]
};
