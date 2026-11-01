/**
 * @module DB/Effects/Table/Jobs/Swordman/Swordman
 *
 * The Swordman line's Swordman effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import { endureEffect } from 'DB/Effects/EndureEffect.js';

export default {
	11: [
		// EF_ENDURE, Endure: the client's shrinking endure.tga and alpha_down streaks (EndureEffect.js)
		...endureEffect
	],

	17: [
		{
			//EF_MAGNUMBREAK	Magnum Break
			// Official client parts: two flat yellow rings and a fire sphere, 30 ticks at 60 a second.
			type: 'PRIM',
			prim: 'ring',
			texture: 'ring_yellow',
			attachedEntity: false,
			duration: 500,
			frames: 30,
			radiusSpeed: 1.75,
			radiusAccel: -(1.75 / 30) * 0.5,
			width: 12,
			alpha: 0,
			alphaSpeed: 254 / 15,
			fadeOutFrame: 15,
			wav: 'effect/ef_magnumbreak'
		},
		{
			type: 'PRIM',
			prim: 'sphere',
			texture: '\xb4\xeb\xc6\xf8\xb9\xdf', //´ëÆø¹ß
			attachedEntity: false,
			duration: 500,
			frames: 30,
			radiusSpeed: 1.15,
			radiusAccel: -(1.15 / 30) * 0.5,
			spin: 3,
			alpha: 0,
			alphaSpeed: 254 / 15,
			fadeOutFrame: 15
		},
		{
			type: 'PRIM',
			prim: 'ring',
			texture: 'ring_yellow',
			attachedEntity: false,
			duration: 500,
			frames: 30,
			radiusSpeed: 1.75,
			radiusAccel: -(1.75 / 30) * 0.5,
			width: 12,
			alpha: 0,
			alphaSpeed: 254 / 15,
			fadeOutFrame: 15
		}
	],

	67: [
		{
			//EF_PROVOKE	Provoke
			// The official client plays the sound twice: on tick 5 (83 ms) and tick 30 (500 ms)
			type: 'STR',
			file: 'provoke',
			wav: 'effect/swordman_provoke',
			delayWav: 83,
			attachedEntity: true
		},
		{
			wav: 'effect/swordman_provoke',
			delayWav: 500
		}
	]
};
