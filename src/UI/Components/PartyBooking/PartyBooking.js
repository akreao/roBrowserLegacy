/**
 * UI/Components/PartyBooking/PartyBooking.js
 *
 * Party booking list: search the party ads players have registered
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Preferences from 'Core/Preferences.js';
import Session from 'Engine/SessionStorage.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import WhisperBox from 'UI/Components/WhisperBox/WhisperBox.js';
import 'UI/Elements/Elements.js';
import {
	JOB_CATEGORIES,
	getCategoryName,
	LEVEL_RANGE,
	getJobName,
	getJobNames,
	getMapName,
	fillMapSelects,
	getSelectedMap
} from './PartyBookingData.js';
import htmlText from './PartyBooking.html?raw';
import cssText from './PartyBooking.css?raw';

const PartyBooking = new GUIComponent('PartyBooking', cssText);

PartyBooking.render = () => htmlText;

/**
 * Highest level the level box takes
 */
const MAX_LEVEL = 999;

/**
 * Ads the server sends per search (rAthena's MAX_PARTY_BOOKING_RESULTS)
 */
const RESULT_COUNT = 10;

/**
 * Label of the "any" entry in the map and job boxes
 */
const ANY = 'All';

const _preferences = Preferences.get('PartyBooking', { x: 100, y: 100, notice: false }, 1.0);

/**
 * @var {Array} ads shown, in order
 */
let _results = [];

/**
 * @var {Object|null} last search sent: { level, mapId, job }
 */
let _search = null;

/**
 * @var {Array} regions and maps, from DB.getPartyBookingMaps()
 */
let _regions = [];

/**
 * @var {number} index of the selected ad, -1 for none
 */
let _selected = -1;

PartyBooking.init = function init() {
	const root = this.getRoot();

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => PartyBooking.remove());
	root.querySelector('.ok').addEventListener('click', () => PartyBooking.remove());
	root.querySelector('.search').addEventListener('click', () => search(0));
	root.querySelector('.more').addEventListener('click', () => {
		if (_results.length) {
			search(_results[_results.length - 1].Index + 1);
		}
	});
	root.querySelector('.notice').addEventListener('click', () => setNotice(!_preferences.notice));
	root.querySelector('.whisper').addEventListener('click', () => {
		if (_results[_selected]) {
			WhisperBox.show(_results[_selected].CharName);
		}
	});
	root.querySelector('.recruit').addEventListener('click', () => PartyBooking.onRecruit());
	root.querySelector('.recruit').title = DB.getMessage(1764);

	const level = root.querySelector('.level');
	level.addEventListener('keydown', event => {
		if (event.key === 'Enter') {
			search(0);
		}
		event.stopPropagation();
	});

	const categorySelect = root.querySelector('.category');
	const jobSelect = root.querySelector('.job');
	categorySelect.appendChild(new Option(ANY, -1));
	JOB_CATEGORIES.forEach((category, i) => categorySelect.appendChild(new Option(getCategoryName(category), i)));
	categorySelect.addEventListener('change', () => {
		const category = JOB_CATEGORIES[parseInt(categorySelect.value, 10)];
		jobSelect.replaceChildren(new Option(ANY, -1));
		if (category) {
			for (let code = category.first; code < category.first + category.count; ++code) {
				jobSelect.appendChild(new Option(getJobName(code), code));
			}
		}
		jobSelect.disabled = !category;
	});
	categorySelect.dispatchEvent(new Event('change'));

	root.querySelector('.list').addEventListener('click', event => {
		const row = event.target.closest('.row');
		if (row) {
			select(parseInt(row.getAttribute('data-index'), 10));
		}
	});
	root.querySelector('.list').addEventListener('dblclick', event => {
		const row = event.target.closest('.row');
		if (row) {
			WhisperBox.show(_results[parseInt(row.getAttribute('data-index'), 10)].CharName);
		}
	});

	this.draggable('.titlebar');
};

PartyBooking.onAppend = function onAppend() {
	this._host.style.top = _preferences.y + 'px';
	this._host.style.left = _preferences.x + 'px';
};

PartyBooking.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
};

/**
 * Open the list, with the player's level filled in
 */
PartyBooking.open = function open() {
	this.append();

	const root = this.getRoot();
	root.querySelector('.level').value = Session.Entity?.clevel || '';
	setNotice(_preferences.notice);
	updateWhisper();

	DB.getPartyBookingMaps().then(regions => {
		_regions = regions;
		fillMapSelects(regions, root.querySelector('.region'), root.querySelector('.map'), ANY);
		render();
	});
};

PartyBooking.toggle = function toggle() {
	if (this.__active) {
		this.remove();
	} else {
		this.open();
	}
};

/**
 * @return {boolean} new ads are to be announced in the chat
 */
PartyBooking.isNoticeOn = function isNoticeOn() {
	return !!_preferences.notice;
};

/**
 * @return {Array} regions and maps, once loaded
 */
PartyBooking.getRegions = function getRegions() {
	return _regions;
};

/**
 * Search results arrived
 *
 * @param {Array} ads - { Index, CharName, ExpireTime, Detail: { Level, MapID, Job } }
 * @param {boolean} more - the server has more
 */
PartyBooking.setResults = function setResults(ads, more) {
	if (!this.__active) {
		return;
	}

	// rAthena finds nothing when both a map and a job are asked for, so the job is
	// left out of the request and checked here
	if (_search && _search.filterJob !== -1) {
		ads = ads.filter(ad => ad.Detail.Job.includes(_search.filterJob));
	}

	_results = _results.concat(ads);
	this.getRoot().querySelector('.more').style.display = more ? 'block' : 'none';

	if (!_results.length) {
		UIManager.showMessageBox(DB.getMessage(1827), 'ok');
	}
	render();
};

/**
 * An ad was registered somewhere
 *
 * @param {Object} ad - as in setResults
 */
PartyBooking.addAd = function addAd(ad) {
	if (this.__active && _search && matches(ad, _search) && !_results.some(entry => entry.Index === ad.Index)) {
		_results.unshift(ad);
		_selected = _selected < 0 ? -1 : _selected + 1;
		render();
	}
};

/**
 * An ad's jobs changed
 *
 * @param {number} index - the ad's index
 * @param {Array} jobs - its new jobs
 */
PartyBooking.updateAd = function updateAd(index, jobs) {
	const ad = _results.find(entry => entry.Index === index);
	if (ad) {
		ad.Detail.Job = jobs;
		render();
	}
};

/**
 * An ad was removed
 *
 * @param {number} index - the ad's index
 */
PartyBooking.removeAd = function removeAd(index) {
	const at = _results.findIndex(entry => entry.Index === index);
	if (at >= 0) {
		_results.splice(at, 1);
		_selected = _selected === at ? -1 : _selected > at ? _selected - 1 : _selected;
		render();
	}
};

/**
 * Callbacks
 */
PartyBooking.onSearch = function onSearch(/* level, mapId, job, lastIndex, count */) {};
PartyBooking.onRecruit = function onRecruit() {};

/**
 * Send a search from the boxes' values, or ask for the next results
 *
 * @param {number} lastIndex - 0 for a new search, else the first ad index wanted
 */
function search(lastIndex) {
	const root = PartyBooking.getRoot();

	if (!lastIndex) {
		const text = root.querySelector('.level').value.trim();
		const level = /^\d*$/.test(text) ? parseInt(text || '0', 10) : -1;

		if (level < 0 || level > MAX_LEVEL) {
			UIManager.showMessageBox(DB.getMessage(2601).replace('%d', MAX_LEVEL), 'ok');
			return;
		}

		const mapId = getSelectedMap(root.querySelector('.region'), root.querySelector('.map'));
		const job = parseInt(root.querySelector('.job').value, 10);

		_search = { level: level, mapId: mapId, job: mapId ? -1 : job, filterJob: mapId ? job : -1 };
		_results = [];
		_selected = -1;
		root.querySelector('.more').style.display = 'none';
		render();
	}

	if (_search) {
		PartyBooking.onSearch(_search.level, _search.mapId, _search.job, lastIndex, RESULT_COUNT);
	}
}

/**
 * @param {Object} ad
 * @param {Object} filter - the search sent
 * @return {boolean} the search would have found the ad
 */
function matches(ad, filter) {
	const detail = ad.Detail;
	if (filter.level && (detail.Level < filter.level - LEVEL_RANGE || detail.Level > filter.level)) {
		return false;
	}
	if (filter.mapId && detail.MapID !== filter.mapId) {
		return false;
	}
	const job = filter.job !== -1 ? filter.job : filter.filterJob;
	return job === -1 || detail.Job.includes(job);
}

/**
 * @param {number} index - ad to select
 */
function select(index) {
	_selected = index;
	PartyBooking.getRoot()
		.querySelectorAll('.row')
		.forEach(row => row.classList.toggle('selected', parseInt(row.getAttribute('data-index'), 10) === index));
	updateWhisper();
}

/**
 * Whisper talks to the selected ad's leader, so it is greyed out until a row is selected
 */
function updateWhisper() {
	PartyBooking.getRoot().querySelector('.whisper').classList.toggle('disabled', !_results[_selected]);
}

/**
 * @param {boolean} on - announce new ads
 */
function setNotice(on) {
	_preferences.notice = on;
	_preferences.save();
	PartyBooking.getRoot()
		.querySelector('.notice ui-image')
		.setAttribute('src', on ? 'checkbox_1.bmp' : 'checkbox_0.bmp');
}

/**
 * @param {number} time - seconds since 1970
 * @return {string} " hh : mm ", as the official list shows it
 */
function formatTime(time) {
	const date = new Date(time * 1000);
	const pad = value => String(value).padStart(2, '0');
	return pad(date.getHours()) + ' : ' + pad(date.getMinutes());
}

/**
 * Draw the ads
 */
function render() {
	const list = PartyBooking.getRoot().querySelector('.list');
	const pad = value => String(value).padStart(2, '0');

	updateWhisper();

	list.replaceChildren(
		..._results.map((ad, i) => {
			const row = document.createElement('div');
			row.className = 'row' + (i === _selected ? ' selected' : '');
			row.setAttribute('data-index', i);

			const cell = (className, text) => {
				const span = document.createElement('span');
				span.className = className;
				span.textContent = text;
				row.appendChild(span);
			};

			cell('time', formatTime(ad.ExpireTime));
			cell('name', ad.CharName);
			cell('levels', pad(ad.Detail.Level) + '~' + pad(ad.Detail.Level + LEVEL_RANGE));
			cell('map-name', getMapName(_regions, ad.Detail.MapID));
			cell('jobs', getJobNames(ad.Detail.Job));
			return row;
		})
	);
}

/**
 * Create component and export it
 */
export default UIManager.addComponent(PartyBooking);
