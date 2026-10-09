/**
 * UI/Components/PartyBooking/PartyBookingRecruit.js
 *
 * Party booking ad form: register an ad, or change the jobs of the one registered
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Preferences from 'Core/Preferences.js';
import Session from 'Engine/SessionStorage.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import 'UI/Elements/Elements.js';
import {
	JOB_CATEGORIES,
	MAX_JOBS,
	LEVEL_RANGE,
	getJobName,
	fillMapSelects,
	getSelectedMap
} from './PartyBookingData.js';
import htmlText from './PartyBookingRecruit.html?raw';
import cssText from './PartyBookingRecruit.css?raw';

const PartyBookingRecruit = new GUIComponent('PartyBookingRecruit', cssText);

PartyBookingRecruit.render = () => htmlText;

/**
 * Highest level an ad takes
 */
const MAX_LEVEL = 999;

const _preferences = Preferences.get('PartyBookingRecruit', { x: 160, y: 140 }, 1.0);

/**
 * @var {Set} job codes ticked
 */
const _jobs = new Set();

/**
 * @var {boolean} changing the registered ad: only its jobs can change
 */
let _rewrite = false;

PartyBookingRecruit.init = function init() {
	const root = this.getRoot();
	const jobs = root.querySelector('.jobs');

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => PartyBookingRecruit.remove());
	root.querySelector('.cancel').addEventListener('click', () => PartyBookingRecruit.remove());
	root.querySelector('.ok').addEventListener('click', submit);

	const level = root.querySelector('.level');
	level.addEventListener('input', showLevels);
	level.addEventListener('keydown', event => event.stopPropagation());

	JOB_CATEGORIES.forEach(category => {
		const title = document.createElement('div');
		title.className = 'group';
		title.textContent = DB.getMessage(category.msg);
		jobs.appendChild(title);

		for (let code = category.first; code < category.first + category.count; ++code) {
			const box = document.createElement('span');
			box.className = 'checkbox';
			box.setAttribute('data-job', code);
			box.innerHTML = '<ui-image src="checkbox_0.bmp"></ui-image>';
			box.appendChild(document.createTextNode(getJobName(code)));
			jobs.appendChild(box);
		}
	});

	jobs.addEventListener('click', event => {
		const box = event.target.closest('.checkbox');
		if (box) {
			toggleJob(parseInt(box.getAttribute('data-job'), 10));
		}
	});

	this.draggable('.titlebar');
};

PartyBookingRecruit.onAppend = function onAppend() {
	this._host.style.top = _preferences.y + 'px';
	this._host.style.left = _preferences.x + 'px';
};

PartyBookingRecruit.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
};

/**
 * Open the form
 *
 * @param {Object} [ad] - the registered ad, { level, mapId, jobs }, to change its jobs
 */
PartyBookingRecruit.open = function open(ad) {
	this.append();

	const root = this.getRoot();
	const level = root.querySelector('.level');
	const regionSelect = root.querySelector('.region');
	const mapSelect = root.querySelector('.map');

	_rewrite = !!ad;
	_jobs.clear();
	if (ad) {
		ad.jobs.filter(job => job > 0).forEach(job => _jobs.add(job));
	}

	level.value = ad ? ad.level : Session.Entity?.clevel || '';
	level.disabled = _rewrite;
	regionSelect.disabled = _rewrite;
	showLevels();
	showJobs();

	DB.getPartyBookingMaps().then(regions => {
		fillMapSelects(regions, regionSelect, mapSelect, '-');
		if (ad && ad.mapId) {
			regionSelect.value = ad.mapId >> 8;
			regionSelect.onchange();
			mapSelect.value = ad.mapId;
		}
		regionSelect.disabled = _rewrite;
		mapSelect.disabled = _rewrite || !parseInt(regionSelect.value, 10);
	});
};

/**
 * Callbacks
 */
PartyBookingRecruit.onRegister = function onRegister(/* level, mapId, jobs */) {};
PartyBookingRecruit.onUpdate = function onUpdate(/* jobs */) {};

/**
 * @param {number} code - job to tick or untick
 */
function toggleJob(code) {
	if (_jobs.has(code)) {
		_jobs.delete(code);
	} else if (_jobs.size >= MAX_JOBS) {
		UIManager.showMessageBox(DB.getMessage(1769).replace('%d', _jobs.size + 1), 'ok');
		return;
	} else {
		_jobs.add(code);
	}
	showJobs();
}

/**
 * Draw the ticks and the count
 */
function showJobs() {
	const root = PartyBookingRecruit.getRoot();

	root.querySelectorAll('.checkbox').forEach(box => {
		const on = _jobs.has(parseInt(box.getAttribute('data-job'), 10));
		box.querySelector('ui-image').setAttribute('src', on ? 'checkbox_1.bmp' : 'checkbox_0.bmp');
	});
	root.querySelector('.count').textContent = _jobs.size + ' / ' + MAX_JOBS;
}

/**
 * Show the levels the ad will be found at
 */
function showLevels() {
	const root = PartyBookingRecruit.getRoot();
	const level = parseInt(root.querySelector('.level').value, 10);
	root.querySelector('.levels').textContent = level > 0 ? level + ' ~ ' + (level + LEVEL_RANGE) : '';
}

/**
 * Send the ad
 */
function submit() {
	const root = PartyBookingRecruit.getRoot();

	if (!_jobs.size) {
		UIManager.showMessageBox(DB.getMessage(1768), 'ok');
		return;
	}

	const jobs = Array.from(_jobs).sort((a, b) => a - b);
	while (jobs.length < MAX_JOBS) {
		jobs.push(-1);
	}

	if (_rewrite) {
		PartyBookingRecruit.onUpdate(jobs);
		PartyBookingRecruit.remove();
		return;
	}

	const text = root.querySelector('.level').value.trim();
	const level = /^\d+$/.test(text) ? parseInt(text, 10) : 0;
	if (level < 1 || level > MAX_LEVEL) {
		UIManager.showMessageBox(DB.getMessage(2601).replace('%d', MAX_LEVEL), 'ok');
		return;
	}

	PartyBookingRecruit.onRegister(
		level,
		getSelectedMap(root.querySelector('.region'), root.querySelector('.map')),
		jobs
	);
}

/**
 * Create component and export it
 */
export default UIManager.addComponent(PartyBookingRecruit);
