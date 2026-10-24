/**
 * DB/Status/StatusEffectTable.js
 *
 * Effects the official client draws on an actor while a status is on.
 *
 * start: played each time the status starts.
 * loop: started with the status, one copy per actor, removed when the status ends.
 *
 * Effect names are keys of DB/Effects/EffectTable.js.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import StatusConst from './StatusConst.js';

export default {
	// Rising Moon (SKE_RISING_MOON)
	[StatusConst.RISING_MOON]: {
		start: ['ef_ske_rising_moon_00'],
		loop: ['ef_ske_rising_moon_01']
	}
};
