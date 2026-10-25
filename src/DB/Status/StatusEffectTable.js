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
	}
};
