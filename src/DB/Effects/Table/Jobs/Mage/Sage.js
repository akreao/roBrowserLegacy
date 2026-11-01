/**
 * @module DB/Effects/Table/Jobs/Mage/Sage
 *
 * The Mage line's Sage effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

import LPEffect from 'Renderer/Effects/LPEffect.js';
import PropertyGround from 'Renderer/Effects/PropertyGround.js';

export default {
	234: [
		{
			//EF_SPELLBREAKER	Spell Breaker
			type: 'STR',
			file: 'spell',
			wav: 'effect/sage_spell breake',
			attachedEntity: true
		}
	],

	235: [
		{
			//EF_DISPELL	Dispell
			type: 'STR',
			file: '\xb5\xf0\xbd\xba\xc6\xe7',
			attachedEntity: true
		}
	],

	//236: [{}],	//EF_DELUGE	   Deluge Cast Aura
	//237: [{}],	//EF_VIOLENTGALE	   Violent Gale Cast Aura
	//238: [{}],	//EF_LANDPROTECTOR	   Magnetic Earth Cast Aura
	239: [
		{
			//EF_BOTTOM_VO	   Volcano (Visual Effect)
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				this.add(
					new PropertyGround(Params.Inst.position, 3.0, 1.0, 2, 'ring_red', Params.Inst.startTick),
					Params
				);
			}
		}
	],
	240: [
		{
			//EF_BOTTOM_DE	   Deluge (Visual Effect)
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				this.add(
					new PropertyGround(Params.Inst.position, 3.0, 1.0, 2, 'ring_blue', Params.Inst.startTick),
					Params
				);
			}
		}
	],
	241: [
		{
			//EF_BOTTOM_VI	   Violent Gale (Visual Effect)
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				this.add(
					new PropertyGround(Params.Inst.position, 3.0, 1.0, 2, 'ring_yellow', Params.Inst.startTick),
					Params
				);
			}
		}
	],

	242: [
		{
			//EF_BOTTOM_LA	Magnetic Earth (Visual Effect)
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				this.add(new LPEffect(Params.Inst.position, Params.Inst.startTick), Params);
			}
		}
	],

	//243: [{}],	//EF_FASTMOVE	   (Invalid)

	244: [
		{
			//EF_MAGICROD	Magic Rod
			type: 'STR',
			file: '\xb8\xc5\xc1\xf7\xb7\xce\xb5\xe5',
			wav: 'effect/sage_magic rod',
			attachedEntity: true
		}
	],

	255: [
		{
			//EF_FLAMELAUNCHER	Elemental Endow (Fire)
			type: 'STR',
			file: 'enc_fire',
			wav: '_enemy_hit_wind1',
			attachedEntity: true
		}
	],

	256: [
		{
			//EF_FROSTWEAPON	Elemental Endow (Water)
			type: 'STR',
			file: 'enc_ice',
			wav: '_enemy_hit_wind1',
			attachedEntity: true
		}
	],

	257: [
		{
			//endow wind on target	//EF_LIGHTNINGLOADER	Elemental Endow (Wind)
			type: 'STR',
			file: 'enc_wind',
			wav: 'effect/_enemy_hit_wind1',
			attachedEntity: true
		}
	],

	258: [
		{
			//EF_SEISMICWEAPON	Elemental Endow (Earth)
			type: 'STR',
			file: 'enc_earth',
			wav: '_enemy_hit_wind1',
			attachedEntity: true
		}
	],

	// Suicide (SA_INSTANTDEATH), from the client's own effect folders.
	ef_sa_instantdeath: [
		{
			type: 'STR',
			file: 'suicide',
			texturePath: ''
		}
	]
};
