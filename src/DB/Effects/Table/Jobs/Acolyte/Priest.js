/**
 * @module DB/Effects/Table/Jobs/Acolyte/Priest
 *
 * The Acolyte line's Priest effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	75: [
		{
			//EF_GLORIA	Gloria
			type: 'STR',
			file: 'gloria',
			wav: 'effect/priest_gloria',
			min: 'gloria_min',
			attachedEntity: true
		}
	],

	76: [
		{
			//EF_MAGNIFICAT	Magnificat
			type: 'STR',
			file: 'magnificat',
			wav: 'effect/priest_magnificat',
			min: 'magnificat_min',
			attachedEntity: true
		}
	],

	78: [
		{
			//EF_RECOVERY	Status Recovery
			type: 'STR',
			file: 'recovery',
			wav: 'effect/priest_recovery',
			attachedEntity: true
		}
	],

	83: [
		{
			//EF_SANCTUARY	Sanctuary
			type: 'STR',
			file: 'sanctuary',
			wav: 'effect/priest_sanctuary',
			attachedEntity: true
		}
	],

	84: [
		{
			//EF_IMPOSITIO	Impositio Manus
			type: 'STR',
			file: 'impositio',
			wav: 'effect/priest_impositio',
			attachedEntity: true
		}
	],

	85: [
		{
			//EF_LEXAETERNA	Lex Aeterna
			type: 'STR',
			file: 'lexaeterna',
			wav: 'effect/priest_lexaeterna',
			min: 'lexaeterna_min',
			attachedEntity: true
		}
	],

	86: [
		{
			//EF_ASPERSIO	Aspersio
			type: 'STR',
			file: 'aspersio',
			wav: 'effect/priest_aspersio',
			attachedEntity: true
		}
	],

	87: [
		{
			//EF_LEXDIVINA	Lex Divina
			type: 'STR',
			file: 'lexdivina',
			wav: 'effect/priest_lexdivina',
			attachedEntity: true
		}
	],

	88: [
		{
			//EF_SUFFRAGIUM	Suffragium
			type: 'STR',
			file: 'suffragium',
			wav: 'effect/priest_suffragium',
			min: 'suffragium_min',
			attachedEntity: true
		}
	],

	91: [
		{
			//EF_BENEDICTIO	B. S. Sacramenti
			type: 'STR',
			file: 'benedictio',
			wav: 'effect/priest_benedictio',
			attachedEntity: true
		}
	],

	112: [
		{
			//kyrie caster	//EF_KYRIE	Kyrie Eleison
			type: 'STR',
			file: 'kyrie',
			wav: 'effect/priest_kyrie_eleison_a', //on target its priest_kyrie_eleison_b
			min: 'kyrie_min',
			attachedEntity: true
		}
	],

	113: [
		{
			//EF_MAGNUS	Magnus Exorcismus
			type: 'STR',
			file: 'magnus',
			wav: 'effect/priest_magnus',
			attachedEntity: false
		}
	],

	136: [
		{
			//EF_SLOWPOISON	Slow Poison
			type: 'STR',
			file: 'slowp',
			wav: 'effect/priest_slowpoison',
			attachedEntity: false
		}
	],

	318: [
		{
			//EF_BOTTOM_MAG	Magnus Exorcisimus Map Unit
			alphaMax: 0.2,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 0.7,
			duration: 50000,
			fade: false,
			height: 5,
			rotate: false,
			textureName: 'ring_red',
			topSize: 0.7,
			type: 'CYLINDER',
			angleY: 45
		},
		{
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 0.7,
			duration: 2000,
			fade: true,
			height: 5,
			rotate: false,
			textureName: 'ring_red',
			topSize: 0.7,
			type: 'CYLINDER',
			angleY: 45,
			repeat: true
		}
	],

	319: [
		{
			//EF_BOTTOM_SANC	Sanctuary Map Unit
			alphaMax: 0.3,
			animation: 0,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.5,
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 0.7,
			duration: 50000,
			fade: false,
			green: 0.9,
			height: 2,
			red: 0.5,
			rotate: false,
			textureName: 'magic_green',
			topSize: 0.7,
			type: 'CYLINDER',
			angleY: 45
		},
		{
			alphaMax: 0.1,
			animation: 1,
			attachedEntity: true,
			blendMode: 2,
			blue: 0.5,
			totalCircleSides: 4,
			circleSides: 4,
			bottomSize: 0.7,
			duration: 2000,
			fade: true,
			green: 0.9,
			height: 2,
			red: 0.5,
			rotate: false,
			textureName: 'magic_green',
			topSize: 0.7,
			type: 'CYLINDER',
			angleY: 45,
			repeat: true
		}
	]
};
