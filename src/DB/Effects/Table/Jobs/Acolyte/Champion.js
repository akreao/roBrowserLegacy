/**
 * @module DB/Effects/Table/Jobs/Acolyte/Champion
 *
 * The Acolyte line's Champion effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Camera from 'Renderer/Camera.js';

export default {
	//375: [{}],	//EF_ASSUMPTIO	   Assumptio (Visual Effect)
	376: [
		{
			//EF_HITLINE2	   Palm Strike
			wav: 'effect/\xb8\xcd\xc8\xa3\xb0\xe6\xc6\xc4\xbb\xea'
		}
	],
	377: [
		{
			//martyr's reckoning 2	//EF_BASH3D2	   Martyr's Reckoning 2
			wav: 'effect/\x6d\x6f\x6e\x5f\xc6\xf8\xb1\xe2', //mon_¿¬È¯? can be incorrect wav name
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					// Official: Halo (Double Body) is active between tick 5 and 35.
					entity._enableHalo = tick >= 50 && tick <= 350;

					if (tick >= 50 && tick <= 350) {
						// SetArgb(-1, 255, 100, 100) -> Red
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 0.39;
						entity._flashColor[2] = 0.39;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
					} else {
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
					}
					return tick > 400;
				});
			}
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			delayStart: 50,
			duplicate: 8,
			timeBetweenDupli: 0,
			totalCircleSides: 30,
			circleSides: 1,
			fade: true,
			angleX: -90,
			angleZRandom: 360,
			fixedPerspective: true,
			posZ: 1.5,
			height: 0,
			bottomSize: 0.01,
			topSize: 4.5,
			animation: 2,
			zIndex: 1.1,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			duplicate: 8,
			delayStart: 50,
			timeBetweenDupli: 0,
			totalCircleSides: 30,
			circleSides: 1,
			fade: true,
			angleX: -90,
			angleZRandom: 360,
			fixedPerspective: true,
			posZ: 1.5,
			height: 0,
			bottomSize: 0.01,
			topSize: 7.2,
			animation: 2,
			zIndex: 1.2,
			attachedEntity: true
		}
	],

	//401: [{}],	//EF_NAPALMVALCAN	   Napalm Vulcan Sound
	402: [
		//EF_PORTAL5	   Dangerous Soul Collect
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					const time = tick;

					if (time < 200) {
						entity._flashColor[0] = 1.0; // Red
						entity._flashColor[1] = 1.0; // Green
						entity._flashColor[2] = 0.0; // Blue
						entity._flashColor[3] = 0.1; // Alpha (10%)
						entity.recalculateBlendingColor();
						return false;
					}

					// Part 2: Smooth fade back to normal
					if (time < 800) {
						const progress = (time - 200) / 600;
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = 0.0 + 1.0 * progress;
						entity._flashColor[3] = 0.1 + 0.9 * progress;
						entity.recalculateBlendingColor();
						return false;
					}

					// Final reset
					entity._flashColor[0] = 1.0;
					entity._flashColor[1] = 1.0;
					entity._flashColor[2] = 1.0;
					entity._flashColor[3] = 1.0;
					entity.recalculateBlendingColor();
					return true;
				});
			}
		}
	],
	//511: [{}],	//EF_NIGHT	   (Nothing)

	512: [
		{
			//EF_CHEMICAL2DASH	   Chain Crush Combo
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 132;
				Camera.setQuake(start);
			}
		}
	]
};
