/**
 * @module DB/Effects/Table/Jobs/Mage/HighWizard
 *
 * The Mage line's HighWizard effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Camera from 'Renderer/Camera.js';

export default {
	217: [
		{
			//EF_ENERGYDRAIN (Wizard Soul Drain)
			type: '3D',
			duration: 600,
			duplicate: 5,
			timeBetweenDupli: 0,
			absoluteSpriteName: 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/particle1',
			playSprite: true,

			toSrc: true,
			rotateToTarget: true,

			// Dark Blue
			red: 0.4,
			green: 0.4,
			blue: 1.0,

			sizeStart: 150.0,
			sizeEnd: 180.0,

			zOffsetStart: 5,
			arc: 3.0,
			retreat: 3.0,
			drainPattern: true
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					// Wait for drain particles from Part 1 (Soul Drain travel)
					if (tick < 500) {
						return false;
					}

					const time = tick - 500;

					// Part 2: Blue tint progression (200ms duration from official source)
					if (time < 200) {
						// Formula from official source: m_master->SetArgb(-1, 255-(m_stateCnt+50), 255-(m_stateCnt+50), 255)
						const val = (255 - (time + 50)) / 255;
						entity._flashColor[0] = val;
						entity._flashColor[1] = val;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
						return false;
					}

					// Part 3: Smooth fade back to normal (200ms) for premium feel
					if (time < 400) {
						const progress = (time - 200) / 200;
						const startVal = 5 / 255; // 255 - (200 + 50)
						const val = startVal + (1.0 - startVal) * progress;
						entity._flashColor[0] = val;
						entity._flashColor[1] = val;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
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
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				// make target blue
				const entity = Params.Init.otherEntity;
				if (!entity) return true;
				entity.animations.add(function (tick) {
					const time = tick;

					// Part 1: Blue tint progression (200ms duration from official source)
					if (time < 200) {
						// Formula from official source: m_master->SetArgb(-1, 255-(m_stateCnt+50), 255-(m_stateCnt+50), 255)
						const val = (255 - (time + 50)) / 255;
						entity._flashColor[0] = val;
						entity._flashColor[1] = val;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
						return false;
					}

					// Part 2: Smooth fade back to normal (200ms) for premium feel
					if (time < 400) {
						const progress = (time - 200) / 200;
						const startVal = 5 / 255; // 255 - (200 + 50)
						const val = startVal + (1.0 - startVal) * progress;
						entity._flashColor[0] = val;
						entity._flashColor[1] = val;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
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

	380: [
		{
			//EF_MAGICCRASHER	   Magic Crasher
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					if (tick < 1000) {
						if (tick > 500) {
							entity._flashColor[0] = Math.random();
							entity._flashColor[1] = Math.random();
							entity._flashColor[2] = Math.random();
							entity._flashColor[3] = 0.6;
							entity.recalculateBlendingColor();
						}
					} else {
						entity._flashColor[0] = 1;
						entity._flashColor[1] = 1;
						entity._flashColor[2] = 1;
						entity._flashColor[3] = 1;
						entity.recalculateBlendingColor();
						return true;
					}
				});
			},
			wav: 'effect/\xb8\xc5\xc1\xf7\x20\xc5\xa9\xb7\xa1\xbd\xac'
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 300;
				Camera.setQuake(start);
			}
		}
	],

	ef_magicpower: [
		{
			wav: 'effect/\xb8\xb6\xb9\xfd\xb7\xc2\x20\xc1\xf5\xc6\xf8',
			attachedEntity: true
		}
	]
};
