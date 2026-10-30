/**
 * DB/Status/StatusEffectTable.js
 *
 * Effects the official client draws on an actor while a status is on.
 *
 * start: played each time the status starts.
 * restart: like start, but the actor's earlier copy is removed first (the client
 *   removes it before launching the effect again).
 * loop: started with the status, one copy per actor, removed when the status ends.
 * stages: one entry per status value (the status's first value), each a list of
 *   effects. Each time the status starts with value N, every stage effect on the
 *   actor is removed and stages[N] is played. Ending the status leaves them.
 * clears: statuses whose stage effects are removed when this status ends.
 * counted: { value, effects }: the status value at index `value` (0 val1,
 *   1 val2, 2 val3) is a count N from 1; each start plays effects[N - 1] on the
 *   actor until the status ends (earlier counts keep playing). Ending the
 *   status removes them all.
 * stop: effects also removed when the status ends.
 * end: effects played once when the status ends.
 * scale: size of every effect of the row (1 is the art's own size).
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

	// Close Confine (RG_CLOSECONFINE): the official client puts 604 (cconfine.spr)
	// on the caster and the target while their status is on, replacing an old copy.
	[StatusConst.RG_CCONFINE_M]: {
		restart: [604],
		stop: [604]
	},
	[StatusConst.RG_CCONFINE_S]: {
		restart: [604],
		stop: [604]
	},

	// Cross Slash mark (KO_JYUMONJIKIRI): the official client keeps 998 (red_cross.str) on the actor while
	// the status is on. See effect-port/kagerou-oboro-skills.md.
	[StatusConst.KO_JYUMONJIKIRI]: {
		loop: ['ef_ko_red_cross']
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
	},

	// Gender change: drawn half again as large. When it ends the client stops
	// the cast and the loop and plays gender_change once.
	[StatusConst.GENDER_CHANGE]: {
		start: ['gender_change_cast'],
		loop: ['gender_change_loop'],
		stop: ['gender_change_cast'],
		end: ['gender_change'],
		scale: 1.5
	},

	// Druid buffs. The client builds these row names at run time from hidden
	// strings; decoded, they are the bson rows below.

	// Wind Veil (KR_WIND_VEIL)
	[StatusConst.WIND_VEIL]: {
		loop: ['wild_veil', 'wild_veil_bottom']
	},

	// Ground Grow (DR_GROUND_GROW): the status's third value is the stack, 1 to
	// 12; stack N plays ground_grow_<N-1> (two digits), stack 12 ground_grow_full.
	[StatusConst.GROUND_GROW]: {
		counted: {
			value: 2,
			effects: [
				'ground_grow_00',
				'ground_grow_01',
				'ground_grow_02',
				'ground_grow_03',
				'ground_grow_04',
				'ground_grow_05',
				'ground_grow_06',
				'ground_grow_07',
				'ground_grow_08',
				'ground_grow_09',
				'ground_grow_10',
				'ground_grow_full'
			]
		}
	},

	// Thundering Rod (DR_THUNDERING_ROD): third value 1 to 6 plays
	// thundering_rod_<N-1>; the full rod is its own status.
	[StatusConst.THUNDERING_ROD]: {
		counted: {
			value: 2,
			effects: [
				'thundering_rod_00',
				'thundering_rod_01',
				'thundering_rod_02',
				'thundering_rod_03',
				'thundering_rod_04',
				'thundering_rod_05'
			]
		}
	},
	[StatusConst.THUNDERING_ROD_MAX]: {
		loop: ['thundering_rod_full']
	},

	// Marionette Control: on each change of the caster's (MARIONETTE_MASTER) or the target's
	// (MARIONETTE) status the client removes every 396 on the actor, then starts it again while on.
	[StatusConst.MARIONETTE_MASTER]: {
		restart: [396],
		stop: [396]
	},
	[StatusConst.MARIONETTE]: {
		restart: [396],
		stop: [396]
	},

	// Bard and Dancer songs (renewal): the client launches an aura on every actor
	// the song's status starts on, removing its earlier copy first.
	[StatusConst.WHISTLE]: {
		restart: [865]
	},
	[StatusConst.ASSASSINCROSS]: {
		restart: [873]
	},
	[StatusConst.POEMBRAGI]: {
		restart: [877]
	},
	[StatusConst.APPLEIDUN]: {
		restart: [861]
	},
	[StatusConst.HUMMING]: {
		restart: [865]
	},
	[StatusConst.DONTFORGETME]: {
		restart: [38]
	},
	[StatusConst.FORTUNEKISS]: {
		restart: [871]
	},
	[StatusConst.SERVICEFORYOU]: {
		restart: [873]
	},
	[StatusConst.RICHMANKIM]: {
		restart: [867]
	},
	[StatusConst.ETERNALCHAOS]: {
		restart: [864]
	},
	[StatusConst.DRUMBATTLEFIELD]: {
		restart: [871]
	},
	[StatusConst.RINGNIBELUNGEN]: {
		restart: [875]
	},
	[StatusConst.ROKISWEIL]: {
		restart: [864]
	},
	[StatusConst.INTOABYSS]: {
		restart: [865]
	},
	[StatusConst.SIEGFRIED]: {
		restart: [875]
	},
	// Bite scar (Scar of Tarou): bite_scar.str once when the status starts,
	// removed when it ends (official effect 1119).
	[StatusConst.BITESCAR]: {
		start: ['ef_su_bitescar'],
		stop: ['ef_su_bitescar']
	},

	// Silvervine Root Twist: the roots on the actor while the status lasts (official
	// effect 1110).
	[StatusConst.SV_ROOTTWIST]: {
		loop: ['ef_su_roottwist']
	},

	// Assumptio (HP_ASSUMPTIO): the official client removes 375 and launches it again when the status
	// starts, and removes it when the status ends.
	[StatusConst.ASSUMPTIO]: {
		loop: [375]
	},

	// Flash Kick (SJ_FLASHKICK): each time the status is on, the official client removes 1221 and launches
	// it again (a refresh restarts the mark); it is removed when the status ends.
	// See effect-port/star-emperor-soul-reaper-skills.md.
	[StatusConst.FLASHKICK]: {
		restart: ['ef_sj_flashkick'],
		stop: ['ef_sj_flashkick']
	},

	// Soul Curse (SP_SOULCURSE): the official client spawns 1362 and plays s포이즌버스터.wav when the status
	// starts (if the actor has no 1362 yet) and removes 1362 when it ends.
	// See effect-port/star-emperor-soul-reaper-skills.md.
	[StatusConst.SOULCURSE]: {
		loop: ['ef_sp_soulcurse_mark']
	},

	// Howling Mine (RL_H_MINE): the official client keeps 1139 on the actor while the status is on.
	// See effect-port/rebellion-skills.md.
	[StatusConst.H_MINE]: {
		loop: [1139]
	},

	// Anti-Material Blast (RL_AM_BLAST): the official client keeps 1136 on the actor while the status is on.
	// See effect-port/rebellion-skills.md.
	[StatusConst.ANTI_M_BLAST]: {
		loop: [1136]
	},

	// Quick Draw Shot ready (RL_QD_SHOT): the official client plays 1076 at the actor's position both when
	// the status starts and when it ends. See effect-port/rebellion-skills.md.
	[StatusConst.E_QD_SHOT_READY]: {
		start: [1076],
		end: [1076]
	},

	// Crimson Marker (RL_C_MARKER): the official client removes the actor's 1075 whenever the status
	// changes; when it starts, it plays 1061 and then 1075 on the actor, once each. (It skips 1061 for
	// actors in a client-side list that was not identified.) See effect-port/rebellion-skills.md.
	[StatusConst.C_MARKER]: {
		start: [1061],
		restart: [1075],
		stop: [1075]
	},

	// Soul Link (Soul Linker spirits) and the Soul Reaper souls: the official client puts 424 on the
	// target from the use packet and removes it when the status ends. See effect-port/soul-linker-audit.md.
	[StatusConst.SOULLINK]: { stop: [424] },
	[StatusConst.SOULSHADOW]: { stop: [424] },
	[StatusConst.SOULFAIRY]: { stop: [424] },
	[StatusConst.SOULFALCON]: { stop: [424] },
	[StatusConst.SOULGOLEM]: { stop: [424] },

	// Kaite (SL_KAITE): the official client removes the actor's 419 whenever the status changes and
	// plays it again while it is on.
	[StatusConst.KAITE]: {
		restart: [419],
		stop: [419]
	},

	// Warmth (SG_SUN_WARM / MOON_WARM / STAR_WARM): the official client removes 418 and 544 whenever
	// the status changes and plays both again while it is on. See effect-port/star-gladiator-audit.md.
	[StatusConst.SG_SUN_WARM]: { restart: [418, 544], stop: [418, 544] },
	[StatusConst.SG_MOON_WARM]: { restart: [418, 544], stop: [418, 544] },
	[StatusConst.SG_STAR_WARM]: { restart: [418, 544], stop: [418, 544] },

	// Star Emperor stances, Gravity Control and Soul Unity: the official client keeps one copy of the
	// look on the actor while the status is on and removes it when it ends.
	// See effect-port/star-emperor-soul-reaper-audit.md.
	[StatusConst.SUNSTANCE]: { loop: [1214] },
	[StatusConst.LUNARSTANCE]: { loop: [1215] },
	[StatusConst.STARSTANCE]: { loop: [1216] },
	[StatusConst.UNIVERSESTANCE]: { loop: [1217] },
	[StatusConst.GRAVITYCONTROL]: { loop: [1201] },
	// The client removes and relaunches 601 when the status comes on, and removes it when it ends
	[StatusConst.WZ_SIGHTBLASTER]: { restart: [601], stop: [601] },
	[StatusConst.SOULUNITY]: { loop: [1222] }
};
