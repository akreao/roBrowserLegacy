/**
 * @module DB/Effects/Table/Jobs/Mage/Professor
 *
 * The Mage line's Professor effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import SpiderWeb from 'Renderer/Effects/SpiderWeb.js';

export default {
	378: [
		{
			//EF_ENERGYDRAIN2          Energy Drain (1st Part)
			type: '3D',
			duration: 600,
			duplicate: 5,
			timeBetweenDupli: 0,
			absoluteSpriteName: 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/particle1',
			playSprite: true,

			fromSrc: true,
			toSrc: true,
			rotateToTarget: true,

			// Cyan (Based on C++ random(81) + 160 simplified here)
			red: 0.8,
			green: 0.8,
			blue: 1.0,

			sizeStart: 160.0,
			sizeEnd: 190.0,

			zOffsetStart: 5,
			arc: 3.0,
			retreat: 3.0,
			drainPattern: true
		}
	],
	379: [
		{
			//EF_TRANSBLUEBODY	   Energy Drain (2nd Part)
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

					// Enable halo (BL_DOUBLE_BODY actor)
					entity._enableHalo = true;

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
					entity._enableHalo = false;
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

	383: [
		{
			//EF_ENERGYDRAIN3 (Health Conversion)
			type: '3D',
			duration: 600,
			duplicate: 5,
			timeBetweenDupli: 0,
			absoluteSpriteName: 'data/sprite/\xc0\xcc\xc6\xd1\xc6\xae/particle1',
			playSprite: true,

			fromSrc: true,
			toSrc: true,
			rotateToTarget: true,

			// Green
			red: 0.7,
			green: 1.0,
			blue: 0.7,

			sizeStart: 140.0,
			sizeEnd: 170.0,

			zOffsetStart: 5,
			arc: 3.0,
			retreat: 3.0,
			drainPattern: true
		}
	],

	384: [
		{
			//EF_LINELINK2	   Soul Change (Sound Effect)
			wav: 'effect/\xbc\xd2\xbf\xef\x20\xc3\xbc\xc0\xce\xc1\xf6',
			attachedEntity: true
		}
	],

	403: [
		{
			//EF_MAGICCRASHER2	   Mind Breaker
			type: 'FUNC',
			attachedEntity: true,
			func: function EffectBodyColor(Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					if (tick < 1000) {
						entity._flashColor[0] = Math.random();
						entity._flashColor[1] = Math.random();
						entity._flashColor[2] = Math.random();
						entity.recalculateBlendingColor();
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
			wav: 'effect/swordman_provoke'
		}
	],

	404: [
		{
			//EF_BOTTOM_SPIDER	Fiber Lock
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				this.add(new SpiderWeb(Params.Inst.position, Params.Inst.startTick), Params);
			}
		}
	],

	406: [
		{
			//EF_SOULBURN	Soul Burn
			type: 'STR',
			file: '\xbc\xd2\xbf\xef\xb9\xf8',
			attachedEntity: true
		}
	]
};
