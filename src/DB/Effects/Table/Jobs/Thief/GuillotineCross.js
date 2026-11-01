/**
 * @module DB/Effects/Table/Jobs/Thief/GuillotineCross
 *
 * The Thief line's GuillotineCross effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import Events from 'Core/Events.js';

export default {
	//768: [{}],	//EF_PURPLEBODY	   Blinking
	//769: [{}],	//EF_STIN6	   Cross Ripper Slasher (flying knives)
	//770: [{}],	//EF_RG_COIN4	   Strip sound
	//771: [{}],	//EF_POISONWAV	   Poison sound
	//772: [{}],	//EF_POISONSMOKE	   Poison particles
	//773: [{}],	//EF_GUMGANG4	   Expanding purple aura (part of Phantom Menace)
	//774: [{}],	//EF_SHIELDBOOMERANG4	   Axe Boomerang

	775: [
		{
			//EF_CASTSPIN2	   Spinning character sprite
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const entity = Params.Init.ownerEntity;
				const duration = 500;
				const count = 8;
				const delay = duration / count;

				for (let i = 0; i < count; i++) {
					const delta = 1;

					Events.setTimeout(function () {
						entity.direction = Math.floor(entity.direction + delta) % 8;
					}, delay * i);
				}
			}
		}
	],

	1040: [
		{
			//EF_GC_DARKCROW
			type: 'STR',
			file: 'gc_darkcrow',
			//wav: 'effect/gc_darkcrow',
			attachedEntity: true
		}
	],

	ef_hallucinationwalk: [
		{
			wav: 'effect/hallucinationwalk',
			attachedEntity: true
		}
	],

	// Cross Impact (GC_CROSSIMPACT), from the client's own effect folders.
	ef_gc_crossimpact: [
		{
			type: 'STR',
			file: 'new_crossimpact/new_crossimpact/new_crossimpact',
			texturePath: 'new_crossimpact/new_crossimpact/'
		}
	],

	// Poisoning Weapon (GC_POISONINGWEAPON), from the client's own effect folders.
	ef_gc_poisoningweapon: [
		{
			type: 'STR',
			file: 'poison',
			texturePath: ''
		}
	],

	// Counter Slash (GC_COUNTERSLASH), from the client's own effect folders.
	ef_gc_counterslash: [
		{
			type: 'STR',
			file: 'new_counter_slash/new_counter_slash/new_counter_slash',
			texturePath: 'new_counter_slash/new_counter_slash/'
		},
		{
			type: 'STR',
			file: 'new_counter_slash/new_counter_slash_bottom/new_counter_slash_bottom',
			texturePath: 'new_counter_slash/new_counter_slash_bottom/',
			renderBeforeEntities: true
		}
	],

	// Poison Smoke (GC_POISONSMOKE), from the client's own effect folders.
	ef_gc_poisonsmoke: [
		{
			type: 'STR',
			file: 'new_poisonsmoke/new_poisonsmoke/new_poisonsmoke_%d',
			rand: [1, 2],
			texturePath: 'new_poisonsmoke/new_poisonsmoke/'
		}
	],

	// Cross Ripper Slasher (GC_CROSSRIPPERSLASHER), from the client's own effect folders.
	ef_gc_crossripperslasher: [
		{
			type: 'STR',
			file: 'new_crossripperslasher/new_crossripperslasher/new_crossripperslasher',
			texturePath: 'new_crossripperslasher/new_crossripperslasher/'
		}
	]
};
