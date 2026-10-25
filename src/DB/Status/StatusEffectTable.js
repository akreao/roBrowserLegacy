/**
 * DB/Status/StatusEffectTable.js
 *
 * Effects the official client draws on an actor while a status is on.
 *
 * start: played each time the status starts.
 * loop: started with the status, one copy per actor, removed when the status ends.
 * stages: one entry per status value (the status's first value), each a list of
 *   effects. Each time the status starts with value N, every stage effect on the
 *   actor is removed and stages[N] is played. Ending the status leaves them.
 * clears: statuses whose stage effects are removed when this status ends.
 *
 * Effect names are keys of DB/Effects/EffectTable.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import StatusConst from './StatusConst.js';

export default {
	// Rising Sun (SKE_RISING_SUN)
	[StatusConst.RISING_SUN]: {
		start: ['ef_ske_rising_sun_00'],
		loop: ['ef_ske_rising_sun_01']
	},

	// Rising Sun's second and third stages
	[StatusConst.NOON_SUN]: {
		start: ['ef_ske_rising_sun_02'],
		loop: ['ef_ske_rising_sun_03']
	},

	[StatusConst.SUNSET_SUN]: {
		start: ['ef_ske_rising_sun_04'],
		loop: ['ef_ske_rising_sun_05']
	},

	// Rising Moon (SKE_RISING_MOON): each cast moves to the next stance
	[StatusConst.RISING_MOON]: {
		start: ['ef_ske_rising_moon_00'],
		loop: ['ef_ske_rising_moon_01']
	},
	[StatusConst.MIDNIGHT_MOON]: {
		start: ['ef_ske_rising_moon_02'],
		loop: ['ef_ske_rising_moon_03']
	},
	[StatusConst.DAWN_MOON]: {
		start: ['ef_ske_rising_moon_04'],
		loop: ['ef_ske_rising_moon_05']
	},

	// Intensive Aim (NW_INTENSIVE_AIM): the server raises the count from 1 to 10
	// while the stance is on; each value shows its own stage of the gauge, and
	// 10 adds the full glow. The stages stay until the stance ends.
	[StatusConst.INTENSIVE_AIM_COUNT]: {
		stages: [
			['ef_nw_intensive_aim_00'],
			['ef_nw_intensive_aim_01'],
			['ef_nw_intensive_aim_02'],
			['ef_nw_intensive_aim_03'],
			['ef_nw_intensive_aim_04'],
			['ef_nw_intensive_aim_05'],
			['ef_nw_intensive_aim_06'],
			['ef_nw_intensive_aim_07'],
			['ef_nw_intensive_aim_08'],
			['ef_nw_intensive_aim_09'],
			['ef_nw_intensive_aim_10', 'ef_nw_intensive_aim_full']
		]
	},
	[StatusConst.INTENSIVE_AIM]: {
		clears: [StatusConst.INTENSIVE_AIM_COUNT]
	},

	// Enchanting Sky (SKE_ENCHANTING_SKY)
	[StatusConst.SKY_ENCHANT]: {
		start: ['ef_ske_enchanting_sky'],
		loop: ['ef_ske_enchanting_sky_loop']
	},

	// From here on the effect names are rows of ez2streffect.bson (DBManager mergeEz2Effects).
	// Each one loops on the actor while the status is on, as the official client does.

	// Unlimit (RA_UNLIMIT)
	[StatusConst.UNLIMIT]: {
		loop: ['unlimit_loop_bottom', 'unlimit_loop']
	},

	// Servant Weapon: Sign (DK_SERVANT_W_SIGN), on the marked target
	[StatusConst.SERVANT_SIGN]: {
		loop: ['servant_sign_bottom', 'servant_sign']
	},

	// Vigor (DK_VIGOR)
	[StatusConst.VIGOR]: {
		loop: ['vigor_buff']
	},

	// Dancing Knife (SHC_DANCING_KNIFE)
	[StatusConst.DANCING_KNIFE]: {
		start: ['dancing_knife_skill_bottom_begin', 'dancing_knife_skill_begin'],
		loop: ['dancing_knife_skill_bottom_loop', 'dancing_knife_skill_loop']
	},

	// Guard Stance (IG_GUARD_STANCE)
	[StatusConst.GUARD_STANCE]: {
		loop: ['new_guard_stance_loop_bottom']
	},

	// Attack Stance (IG_ATTACK_STANCE)
	[StatusConst.ATTACK_STANCE]: {
		loop: ['new_attack_stance_loop_bottom']
	},

	// Guardian Shield (IG_GUARDIAN_SHIELD)
	[StatusConst.GUARDIAN_S]: {
		start: ['new_guardianshield_buff_start'],
		loop: ['new_guardianshield_buff_loop']
	},

	// Holy Shield (IG_HOLY_SHIELD)
	[StatusConst.HOLY_S]: {
		loop: ['new_holy_shield_loop', 'new_holy_shield_loop_bottom']
	},

	// Ultimate Sacrifice (IG_ULTIMATE_SACRIFICE)
	[StatusConst.ULTIMATE_S]: {
		loop: ['ultimate_sacrifice_buff']
	},

	// Grand Judgement (IG_GRAND_JUDGEMENT): the client draws this status with its buff
	[StatusConst.SPEAR_SCAR]: {
		loop: ['new_grand_judgement_buff']
	},

	// Calamity Gale (WH_CALAMITYGALE)
	[StatusConst.CALAMITYGALE]: {
		loop: ['calumitygale_loop']
	},

	// Mystic Symphony (TR_MYSTIC_SYMPHONY)
	[StatusConst.MYSTIC_SYMPHONY]: {
		loop: ['mysticsymphony_note']
	},

	// Hidden Card (NW_HIDDEN_CARD)
	[StatusConst.HIDDEN_CARD]: {
		loop: ['hiddencard_thunder']
	},

	// Circle of Directions and Elementals (SOA_CIRCLE_OF_DIRECTIONS_AND_ELEMENTALS)
	[StatusConst.T_FIVETH_GOD]: {
		loop: ['circle_directions_elements_loop']
	},

	// Soul of Heaven and Earth (SOA_SOUL_OF_HEAVEN_AND_EARTH)
	[StatusConst.HEAVEN_AND_EARTH]: {
		loop: ['soul_of_heaven_and_earth_buff']
	},

	// Howling of Chul Ho (SH_HOWLING_OF_CHUL_HO), on the scared target
	[StatusConst.HOGOGONG]: {
		loop: ['howling_of_chul_ho_scared']
	},

	// Temporary Communion (SH_TEMPORARY_COMMUNION)
	[StatusConst.TEMPORARY_COMMUNION]: {
		loop: ['temporary_communion_buff_bottom', 'temporary_communion_buff']
	},

	// Breaking Limit (HN_BREAKINGLIMIT)
	[StatusConst.BREAKINGLIMIT]: {
		loop: ['breakinglimit_buff']
	},

	// Rule Break (HN_RULEBREAK)
	[StatusConst.RULEBREAK]: {
		loop: ['rulebreak_buff']
	},

	// Nightmare (Shinkiro/Shiranui)
	[StatusConst.NIGHTMARE]: {
		loop: ['efst_nightmare']
	},

	// Hall of Life monster marks
	[StatusConst.TARGET_MARKER]: {
		start: ['target_marker_start'],
		loop: ['target_marker_loop']
	},
	[StatusConst.BLOCK_SEAL]: {
		start: ['npc_block_seal_start'],
		loop: ['npc_block_seal_loop_bottom', 'npc_block_seal_loop']
	},
	[StatusConst.GROGGY]: {
		loop: ['groggy_on_loop']
	},

	// Mystery Powder (BO_MYSTERY_POWDER)
	[StatusConst.MYSTERY_POWDER]: {
		loop: ['mistery_powder_loop_bottom', 'mistery_powder_loop']
	}
};
