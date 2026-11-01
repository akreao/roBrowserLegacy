/**
 * @module DB/Effects/Table/Common/Effects0800
 *
 * Effects 0800 to 899 of the effect table that no single class's skills
 * use: shared rows, monsters, items, statuses. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import SpiritSphere from 'Renderer/Effects/SpiritSphere.js';
import CastCone from 'Renderer/Effects/CastCone.js';

export default {
	830: [
		{
			//EF_BEGINSPELL_N1	   Blue aura (Arch Bishop cast animation)
			// The official client's two pulsing bubble crowns, light blue and white (CastConeSim.js).
			type: 'FUNC',
			attachedEntity: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCone(Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.duration, {
						pulse: true
					}),
					Params
				);
			}
		}
	],

	831: [
		{
			//EF_BEGINSPELL_N2	   Blue cone cast aura (Enchanting Sky)
			// The official client's bubble cone in blue, over two blue squares on the ground (CastConeSim.js).
			type: 'FUNC',
			attachedEntity: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCone(Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.duration, {
						variant: 0,
						ground: true
					}),
					Params
				);
			}
		}
	],

	833: [
		{
			//EF_CHOOKGI_N	   (Nothing) - Used for spheres (royal guard?)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const spiritNum = Params.Init.spiritNum || 0;
				const Spheres = new SpiritSphere(Params.Init.ownerEntity, spiritNum, false);
				this.add(Spheres, Params);
			}
		}
	],

	//834: [{}],	//EF_JOBLVUP50_2	   Light shooting away circlish
	//835: [{}],	//EF_CHEMICAL2DASH2	   Fastness yellow-reddish
	//836: [{}],	//EF_CHEMICAL2DASH3	   Fastness yellow-pinkish
	//837: [{}],	//EF_ROLLINGCAST	   Casting [S]
	//838: [{}],	//EF_WATER_BELOW	   Watery aura
	//839: [{}],	//EF_WATER_FADE	   [Client Error]

	840: [
		{
			//EF_BEGINSPELL_N3	   Red cone cast aura
			// The official client's bubble cone in red, with no squares on the ground (CastConeSim.js).
			type: 'FUNC',
			attachedEntity: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCone(Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.duration, {
						variant: 3
					}),
					Params
				);
			}
		}
	],

	//844: [{}],	//EF_BEGINSPELL_N7	   Purple cone

	845: [
		{
			//EF_BEGINSPELL_N8	   Turquoise cone cast aura (All in the Sky)
			// The official client's bubble cone in turquoise, with no squares on the ground (CastConeSim.js).
			type: 'FUNC',
			attachedEntity: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCone(Params.Init.ownerEntity.position, Params.Inst.startTick, Params.Init.duration, {
						variant: 8
					}),
					Params
				);
			}
		}
	],

	//884: [{}],	//EF_GRADIUS_LASER	   Green beam
	885: [
		{
			//bash3d6	//EF_BASH3D6	   Blue light beams (can be unnoficial)
			wav: 'effect/bash3d', // incorrect wav name
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				entity.animations.add(function (tick) {
					// Halo (Double Body) - Blue variant
					entity._enableHalo = tick >= 150 && tick <= 450;

					if (tick >= 150 && tick <= 450) {
						// Blue tint
						entity._flashColor[0] = 0.5;
						entity._flashColor[1] = 0.5;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
					} else {
						entity._flashColor[0] = 1.0;
						entity._flashColor[1] = 1.0;
						entity._flashColor[2] = 1.0;
						entity._flashColor[3] = 1.0;
						entity.recalculateBlendingColor();
					}
					return tick > 500;
				});
			}
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			delayStart: 200,
			duplicate: 5,
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
			red: 0.3,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true
		},
		{
			type: 'CYLINDER',
			textureName: 'alpha_center',
			alphaMax: 0.6,
			duration: 175,
			duplicate: 5,
			delayStart: 200,
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
			red: 0.3,
			green: 0.5,
			blue: 1.0,
			attachedEntity: true
		}
	],

	889: [
		//EF_TEIHIT1T	   Fast light beams (blue)
		{
			wav: 'effect/\x6d\x6f\x6e\x5f\xbe\xc6\xbc\xf6\xb6\xf3\x20\xc6\xd0\xc8\xb2\xb1\xc7',
			type: '3D',
			duplicate: 24,
			timeBetweenDupli: 0,
			file: 'effect/lens1.tga',
			delayStart: 100,
			duration: 250,
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
	]
};
