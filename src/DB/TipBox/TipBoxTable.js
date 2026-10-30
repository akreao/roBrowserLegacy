/**
 * DB/TipBox/TipBoxTable.js
 *
 * The tip box's tips, as System/tipbox.lub registers them.
 *
 * The file is a Lua table and a main() that hands every tip to five functions
 * the client provides, in this order for each tip (kRO 2025, CTipBoxMgr):
 *
 *   AddTip(id, title, search, image)
 *   AddImgcoord(id, position, size)
 *   AddPageEx(id, effectNum, twinkle, startX, startY, distX, distY, moveTime)
 *                         once per picture marker, or once with effectNum -1
 *   AddPage(id, text)     once per page
 *   AddIsTag(id, isTag)   newer files only
 *
 * A title may hold a second line after '#' ("Help: Command List#/h"). Tips
 * with an id under 1000 and search = 1 are the ones the window picks from at
 * random when it opens; search = 0 keeps a tip out of the search results.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/**
 * @var {Map<number, object>} tips by id
 */
const _tips = new Map();

/**
 * Ids under this are general tips, which the window shows at random on
 * opening. From 1000 on are the lists and topics the tips link to.
 */
const RANDOM_TIP_LIMIT = 1000;

/**
 * A tip, created on first mention.
 *
 * @param {number} id
 * @return {object}
 */
function tip(id) {
	let entry = _tips.get(id);
	if (!entry) {
		entry = {
			id,
			title: '',
			search: false,
			image: '',
			position: 5,
			size: 100,
			effects: [],
			pages: [],
			isTag: false
		};
		_tips.set(id, entry);
	}
	return entry;
}

const TipBoxTable = {
	RANDOM_TIP_LIMIT,

	/**
	 * Forget every tip, before a file is loaded again.
	 */
	reset() {
		_tips.clear();
	},

	/**
	 * @return {number} how many tips are known
	 */
	get size() {
		return _tips.size;
	},

	/**
	 * AddTip(id, title, search, image)
	 */
	addTip(id, title, search, image) {
		const entry = tip(Number(id));
		entry.title = String(title || '');
		entry.search = Number(search) === 1;
		entry.image = String(image || '');
		return entry;
	},

	/**
	 * AddImgcoord(id, position, size): where the picture sits and how large,
	 * in percent. Every tip in the official files is 5 (centred), 100.
	 */
	addImgCoord(id, position, size) {
		const entry = tip(Number(id));
		entry.position = Number(position);
		entry.size = Number(size);
	},

	/**
	 * AddPageEx(id, effectNum, twinkle, startX, startY, distX, distY, moveTime):
	 * a marker drawn over the picture (tipbox/ico_effect<n>.bmp), at window
	 * coordinates. Effect -1 is the call a tip without markers makes.
	 */
	addPageEx(id, effectNum, twinkle, startX, startY, distX, distY, moveTime) {
		const entry = tip(Number(id));
		effectNum = Number(effectNum);
		if (!(effectNum >= 0)) {
			return;
		}
		entry.effects.push({
			effect: effectNum,
			twinkle: Number(twinkle) === 1,
			x: Number(startX) || 0,
			y: Number(startY) || 0,
			distX: Number(distX) || 0,
			distY: Number(distY) || 0,
			moveTime: Number(moveTime) || 0
		});
	},

	/**
	 * AddPage(id, text)
	 */
	addPage(id, text) {
		tip(Number(id)).pages.push(String(text || ''));
	},

	/**
	 * AddIsTag(id, isTag)
	 */
	addIsTag(id, isTag) {
		tip(Number(id)).isTag = Number(isTag) === 1;
	},

	/**
	 * @param {number} id
	 * @return {object|null}
	 */
	get(id) {
		return _tips.get(Number(id)) || null;
	},

	/**
	 * The tips the window may open on: under 1000, and searchable.
	 *
	 * @return {Array<number>}
	 */
	randomCandidates() {
		const ids = [];
		for (const entry of _tips.values()) {
			if (entry.id < RANDOM_TIP_LIMIT && entry.search) {
				ids.push(entry.id);
			}
		}
		return ids;
	},

	/**
	 * A tip to open on, as the official window does: one of the general tips,
	 * at random.
	 *
	 * @param {function} [random] - returns [0, 1)
	 * @return {number|null}
	 */
	randomTip(random = Math.random) {
		const ids = this.randomCandidates();
		if (!ids.length) {
			return null;
		}
		return ids[Math.min(ids.length - 1, Math.floor(random() * ids.length))];
	},

	/**
	 * Searchable tips whose title holds the text, in id order.
	 *
	 * @param {string} text
	 * @return {Array<object>}
	 */
	search(text) {
		const needle = String(text || '')
			.trim()
			.toLowerCase();
		if (!needle) {
			return [];
		}
		const found = [];
		for (const entry of _tips.values()) {
			if (entry.search && entry.title.toLowerCase().includes(needle)) {
				found.push(entry);
			}
		}
		return found.sort((a, b) => a.id - b.id);
	},

	/**
	 * A title as the window shows it: the lines split at '#', at most two.
	 *
	 * @param {string} title
	 * @return {Array<string>}
	 */
	titleLines(title) {
		return String(title || '')
			.split('#')
			.map(line => line.trim())
			.filter(Boolean)
			.slice(0, 2);
	}
};

export default TipBoxTable;
