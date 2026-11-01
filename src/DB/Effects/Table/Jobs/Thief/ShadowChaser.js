/**
 * @module DB/Effects/Table/Jobs/Thief/ShadowChaser
 *
 * The Thief line's ShadowChaser effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	//806: [{}],	//EF_FIREBALL3	   Flying by as fast as a rocket
	//807: [{}],	//EF_INTIMIDATE3	   Kidnapping sound
	//808: [{}],	//EF_RECOGNIZED2	   Like Recognized Spell, but one symbol
	//809: [{}],	//EF_CLOAKING3	   Shadowy filter [S]
	//810: [{}],	//EF_INTIMIDATE4	   Damp thud sound [S]

	811: [
		{
			//EF_STRETCH	   Body Painting
			wav: 'effect/bodypaint'
		}
	],

	813: [
		{
			//EF_ENERVATION	Masquerade - Enervation
			type: 'STR',
			file: 'enervation',
			attachedEntity: true
		}
	],

	814: [
		{
			//EF_ENERVATION2	Masquerade - Groomy
			type: 'STR',
			file: 'groomy',
			attachedEntity: true
		}
	],

	815: [
		{
			//EF_ENERVATION3	Masquerade - Ignorance
			type: 'STR',
			file: 'ignorance',
			attachedEntity: true
		}
	],

	816: [
		{
			//EF_ENERVATION4	Masquerade - Laziness
			type: 'STR',
			file: 'laziness',
			wav: 'effect/laziness',
			attachedEntity: true
		}
	],

	817: [
		{
			//EF_ENERVATION5	Masquerade - Unlucky
			type: 'STR',
			file: 'unlucky',
			attachedEntity: true
		}
	],

	818: [
		{
			//EF_ENERVATION6	Masquerade - Weakness
			type: 'STR',
			file: 'weakness',
			attachedEntity: true
		}
	],

	//819: [{}],	//EF_LINELINK4	   (Nothing)
	//820: [{}],	//EF_RG_COIN5	   Strip Accessory
	//821: [{}],	//EF_WATERFALL_ANI	   Waterfall

	822: [
		{
			wav: 'effect/dimension'
		}
	], //EF_BOTTOM_MANHOLE	   Dimension Door (spinning blue aura)

	823: [
		{
			//EF_MANHOLE	   in-the-manhole effect
			wav: 'effect/manhole'
		}
	],

	//824: [{}],	//EF_MAKEFEINT	   Some filter
	825: [
		{
			wav: 'effect/dimension'
		}
	], //EF_FORESTLIGHT6	   Dimension Door (aura + blue light)
	//826: [{}],	//EF_DARKCASTING2	   Expanding black casting anim:

	827: [
		{
			//EF_BOTTOM_ANI	   Chaos Panic (spinning brown aura)
			wav: 'effect/chaospanic'
		}
	],

	828: [
		{
			//EF_BOTTOM_MAELSTROM	   Maelstrom (spinning pink aura)
			wav: 'effect/maelstrom'
		}
	],

	829: [
		{
			//EF_BOTTOM_BLOODYLUST	   Bloody Lust (spinning red aura)
			wav: 'effect/bloodylust'
		}
	],

	// Fatal Menace (SC_FATALMENACE), from the client's own effect folders.
	ef_sc_fatalmenace: [
		{
			type: 'STR',
			file: 'new_fatal_menace/new_fatal_menace/new_fatal_menace',
			texturePath: 'new_fatal_menace/new_fatal_menace/'
		},
		{
			type: 'STR',
			file: 'new_fatal_menace/new_fatal_menace_bottom/new_fatal_menace_bottom',
			texturePath: 'new_fatal_menace/new_fatal_menace_bottom/',
			renderBeforeEntities: true
		}
	],

	// Fatal Menace (SC_FATALMENACE), from the client's own effect folders.
	ef_sc_fatalmenace_cast: [
		{
			type: 'STR',
			file: 'new_fatal_menace/new_fatal_menace_cast/new_fatal_menace_cast',
			texturePath: 'new_fatal_menace/new_fatal_menace_cast/'
		},
		{
			type: 'STR',
			file: 'new_fatal_menace/new_fatal_menace_cast_bottom/new_fatal_menace_cast_bottom',
			texturePath: 'new_fatal_menace/new_fatal_menace_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Reproduce (SC_REPRODUCE), from the client's own effect folders.
	ef_sc_reproduce: [
		{
			type: 'STR',
			file: 'new_reproduce/new_reproduce/new_reproduce',
			texturePath: 'new_reproduce/new_reproduce/',
			wav: 'effect/reproduce'
		},
		{
			type: 'STR',
			file: 'new_reproduce/new_reproduce_bottom/new_reproduce_bottom',
			texturePath: 'new_reproduce/new_reproduce_bottom/',
			renderBeforeEntities: true
		}
	],

	// Auto Shadow Spell (SC_AUTOSHADOWSPELL), from the client's own effect folders.
	ef_sc_autoshadowspell: [
		{
			type: 'STR',
			file: 'new_autoshadowspell/new_autoshadowspell/new_autoshadowspell',
			texturePath: 'new_autoshadowspell/new_autoshadowspell/'
		},
		{
			type: 'STR',
			file: 'new_autoshadowspell/new_autoshadowspell_bottom/new_autoshadowspell_bottom',
			texturePath: 'new_autoshadowspell/new_autoshadowspell_bottom/',
			renderBeforeEntities: true
		}
	]
};
