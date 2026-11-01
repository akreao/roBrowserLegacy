/**
 * @module DB/Effects/Table/ef_wm
 *
 * The effect table's named ef_wm_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Metallic Sound (WM_METALICSOUND), from the client's own effect folders.
	ef_wm_metalicsound: [
		{
			type: 'STR',
			file: 'new_metalicsound/new_metalicsound/new_metalicsound',
			texturePath: 'new_metalicsound/new_metalicsound/'
		},
		{
			type: 'STR',
			file: 'new_metalicsound/new_metalicsound_bottom/new_metalicsound_bottom',
			texturePath: 'new_metalicsound/new_metalicsound_bottom/',
			renderBeforeEntities: true
		}
	],

	// Metallic Sound (WM_METALICSOUND), from the client's own effect folders.
	ef_wm_metalicsound_hit: [
		{
			type: 'STR',
			file: 'new_metalicsound/new_metalicsound_hit/new_metalicsound_hit',
			texturePath: 'new_metalicsound/new_metalicsound_hit/'
		}
	],

	// Reverberation Magic (WM_REVERBERATION_MAGIC), from the client's own effect folders.
	ef_wm_reverberation_magic_hit: [
		{
			type: 'STR',
			file: 'new_reverberation/new_reverberation_hit/new_reverberation_hit',
			texturePath: 'new_reverberation/new_reverberation_hit/'
		}
	],

	// Severe Rainstorm (WM_SEVERE_RAINSTORM), from the client's own effect folders.
	ef_wm_severe_rainstorm: [
		{
			type: 'STR',
			file: 'new_severerainstorm/new_severerainstorm/new_severerainstorm',
			texturePath: 'new_severerainstorm/new_severerainstorm/'
		}
	],

	// Severe Rainstorm (WM_SEVERE_RAINSTORM), from the client's own effect folders.
	ef_wm_severe_rainstorm_cast: [
		{
			type: 'STR',
			file: 'new_severerainstorm/new_severerainstorm_cast/new_severerainstorm_cast',
			texturePath: 'new_severerainstorm/new_severerainstorm_cast/'
		}
	],

	// Sound of Destruction (WM_SOUND_OF_DESTRUCTION), from the client's own effect folders.
	ef_wm_sound_of_destruction_cast: [
		{
			type: 'STR',
			file: 'new_soundofdestruction/new_soundofdestruction_cast/new_soundofdestruction_cast',
			texturePath: 'new_soundofdestruction/new_soundofdestruction_cast/'
		},
		{
			type: 'STR',
			file: 'new_soundofdestruction/new_soundofdestruction_cast_bottom/new_soundofdestruction_cast_bottom',
			texturePath: 'new_soundofdestruction/new_soundofdestruction_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Unlimited Humming Voice (WM_UNLIMITED_HUMMING_VOICE), from the client's own effect folders.
	ef_wm_unlimited_humming_voice: [
		{
			type: 'STR',
			file: 'new_unlimit/new_unlimit/new_unlimit',
			texturePath: 'new_unlimit/new_unlimit/'
		},
		{
			type: 'STR',
			file: 'new_unlimit/new_unlimit_bottom/new_unlimit_bottom',
			texturePath: 'new_unlimit/new_unlimit_bottom/',
			renderBeforeEntities: true
		}
	],

	// Severe Rainstorm Melee (WM_SEVERE_RAINSTORM_MELEE), from the client's own effect folders.
	ef_wm_severe_rainstorm_melee: [
		{
			type: 'STR',
			file: 'new_severerainstorm/new_severerainstorm/new_severerainstorm',
			texturePath: 'new_severerainstorm/new_severerainstorm/'
		}
	],

	// Severe Rainstorm Melee (WM_SEVERE_RAINSTORM_MELEE), from the client's own effect folders.
	ef_wm_severe_rainstorm_melee_cast: [
		{
			type: 'STR',
			file: 'new_severerainstorm/new_severerainstorm_cast/new_severerainstorm_cast',
			texturePath: 'new_severerainstorm/new_severerainstorm_cast/'
		}
	]
};
