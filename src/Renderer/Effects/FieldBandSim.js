/**
 * Renderer/Effects/FieldBandSim.js
 *
 * Motion and geometry of the official client's ground band (primitive 36),
 * without any WebGL, so it can be tested on its own. Volcano (effect 239,
 * ring_red.tga), Deluge (240, ring_blue.tga) and Violent Gale (241,
 * magic_green.tga) show one under every cell of their skill unit, for as
 * long as the unit lasts.
 *
 * As the official client builds it:
 *
 *  - One band of 10 strips standing on a circle round the cell's centre and
 *    leaning out: 11 points 36 degrees apart, the last closing on the first,
 *    from a random start angle that never turns.
 *  - Point j (0 to 10) is 15 + 4.5 sin(9 j deg) sin(age deg) units tall, so
 *    the band is 15 units (3 cells) tall with one side wobbling.
 *  - It starts with foot radius 2.6, lean 80 degrees from the ground and a
 *    random alpha 0-99. Every tick the radius grows 0.04 and the lean drops 1.
 *    While the radius is under 2.5 the alpha climbs 20 a tick, otherwise it
 *    loses 2. When the lean would pass under 10 it stays 10 and the alpha is
 *    cut to 0. When the alpha reaches 0 a new cycle starts: radius 2.14, lean 74.
 *    So every 65 ticks or so the band stands up as a tight ring, fades in,
 *    then opens out flat while it fades. The random start alpha staggers cells.
 *  - Texture U: strip k from k/21 to (k+1)/21 (the left half of the ring
 *    texture); V 1 at the foot, 0 at the tip. Drawn white, normal alpha blending.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second), degrees.
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from './EffectPrimSim.js';

export { PRIM_TICK_MS as FIELD_BAND_TICK_MS };

const DEG = Math.PI / 180;
const f32 = Math.fround;

/** Strips of the band; it has one more point, the last closing the ring. */
export const STRIPS = 10;

/** Numbers of the band. */
export const FIELD_BAND = {
	height: 15,
	wobble: 0.3, // of the height
	pointStep: 9, // degrees of the wobble's sine per point
	angleStep: 36, // degrees between points
	radius: 2.6, // first foot radius
	radiusStep: 0.04, // a tick
	fadeInBelow: 2.5, // radius under which the band fades in
	alphaUp: 20,
	alphaDown: 2,
	lean: 80, // first lean from the ground
	leanMin: 10,
	cycleRadius: 2.14, // each new cycle
	cycleLean: 74
};

/** Number of vertices of the band (triangles, 5 floats each). */
export const FIELD_BAND_VERTICES = STRIPS * 6;

/**
 * A band as the client creates it.
 *
 * @param {function} [random] returns [0, 1)
 * @return {{angle: number, radius: number, lean: number, alpha: number, age: number}}
 */
export function createBand(random = Math.random) {
	return {
		angle: Math.floor(random() * 360),
		radius: f32(FIELD_BAND.radius),
		lean: FIELD_BAND.lean,
		alpha: Math.floor(random() * 100),
		age: 0
	};
}

/**
 * Advance a band by one tick, as the client's update does.
 *
 * @param {object} band from createBand
 */
export function stepBand(band) {
	band.age++;
	band.radius = f32(band.radius + f32(FIELD_BAND.radiusStep));
	band.lean--;
	if (band.lean < FIELD_BAND.leanMin) {
		band.lean = FIELD_BAND.leanMin;
		band.alpha = 0;
	}
	if (band.radius < FIELD_BAND.fadeInBelow) {
		band.alpha += FIELD_BAND.alphaUp;
	} else {
		band.alpha -= FIELD_BAND.alphaDown;
		if (band.alpha < 1) {
			band.alpha = 0;
			band.radius = f32(FIELD_BAND.cycleRadius);
			band.lean = FIELD_BAND.cycleLean;
		}
	}
}

/**
 * Height of point `j` (0 to 10) on the band's current tick, in world units.
 *
 * @param {object} band
 * @param {number} j
 * @return {number}
 */
export function pointHeight(band, j) {
	const h = FIELD_BAND.height;
	return h + h * FIELD_BAND.wobble * Math.sin(FIELD_BAND.pointStep * j * DEG) * Math.sin((band.age % 360) * DEG);
}

/**
 * Write one vertex in roBrowser's GL space, from client units about `center`.
 */
function vertex(out, i, center, x, y, up, u, v) {
	out[i + 0] = center[0] + 0.5 + x / UNITS_PER_CELL;
	out[i + 1] = -center[2] - up / UNITS_PER_CELL;
	out[i + 2] = center[1] + 0.5 + y / UNITS_PER_CELL;
	out[i + 3] = u;
	out[i + 4] = v;
	return i + 5;
}

/**
 * Fill `out` with the band's triangles.
 *
 * @param {Float32Array} out FIELD_BAND_VERTICES * 5 floats
 * @param {object} band
 * @param {Array} center cell position (x, y, height)
 * @return {number} vertices written
 */
export function buildBand(out, band, center) {
	const lean = Math.cos(band.lean * DEG);
	const rise = Math.sin(band.lean * DEG);
	let prev = null;
	let o = 0;
	for (let j = 0; j <= STRIPS; j++) {
		const angle = (j === STRIPS ? band.angle : (band.angle + j * FIELD_BAND.angleStep) % 360) * DEG;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const h = pointHeight(band, j);
		const point = {
			fx: band.radius * cos,
			fy: band.radius * sin,
			tx: (band.radius + h * lean) * cos,
			ty: (band.radius + h * lean) * sin,
			up: h * rise
		};
		if (prev) {
			const u0 = (j - 1) / 21;
			const u1 = j / 21;
			o = vertex(out, o, center, prev.fx, prev.fy, 0, u0, 1);
			o = vertex(out, o, center, point.fx, point.fy, 0, u1, 1);
			o = vertex(out, o, center, point.tx, point.ty, point.up, u1, 0);

			o = vertex(out, o, center, prev.tx, prev.ty, prev.up, u0, 0);
			o = vertex(out, o, center, point.tx, point.ty, point.up, u1, 0);
			o = vertex(out, o, center, prev.fx, prev.fy, 0, u0, 1);
		}
		prev = point;
	}
	return o / 5;
}
