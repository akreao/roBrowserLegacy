/**
 * @module DB/Effects/Table/ef_rl
 *
 * The effect table's named ef_rl_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Eternal Chain (RL_E_CHAIN), from the client's own effect folders.
	ef_rl_e_chain: [
		{
			type: 'STR',
			file: 'rl_e_chain/eternal',
			texturePath: 'rl_e_chain/'
		}
	],

	// Fire Dance (RL_FIREDANCE), from the client's own effect folders.
	ef_rl_firedance: [
		{
			type: 'STR',
			file: 'rl_fire_dance/firedance',
			texturePath: 'rl_fire_dance/'
		}
	],

	// Howling Mine (RL_H_MINE): the official client's skilleffectinfo row plays only this sound as each
	// damage packet arrives. The mine itself (1139) comes from the H_MINE status. See
	// effect-port/rebellion-skills.md.
	ef_rl_h_mine: [
		{
			wav: 'effect/rl_h_mine',
			attachedEntity: true
		}
	],

	// Platinum Alter (RL_P_ALTER), from the client's own effect folders.
	ef_rl_p_alter: [
		{
			type: 'STR',
			file: 'rl_p_alter/platinum',
			texturePath: 'rl_p_alter/'
		}
	],

	// Fallen Angel (RL_FALLEN_ANGEL): official effect 1140, launched on the caster when the cast starts.
	// It stays where the caster was (not attached). The client also lets it drift 0.09 units a tick away
	// from where the caster went; not ported. See effect-port/rebellion-skills.md.
	ef_rl_fallen_angel: [
		{
			type: 'STR',
			file: 'rl_fallen_angel/penne',
			texturePath: 'rl_fallen_angel/'
		}
	],

	// Dragon Tail (RL_D_TAIL), from the client's own effect folders.
	ef_rl_d_tail: [
		{
			type: 'STR',
			file: 'rl_d_tail/dtdt',
			texturePath: 'rl_d_tail/',
			wav: 'effect/rl_d_tail'
		}
	],

	// Fire Rain (RL_FIRE_RAIN), from the client's own effect folders.
	ef_rl_fire_rain: [
		{
			type: 'STR',
			file: 'rl_fire_rain/fire_rain',
			texturePath: 'rl_fire_rain/',
			wav: 'effect/rl_fire_rain'
		}
	],

	// Heat Barrel (RL_HEAT_BARREL), from the client's own effect folders.
	ef_rl_heat_barrel: [
		{
			type: 'STR',
			file: 'rl_heat_barrel/htb',
			texturePath: 'rl_heat_barrel/'
		}
	],

	// Slug Shot (RL_SLUGSHOT), from the client's own effect folders.
	ef_rl_slugshot: [
		{
			type: 'STR',
			file: 'rl_slugshot/slug',
			texturePath: 'rl_slugshot/',
			wav: 'effect/rl_slugshot'
		}
	],

	// Banishing Buster (RL_BANISHING_BUSTER): its skilleffectinfo row plays RL_BANISHING_BUSTER.wav and
	// launches 1066 on the target as each damage packet arrives. See effect-port/rebellion-skills.md.
	ef_rl_banishing_buster: [
		{
			//EF_BANISHING_BUSTER (1066)
			type: 'STR',
			file: 'rl_banishing_buster/vanishing1',
			texturePath: 'rl_banishing_buster/',
			wav: 'effect/rl_banishing_buster',
			attachedEntity: true
		}
	],

	// Flicker (RL_FLICKER): its skilleffectinfo row plays RL_FLICKER.wav on success, before 153 on the
	// caster. See effect-port/rebellion-skills.md.
	ef_rl_flicker_sound: [
		{
			wav: 'effect/rl_flicker',
			attachedEntity: true
		}
	],

	// Fire Dance (RL_FIREDANCE): its skilleffectinfo row plays the Desperado sound on success, before
	// 1133 on the caster. See effect-port/rebellion-skills.md.
	ef_rl_firedance_sound: [
		{
			wav: 'effect/\xb5\xa5\xbd\xba\xc6\xe4\xb6\xf3\xb5\xb5', // 데스페라도
			attachedEntity: true
		}
	],

	// Anti-Material Blast (RL_AM_BLAST): its skilleffectinfo row plays only this sound as each damage packet
	// arrives. See effect-port/rebellion-skills.md.
	ef_rl_am_blast_sound: [
		{
			wav: 'effect/rl_am_blast',
			attachedEntity: true
		}
	]
};
