/**
 * @module DB/Effects/Table/Jobs/Taekwon/Taekwon
 *
 * The Taekwon line's Taekwon effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	445: [
		{
			//high jump caster	//EF_JUMPBODY	High Jump (Jump)
			wav: 'effect/t_\xc8\xb8\xc7\xc72',
			attachedEntity: true
		}
	],

	457: [
		{
			//flying kick on target	//EF_JUMPKICK	Flying Side Kick (2nd Part)
			wav: 'effect/\x74\x5f\xb3\xaf\xb6\xf3\xc2\xf7\xb1\xe2', //t_łŻ¶óÂ÷±â
			attachedEntity: true
		}
	],

	// Counter Kick (TK_COUNTER), from the client's own effect folders.
	ef_tk_counter: [
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
	]
};
