/**
 * @module DB/Effects/Table/ef_hn
 *
 * The effect table's named ef_hn_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Double Bowling Bash (HN_DOUBLEBOWLINGBASH), from the client's own effect folders.
	ef_hn_doublebowlingbash: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_doublebowlingbash/double_bowlingbash',
			texturePath: 'hyper_novice/hn_doublebowlingbash/',
			wav: 'effect/hyper_novice/hn_double_bowlingbash',
			yOffset: 10
		}
	],

	// Mega Sonic Blow (HN_MEGA_SONIC_BLOW), from the client's own effect folders.
	ef_hn_mega_sonic_blow: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_mega_sonic_blow/mega_sonic_blow',
			texturePath: 'hyper_novice/hn_mega_sonic_blow/',
			wav: 'effect/hyper_novice/hn_mega_sonic_blow',
			yOffset: 13
		}
	],

	// Shield Chain Rush (HN_SHIELD_CHAIN_RUSH), from the client's own effect folders.
	ef_hn_shield_chain_rush: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_shield_chain_rush/shield_chain_rush',
			texturePath: 'hyper_novice/hn_shield_chain_rush/',
			wav: 'effect/hyper_novice/hn_shield_chain_rush',
			yOffset: 10
		}
	],

	// Spiral Pierce Max (HN_SPIRAL_PIERCE_MAX), from the client's own effect folders.
	ef_hn_spiral_pierce_max: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_spiral_pierce_max/spiral_pierce_max',
			texturePath: 'hyper_novice/hn_spiral_pierce_max/',
			wav: 'effect/hyper_novice/hn_spiral_pierce_max',
			yOffset: 5
		}
	],

	// Meteor Storm Buster (HN_METEOR_STORM_BUSTER), from the client's own effect folders.
	ef_hn_meteor_storm_buster: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_meteor_storm_buster/meteor_storm_buster',
			texturePath: 'hyper_novice/hn_meteor_storm_buster/',
			wav: 'effect/hyper_novice/hn_meteor_storm_buster',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'hyper_novice/hn_meteor_storm_buster/meteor_storm_buster_bottom',
			texturePath: 'hyper_novice/hn_meteor_storm_buster/',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],

	// Jupitel Thunderstorm (HN_JUPITEL_THUNDER_STORM), from the client's own effect folders.
	ef_hn_jupitel_thunder_storm: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_jupitel_thunder_storm/jupitel_thunder_storm_ball/jupitel_thunder_storm_ball',
			texturePath: 'hyper_novice/hn_jupitel_thunder_storm/jupitel_thunder_storm_ball/'
		}
	],

	// Hell's Drive (HN_HELLS_DRIVE): the EZ2 rows, each placed once on the ground
	// at one spot of the skill's grid (SkillEffect successEffectGrid*): the floor
	// layer plus one of the three blasts, picked at random.
	ef_hn_hells_drive_bottom: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_hells_drive/hells_drive_bottom',
			texturePath: 'hyper_novice/hn_hells_drive/',
			renderBeforeEntities: true,
			yOffset: 0
		}
	],
	ef_hn_hells_drive_00: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_hells_drive/hells_drive_00',
			texturePath: 'hyper_novice/hn_hells_drive/',
			wav: 'effect/hyper_novice/hn_hells_drive_00',
			yOffset: 0
		}
	],
	ef_hn_hells_drive_01: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_hells_drive/hells_drive_01',
			texturePath: 'hyper_novice/hn_hells_drive/',
			wav: 'effect/hyper_novice/hn_hells_drive_01',
			yOffset: 0
		}
	],
	ef_hn_hells_drive_02: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_hells_drive/hells_drive_02',
			texturePath: 'hyper_novice/hn_hells_drive/',
			wav: 'effect/hyper_novice/hn_hells_drive_02',
			yOffset: 0
		}
	],

	// Napalm Vulcan Strike (HN_NAPALM_VULCAN_STRIKE), from the client's own effect folders.
	ef_hn_napalm_vulcan_strike: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_napalm_vulcan_strike/napalm_vulcan_strike',
			texturePath: 'hyper_novice/hn_napalm_vulcan_strike/',
			wav: 'effect/hyper_novice/hn_napalm_vulcan_strike',
			yOffset: 12
		}
	],

	// Breaking Limit (HN_BREAKINGLIMIT), from the client's own effect folders.
	ef_hn_breakinglimit: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_breakinglimit/breakinglimit/breakinglimit',
			texturePath: 'hyper_novice/hn_breakinglimit/breakinglimit/',
			wav: 'effect/hyper_novice/hn_breakinglimit',
			yOffset: 12
		}
	],

	// Rule Break (HN_RULEBREAK), from the client's own effect folders.
	ef_hn_rulebreak: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_rulebreak/rulebreak/rulebreak',
			texturePath: 'hyper_novice/hn_rulebreak/rulebreak/',
			wav: 'effect/hyper_novice/hn_rulebreak',
			yOffset: 12
		}
	],

	// Overcoming Crisis (HN_OVERCOMING_CRISIS), from the client's own effect folders.
	ef_hn_overcoming_crisis: [
		{
			type: 'STR',
			file: 'hyper_novice/hn_overcoming_crisis/overcoming_crisis/overcoming_crisis',
			texturePath: 'hyper_novice/hn_overcoming_crisis/overcoming_crisis/',
			min: 'hyper_novice/hn_overcoming_crisis/overcoming_crisis/min_overcoming_crisis',
			wav: 'effect/hyper_novice/hn_overcoming_crisis',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'hyper_novice/hn_overcoming_crisis/overcoming_crisis_bottom/overcoming_crisis_bottom',
			texturePath: 'hyper_novice/hn_overcoming_crisis/overcoming_crisis_bottom/',
			min: 'hyper_novice/hn_overcoming_crisis/overcoming_crisis_bottom/min_overcoming_crisis_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	]
};
