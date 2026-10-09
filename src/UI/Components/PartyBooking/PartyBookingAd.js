/**
 * UI/Components/PartyBooking/PartyBookingAd.js
 *
 * The player's own party booking ad, with how long it has been up
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Preferences from 'Core/Preferences.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import 'UI/Elements/Elements.js';
import { LEVEL_RANGE, getJobNames, getMapName } from './PartyBookingData.js';
import htmlText from './PartyBookingAd.html?raw';
import cssText from './PartyBookingAd.css?raw';

const PartyBookingAd = new GUIComponent('PartyBookingAd', cssText);

PartyBookingAd.render = () => htmlText;

const _preferences = Preferences.get('PartyBookingAd', { x: 20, y: 200 }, 1.0);

/**
 * @var {Object|null} the ad: { level, mapId, jobs, since }
 */
let _ad = null;

/**
 * @var {number} timer refreshing the elapsed time
 */
let _timer = 0;

PartyBookingAd.init = function init() {
	const root = this.getRoot();

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.rewrite').addEventListener('click', () => PartyBookingAd.onRewrite(_ad));
	root.querySelector('.cancel').addEventListener('click', () => PartyBookingAd.onDelete());

	this.draggable('.titlebar');
};

PartyBookingAd.onAppend = function onAppend() {
	this._host.style.top = _preferences.y + 'px';
	this._host.style.left = _preferences.x + 'px';
	clearInterval(_timer);
	_timer = setInterval(showTime, 1000);
};

PartyBookingAd.onRemove = function onRemove() {
	clearInterval(_timer);
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
};

/**
 * Show the ad just registered
 *
 * @param {number} level
 * @param {number} mapId
 * @param {Array} jobs
 */
PartyBookingAd.show = function show(level, mapId, jobs) {
	_ad = { level: level, mapId: mapId, jobs: jobs, since: Date.now() };
	this.append();
	render();
};

/**
 * The ad's jobs changed
 *
 * @param {Array} jobs
 */
PartyBookingAd.setJobs = function setJobs(jobs) {
	if (_ad) {
		_ad.jobs = jobs;
		_ad.since = Date.now();
		render();
	}
};

/**
 * @return {Object|null} the ad shown
 */
PartyBookingAd.getAd = function getAd() {
	return _ad;
};

/**
 * The ad is gone
 */
PartyBookingAd.clear = function clear() {
	_ad = null;
	this.remove();
};

/**
 * Callbacks
 */
PartyBookingAd.onRewrite = function onRewrite(/* ad */) {};
PartyBookingAd.onDelete = function onDelete() {};

/**
 * Draw the ad
 */
function render() {
	const root = PartyBookingAd.getRoot();

	DB.getPartyBookingMaps().then(regions => {
		if (_ad) {
			root.querySelector('.summary').textContent =
				_ad.level + ' ~ ' + (_ad.level + LEVEL_RANGE) + '  ' + getMapName(regions, _ad.mapId);
		}
	});
	root.querySelector('.jobs').textContent = getJobNames(_ad.jobs);
	showTime();
}

/**
 * Draw how long the ad has been up, "hh:mm:ss"
 */
function showTime() {
	if (!_ad) {
		return;
	}

	const seconds = Math.floor((Date.now() - _ad.since) / 1000);
	const pad = value => String(value).padStart(2, '0');
	PartyBookingAd.getRoot().querySelector('.timer').textContent =
		pad(Math.floor(seconds / 3600) % 60) + ':' + pad(Math.floor(seconds / 60) % 60) + ':' + pad(seconds % 60);
}

/**
 * Create component and export it
 */
export default UIManager.addComponent(PartyBookingAd);
