/**
 * @module DB/Effects/Table/Jobs/Merchant/Blacksmith
 *
 * The Merchant line's Blacksmith effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Camera from 'Renderer/Camera.js';
import SoundManager from 'Audio/SoundManager.js';
import Events from 'Core/Events.js';

export default {
	98: [
		{
			//EF_HASTEUP	Adrenaline Rush
			//type: 'FUNC',
			// This one is pretty messy... it somehow consists of two sprites, one is attached to the Entity, one isnt. additionally it consists of two sounds
			// For the sake of simplicity, I propose just using one sprite and one sound - the _a sound is just some 'intro' while _b is a real effect
			// black_adrenalinerush.wav what is this for?
			wav: 'effect/black_adrenalinerush_b', // The original client plays _a first and then continues with b
			attachedEntity: true
		}
	],

	'98_beforecast': [
		{
			wav: 'effect/black_adrenalinerush_a',
			attachedEntity: true
		}
	],

	101: [
		{
			//EF_REPAIRWEAPON	Weapon Repair
			type: 'STR',
			file: 'repairweapon',
			attachedEntity: true
		},
		{
			wav: 'effect/black_weapon_repair_a',
			delayWav: 480
		},
		{
			wav: 'effect/black_weapon_repair_a',
			delayWav: 1320
		}
	],

	102: [
		{
			//EF_CRASHEARTH	Hammerfall
			type: 'STR',
			file: 'crashearth',
			wav: 'effect/black_hammerfall',
			attachedEntity: false
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick + 350;
				Camera.setQuake(start);
			}
		}
	],

	103: [
		{
			//EF_PERFECTION	Weapon Perfection
			type: 'STR',
			file: 'weaponperfection',
			wav: 'effect/black_weapon_perfection',
			min: 'weaponperfection_min',
			attachedEntity: true
		}
	],

	104: [
		{
			//EF_MAXPOWER	Maximize Power
			type: 'STR',
			file: 'maximizepower',
			min: 'maximize_min',
			attachedEntity: true
		}
	],

	128: [
		{
			//EF_OVERTHRUST	Over Thrust
			wav: 'effect/black_overthrust',
			attachedEntity: true
		}
	],

	maximize_power_sounds: [
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function MaximizePowerSounds(Params) {
				Events.setTimeout(function () {
					SoundManager.play('effect/black_maximize_power_circle.wav');
				}, 1);
				Events.setTimeout(function () {
					SoundManager.play('effect/black_maximize_power_sword.wav');
				}, 550);
				Events.setTimeout(function () {
					SoundManager.play('effect/black_maximize_power_sword.wav');
				}, 700);
				Events.setTimeout(function () {
					SoundManager.play('effect/black_maximize_power_sword_bic.wav');
				}, 950);
			}
		}
	],

	ef_greed_sound: [
		{
			wav: 'effect/ef_entry',
			attachedEntity: true
		}
	],

	// Advanced Adrenaline Rush (BS_ADRENALINE2), from the client's own effect folders.
	ef_bs_adrenaline2: [
		{
			type: 'STR',
			file: 'adrenaline',
			texturePath: ''
		}
	]
};
