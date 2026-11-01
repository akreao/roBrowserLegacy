/**
 * @module DB/Effects/Table/Jobs/Swordman/LordKnight
 *
 * The Swordman line's LordKnight effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//338: [{}],	//EF_ANGEL2	   Super Novice/Taekwon Level Up Angel

	'339_beforecast': [
		{
			//EF_MAGNUM2	   Spiral Pierce
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;
				entity._flashColor[0] = 1.0;
				entity._flashColor[1] = 1.0;
				entity._flashColor[2] = 1.0;
				entity._flashColor[3] = 1.0;
				entity.recalculateBlendingColor();

				entity.animations.add(function (tick) {
					if (!entity.cast.display) {
						//we don't know cast time here so.. let's hack
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
						return true;
					}
					entity._flashColor[1] = 0.0 + Math.sin(tick / (6 * Math.PI));
					entity._flashColor[2] = 0.0 + Math.sin(tick / (6 * Math.PI));
					entity.recalculateBlendingColor();
				});
			}
		}
	],

	339: [
		{
			//EF_MAGNUM2	   Spiral Pierce
			wav: 'permeter_attack'
		},
		{
			wav: 'effect/ef_magnumbreak',
			delayWav: 300
		}
	],

	367: [
		{
			//aura blade	//EF_AURABLADE	Aura Blade
			wav: 'effect/\xbf\xc0\xb6\xf3\x20\xba\xed\xb7\xb9\xc0\xcc\xb5\xe5', //żŔ¶ó şí·ąŔĚµĺ
			attachedEntity: true
			//+ on cast small white-magic aura (double)
		}
	],

	368: [
		{
			//EF_REDBODY	Berserk
			wav: 'effect/\xb9\xf6\xbc\xad\xc5\xa9',
			attachedEntity: true
			//shake screen
		}
	],

	369: [
		{
			//EF_LKCONCENTRATION	Concentration
			type: 'STR',
			file: 'twohand',
			wav: 'effect/knight_twohandquicken',
			head: true,
			attachedEntity: true
		}
	],
	399: [
		{
			//headcrush caster	//EF_BASH3D3	Head Crush
			wav: 'effect/\xc7\xec\xb5\xe5\x20\xc5\xa9\xb7\xaf\xbd\xac', //Çìµå Å©·¯½¬
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					// Enable halo (BL_DOUBLE_BODY actor)
					entity._enableHalo = true;

					if (tick < 200) {
						const val = (255 - (tick + 50)) / 255;
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = val;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
						return false;
					}

					if (tick < 500) {
						const progress = (tick - 200) / 300;
						const startVal = 5 / 255; // 255 - (200 + 50)
						const val = startVal + (1.0 - startVal) * progress;
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = val;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
						return false;
					}

					// Final reset
					entity._enableHalo = false;
					entity._flashColor[0] = 1.0;
					entity._flashColor[1] = 1.0;
					entity._flashColor[2] = 1.0;
					entity._flashColor[3] = 1.0;
					entity.recalculateBlendingColor();
					return true;
				});
			}
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			delayStart: 500,
			duplicate: 6,
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
			duplicate: 6,
			delayStart: 500,
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

	400: [
		{
			//joint beat caster	//EF_BASH3D4	Joint Beat
			wav: 'effect/\xba\xf1\xc6\xae\x20\xc1\xb6\xc0\xce\xc6\xae', // ºñÆ® Á¶ÀÎÆ®
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					// Official: Halo (Double Body) is active between state 20 and 50.
					// Scaling to ms (approx 200ms to 500ms).
					if (tick >= 150 && tick <= 500) {
						entity._enableHalo = true;
					} else {
						entity._enableHalo = false;
					}
					return tick > 600;
				});
			}
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			delayStart: 500,
			duplicate: 6,
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
			duplicate: 6,
			delayStart: 500,
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

	charge_attack: [
		{
			//charge attack (quest-skill)
			//same effect on target like 'Bash'
			attachedEntity: true
		}
	],

	spear_hit_sound: [
		{
			wav: '_hit_spear',
			attachedEntity: true
		}
	]
};
