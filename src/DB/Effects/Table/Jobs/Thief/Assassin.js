/**
 * @module DB/Effects/Table/Jobs/Thief/Assassin
 *
 * The Thief line's Assassin effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Renderer from 'Renderer/Renderer.js';

export default {
	120: [
		{
			//EF_CLOAKING	   Cloaking
			wav: 'effect/assasin_cloaking'
		}
	],

	121: [
		{
			//EF_SONICBLOW	// sonic blow caste
			type: '3D',
			blendMode: 2,
			duration: 400,
			alphaMax: 1.0,
			fadeOut: true,
			sizeStart: 100,
			sizeEnd: 300,
			file: 'effect/ring2.bmp', // Original: 'effect/alpha_center.tga',
			wav: 'effect/ef_stonecurse',
			zIndex: 10,
			attachedEntity: true
		}
	],

	122: [
		{
			//EF_SONICBLOWHIT	   Multi hit effect
			//wav:  'effect/assasin_sonicblow' // old

			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const delay = Params.Inst.startTick - Renderer.tick;

				entity.animations.add(function (tick) {
					if (tick >= delay) {
						entity.direction = (entity.direction + 2) % 8; // Spinning around
						return true;
					}
				});
			}
		}
	],

	123: [
		{
			//grimtooth caster	//EF_GRIMTOOTH	Grimtooth Cast
			wav: 'effect/ef_frostdiver',
			attachedEntity: true
		},
		{
			//EF_GRIMTOOTH	stone spikes traveling from caster past the target
			type: 'TRAIL',
			attachedEntity: false,
			duration: 2500,
			speed: 24,
			interval: 50,
			stopAtTarget: true,
			overshoot: 3,
			spawn: [
				{
					type: 'QuadHorn',
					textureFile: 'effect/stone.bmp',
					attachedEntity: false,
					duration: 670,
					height: [0.6, 1.0],
					offsetX: 0,
					offsetY: 0,
					offsetZ: 0,
					bottomSize: [0.05, 0.1],
					blendMode: 8,
					rotateX: [-15, 15],
					rotateY: [0, 360],
					color: [1.0, 1.0, 1.0, 1.0],
					animation: 4,
					animationSpeed: 330,
					riseDistance: 0.8,
					fadeOut: 170
				}
			]
		}
	],

	124: [
		{
			//EF_VENOMDUST	Venom Dust
			type: 'STR',
			file: 'venomdust',
			wav: 'effect/assasin_poisonreact', //effect/assasin_venomdust'
			attachedEntity: false
		}
	],

	126: [
		{
			//EF_POISONREACT	Poison React
			type: 'STR',
			file: 'poisonreact_1st',
			wav: 'effect/assasin_poisonreact',
			attachedEntity: true
		}
	],

	127: [
		{
			//EF_POISONREACT2	Small Posion React
			type: 'STR',
			file: 'poisonreact',
			wav: 'effect/assasin_poisonreact',
			attachedEntity: true
		}
	],

	129: [
		{
			//EF_SPLASHER	Venom Splasher Explosion
			type: 'STR',
			file: 'venomsplasher',
			wav: 'effect/assasin_venomsplasher',
			attachedEntity: true
		}
	],

	132: [
		//EF_GRIMTOOTHATK	   Grimtooth Hit
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 15000,
			height: 2.5,
			offsetX: 0.5,
			offsetY: 0.4,
			offsetZ: -0.2,
			bottomSize: 0.15,
			blendMode: 1,
			rotateX: -15,
			rotateY: 0,
			rotateZ: 0,
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 3,
			animationSpeed: 120,
			animationOut: true
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 15000,
			height: 2.5,
			offsetY: 0.5,
			bottomSize: 0.15,
			blendMode: 1,
			rotateX: 5,
			rotateY: 45,
			rotateZ: -15,
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 3,
			animationSpeed: 120,
			animationOut: true
		},
		{
			type: 'QuadHorn',
			textureFile: 'effect/stone.bmp',
			attachedEntity: false,
			duration: 15000,
			height: 2.5,
			offsetX: 0.5,
			offsetY: 0.5,
			offsetZ: 0,
			bottomSize: 0.15,
			blendMode: 1,
			rotateX: 5,
			rotateY: 45,
			rotateZ: 15,
			color: [1.0, 1.0, 1.0, 1.0],
			animation: 3,
			animationSpeed: 120,
			animationOut: true
		}
	],

	143: [
		{
			//EF_SONICBLOW2	Sonic Blow (Part 2/2) - sonicblow at target
			type: 'STR',
			file: 'sonicblow',
			attachedEntity: true
		}
	],

	171: [
		{
			//EF_VENOMDUST2	   Venom Dust Map Unit
			type: '3D',
			spriteName: 'particle3',
			alphaMax: 1,
			attachedEntity: true,
			duration: 100,
			size: 80,
			poszStart: 0,
			poszEnd: 0.5,
			repeat: true
		}
	],

	//599: [{}],	//EF_SHRINK	   Cast Time Sound and Flashing Animation on Player

	600: [
		{
			//EF_THROWITEM6	   Throw Venom Knife
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 200,
			fadeIn: true,
			fadeOut: true,
			file: '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xba\xa3\xb3\xd1\xb3\xaa\xc0\xcc\xc7\xc1.bmp',
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			rotate: true,
			nbOfRotation: 1,
			size: 30,
			zOffset: 1,
			zIndex: 1
		}
	]
};
