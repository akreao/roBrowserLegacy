/**
 * Renderer/Effects/GraffitiSim.js
 *
 * The numbers of the official client's Graffiti (Rogue's Scribble, skill unit
 * 0xB0), kRO 2025-07-16, class CGraffiSkill. No rendering here.
 *
 * - The unit arrives in ZC_SKILL_ENTRY2 (0x1c9) with the caster's text.
 * - The text is written with effect\alpabet.bmp, a sheet of 32 x 32 glyphs,
 *   8 a row, into a 384 x 384 texture (0xdab780).
 * - That texture lies flat on the 18 x 18 cells around the unit, turned by
 *   the local player's facing at the moment the unit appears (0xdafa20).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Side of the text texture, in pixels. */
export const GRAFFITI_TEXTURE = 384;

/** Side of the square of cells the text covers. */
export const GRAFFITI_CELLS = 18;

/** Glyph cell in alpabet.bmp, in pixels; 8 glyphs a row. */
export const GLYPH_PX = 32;

/** Height of a line of text, in pixels. */
const LINE_PX = 36;

/** A line is full once a glyph would end past this x. */
const LINE_END = 351;

/** Width a letter or digit takes; anything else takes half. */
const WIDE = 32;
const NARROW = 16;

const code = c => c.charCodeAt(0);

/**
 * The glyph and width of one character, as the client picks them.
 *
 * @param {string} c
 * @return {{glyph: number, w: number}} glyph -1 draws nothing
 */
function glyphOf(c) {
	const n = code(c);
	if (n >= code('a') && n <= code('z')) {
		return { glyph: n - code('a') + 26, w: WIDE };
	}
	if (n >= code('A') && n <= code('Z')) {
		return { glyph: n - code('A'), w: WIDE };
	}
	if (n >= code('0') && n <= code('9')) {
		return { glyph: n - code('0') + 54, w: WIDE };
	}
	if (c === '?') {
		return { glyph: 53, w: NARROW };
	}
	if (c === '!') {
		return { glyph: 54, w: NARROW };
	}
	return { glyph: -1, w: NARROW };
}

/**
 * Where each glyph of the text goes in the texture.
 *
 * Lines start at the left edge. The first line starts lower the shorter the
 * text is. A word that would run past the line's end starts a new line at
 * the space before it; a glyph that would run past the end starts one too.
 * A space draws nothing and is as wide as the character before it.
 *
 * @param {string} text
 * @return {Array<{glyph: number, sx: number, sy: number, x: number, y: number, w: number}>}
 */
export function layoutGraffiti(text) {
	const glyphs = [];
	const len = text.length;
	let x = 0;
	let y = Math.trunc((144 - len) / 24) * LINE_PX;
	let w = NARROW;

	for (let i = 0; i < len; i++) {
		const c = text[i];
		let glyph = -1;

		if (c === ' ') {
			let end = x;
			for (let k = i + 1; k < len && text[k] !== ' '; k++) {
				end += WIDE;
			}
			if (end >= 352) {
				y += LINE_PX;
				x = 0;
			}
		} else {
			({ glyph, w } = glyphOf(c));
		}

		if (x + w > LINE_END) {
			y += LINE_PX;
			x = 0;
		}
		if (glyph >= 0) {
			glyphs.push({
				glyph,
				sx: (glyph & 7) * GLYPH_PX,
				sy: (glyph >> 3) * GLYPH_PX,
				x,
				y,
				w
			});
		}
		x += w;
	}

	return glyphs;
}

/**
 * Texture coordinate of a ground vertex, turned by the given facing.
 *
 * @param {number} dx vertex x - unit x, in cells
 * @param {number} dy vertex y - unit y, in cells
 * @param {number} angle facing in degrees (0 south, 90 east)
 * @return {number[]} [u, v]
 */
export function graffitiUV(dx, dy, angle) {
	const a = (angle * Math.PI) / 180;
	const s = Math.sin(a);
	const c = Math.cos(a);
	const half = GRAFFITI_CELLS / 2;
	return [1 - (dy * s + dx * c + half) / GRAFFITI_CELLS, (dy * c - dx * s + half) / GRAFFITI_CELLS];
}
