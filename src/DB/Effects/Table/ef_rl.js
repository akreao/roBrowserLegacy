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

	// Howling Mine (RL_H_MINE), from the client's own effect folders.
	ef_rl_h_mine: [
		{
			type: 'STR',
			file: 'rl_h_mine/mine',
			texturePath: 'rl_h_mine/',
			wav: 'effect/rl_h_mine'
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

	// Fallen Angel (RL_FALLEN_ANGEL), from the client's own effect folders.
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
	]
};
