/**
 * @module DB/Effects/Table/Jobs/Acolyte/HighPriest
 *
 * The Acolyte line's HighPriest effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	374: [
		// EF_BOTTOM_BASILICA
		{
			// F1=1, GI[0] - Alpha 32, Height 14.0
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 2.45,
			topSize: 2.45,
			height: 2.0,
			alphaMax: 32 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			duration: 20000,
			attachedEntity: true
		},
		{
			// F1=1, GI[1] - Alpha 32, Height 14.4
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 2.52,
			topSize: 2.52,
			height: 2.1,
			alphaMax: 32 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 10,
			duration: 20000,
			attachedEntity: true
		},
		{
			// F1=1, GI[2] - Alpha 15, Distance 26.6
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 2.6,
			topSize: 2.6,
			height: 2.0,
			alphaMax: 15 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 26.6,
			duration: 20000,
			attachedEntity: true
		},
		{
			// F1=1, GI[3] - Alpha 15, Distance 79.8 (53.2+26.6)
			type: 'CYLINDER',
			textureName: 'alpha_down',
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 2.6,
			topSize: 2.6,
			height: 2.0,
			alphaMax: 15 / 255,
			blendMode: 2,
			rotateWithCamera: true,
			angleY: 79.8,
			duration: 20000,
			attachedEntity: true
		}
	],

	//427: [{}],	//EF_ASURABODY_MONSTER	   (Nothing)
	//428: [{}],	//EF_HITLINE3	   (Nothing)
	//429: [{}],	//EF_HITLINE4	   Taekwon Kick Hit 1
	//430: [{}],	//EF_HITLINE5	   Taekwon Kick Hit 2
	//431: [{}],	//EF_HITLINE6	   Taekwon Kick Hit 3
	//432: [{}],	//EF_ELECTRIC	   Solar, Lunar and Stellar Perception (Visual Effect)
	//433: [{}],	//EF_ELECTRIC2	   Solar, Lunar and Stellar Opposition (Visual Effect)
	//434: [{}],	//EF_HITLINE7	   Taekwon Kick Hit 4
	//435: [{}],	//EF_STORMKICK	   Whirlwind Kick
	//436: [{}],	//EF_HALFSPHERE	   White Barrier (Unused)
	//437: [{}],	//EF_ATTACKENERGY	   White barrier 2 (Unused)
	//438: [{}],	//EF_ATTACKENERGY2	   Kaite Reflect Animation
	//439: [{}],	//EF_CHEMICAL3	   Flying Side Kick

	440: [
		{
			//EF_ASSUMPTIO2	Assumptio (Animation)
			type: 'STR',
			file: 'asum',
			wav: 'effect/\xbe\xc6\xbc\xfb\xc7\xc1\xc6\xbc\xbf\xc0',
			attachedEntity: true
		}
	]
};
