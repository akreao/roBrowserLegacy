import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
	if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.getItem !== 'function') {
		const store = {};
		globalThis.localStorage = {
			getItem: key => (key in store ? store[key] : null),
			setItem: (key, val) => {
				store[key] = String(val);
			},
			removeItem: key => {
				delete store[key];
			}
		};
	}
});

import DB from 'DB/DBManager.js';

// As ItemInfo escapes a description before formatting it
function escape(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

function render(text) {
	const div = document.createElement('div');
	div.innerHTML = DB.formatMsgToHtml(DB.formatDescriptionTags(escape(text)));
	return div;
}

// Taken from the item descriptions the client is served
describe('DB.formatDescriptionTags', () => {
	it('turns a NAVI tag into a link to the place it names', () => {
		const div = render('Talk to <NAVI>Elin<INFO>alberta,117,135,0,100,0,0</INFO></NAVI> in Alberta.');
		const link = div.querySelector('.navi-link');
		expect(link.textContent).toBe('Elin');
		expect(link.dataset.naviInfo).toBe('alberta,117,135,0,100,0,0');
		expect(link.dataset.naviName).toBe('Elin');
		expect(div.textContent).toBe('Talk to Elin in Alberta.');
	});

	it('turns a TIPBOX tag into a link to that tip, and keeps the text of a URL tag', () => {
		const div = render(
			'<TIPBOX>[How to use guide]<INFO>65</INFO></TIPBOX> and ' +
				'<URL>[Series of tasks]<INFO>http://ro.zhaouc.com/data/features/6965.html</INFO></URL>'
		);
		expect(div.textContent).toBe('[How to use guide] and [Series of tasks]');
		const link = div.querySelector('.tipbox-link');
		expect(link.textContent).toBe('[How to use guide]');
		expect(link.dataset.tipboxId).toBe('65');
		expect(div.querySelector('a, .navi-link')).toBeNull();
	});

	it('keeps the text of a TIPBOX tag without a tip number', () => {
		const div = render('<TIPBOX>[List]<INFO>none</INFO></TIPBOX>');
		expect(div.textContent).toBe('[List]');
		expect(div.querySelector('.tipbox-link')).toBeNull();
	});

	it('leaves other angle brackets as text', () => {
		const div = render('enchanted with ^990099Energy<Guardian Dragon>^000000:');
		expect(div.textContent).toBe('enchanted with Energy<Guardian Dragon>:');
		expect(div.querySelector('guardian')).toBeNull();
	});

	it('keeps colour codes inside and around a tag', () => {
		const div = render('^0000FF<NAVI>Elin<INFO>alberta,117,135,0,100,0,0</INFO></NAVI>^000000 waits');
		expect(div.querySelector('span[style] .navi-link').textContent).toBe('Elin');
	});

	// rAthena's npc/re/jobs/novice/academy.txt colours the name inside the tag
	it('keeps the link whole when a colour code is inside its text', () => {
		const div = render('Ask <NAVI>^4D4DFF[Battle Trainer Subino]^000000<INFO>iz_ac01,59,83,</INFO></NAVI> about it.');
		const link = div.querySelector('.navi-link');
		expect(link.textContent).toBe('[Battle Trainer Subino]');
		expect(link.dataset.naviName).toBe('[Battle Trainer Subino]');
		expect(link.dataset.naviInfo).toBe('iz_ac01,59,83,');
		expect(link.querySelector('span[style]').style.color).toBe('rgb(77, 77, 255)');
		expect(div.textContent).toBe('Ask [Battle Trainer Subino] about it.');
	});

	it('cannot be made to write markup through the tag', () => {
		const div = render('<NAVI>"><img src=x><INFO>a" onclick="x</INFO></NAVI>');
		expect(div.querySelector('img')).toBeNull();
		const link = div.querySelector('.navi-link');
		expect(link.getAttribute('onclick')).toBeNull();
		expect(link.dataset.naviInfo).toBe('a" onclick="x');
	});
});
