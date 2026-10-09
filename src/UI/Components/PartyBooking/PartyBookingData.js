/**
 * UI/Components/PartyBooking/PartyBookingData.js
 *
 * Party booking jobs and maps, as the official windows name them
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';

/**
 * Jobs an ad can ask for, by category. A job's code is first + its place in the
 * category: codes 1-4 are roles, 5-63 are jobs (UISeekPartyListWnd's table).
 */
export const JOB_CATEGORIES = [
	{ msg: 1755, first: 1, count: 4 }, // Roles
	{ msg: 1756, first: 5, count: 6 }, // 1st Jobs
	{ msg: 1757, first: 11, count: 13 }, // 2nd Jobs
	{ msg: 1758, first: 24, count: 6 }, // 3-1 Classes
	{ msg: 1759, first: 30, count: 7 }, // 3-2 Classes
	{ msg: 1760, first: 37, count: 6 }, // 1st High Jobs
	{ msg: 1761, first: 43, count: 13 }, // 2nd High Jobs
	{ msg: 1762, first: 56, count: 8 } // Other Jobs
];

/**
 * Most jobs an ad can ask for
 */
export const MAX_JOBS = 6;

/**
 * Level range an ad covers: searching at level L finds ads from L - 15 to L
 */
export const LEVEL_RANGE = 15;

/**
 * @param {number} code - job code from a booking packet
 * @return {string} its name, empty for none (-1)
 */
export function getJobName(code) {
	if (code < 1 || code > 63) {
		return '';
	}
	return DB.getMessage(code < 5 ? 1711 + code : 1624 + code);
}

/**
 * @param {Array} jobs - job codes, -1 for an empty slot
 * @return {string} the names, comma separated
 */
export function getJobNames(jobs) {
	return jobs.map(getJobName).filter(Boolean).join(', ');
}

/**
 * @param {Array} regions - from DB.getPartyBookingMaps()
 * @param {number} id - map id from a booking packet, (region << 8) | map
 * @return {string} the map's name, the region's for a whole region, '-' for none
 */
export function getMapName(regions, id) {
	const region = regions[(id >> 8) - 1];

	if (!region) {
		return id ? '#' + id : '-';
	}
	if (!(id & 0xff)) {
		return region.name;
	}

	const map = region.maps.find(entry => entry.id === id);
	return map ? map.name : region.name;
}

/**
 * Fill a region select and its map select, and keep the maps in step
 *
 * @param {Array} regions - from DB.getPartyBookingMaps()
 * @param {HTMLSelectElement} regionSelect
 * @param {HTMLSelectElement} mapSelect
 * @param {string} anyText - label of the "any" entry, value 0
 */
export function fillMapSelects(regions, regionSelect, mapSelect, anyText) {
	const option = (value, text) => {
		const el = document.createElement('option');
		el.value = value;
		el.textContent = text;
		return el;
	};

	const fillMaps = () => {
		const region = regions[parseInt(regionSelect.value, 10) - 1];
		mapSelect.replaceChildren(option(0, anyText));
		if (region) {
			region.maps.forEach(map => mapSelect.appendChild(option(map.id, map.name)));
		}
		mapSelect.disabled = !region;
	};

	regionSelect.replaceChildren(option(0, anyText));
	regions.forEach((region, i) => regionSelect.appendChild(option(i + 1, region.name)));
	regionSelect.onchange = fillMaps;
	fillMaps();
}

/**
 * @param {HTMLSelectElement} regionSelect
 * @param {HTMLSelectElement} mapSelect
 * @return {number} the chosen map id, (region << 8) | map, 0 for any
 */
export function getSelectedMap(regionSelect, mapSelect) {
	const region = parseInt(regionSelect.value, 10) || 0;
	const map = parseInt(mapSelect.value, 10) || 0;
	return map || region << 8;
}
