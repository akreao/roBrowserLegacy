/**
 * Renderer/Effects/SmaSwirlSim.js
 *
 * The numbers of Espa's dark swirls (effects 1204 and 1205, EF_SMA_BLACK)
 * in the official client (kRO 2025-07-16), without any WebGL.
 *
 * 1204 (0xbfb5b0 with 99, primitive 120: update 0xb46b50 case 0x78, draw
 * 0xb78c60) is a point that waits 3 ticks, then moves from the caster toward
 * the target at 0.8 units a tick, 5 to 10 units up. Every 8 ticks, starting
 * on the tick it would move, it launches a 1205 there, while its 100 ticks
 * last.
 *
 * 1205 (0xbfb760, primitive 121: update case 0x79, draw 0xb78950) is three
 * spinning ring_blue.tga bands around its point, blended dark grey
 * (70, 70, 70), for 100 ticks. Band k (0..2):
 *  - an arc of 315 degrees from 90k degrees, turning 3 + k degrees a tick,
 *    in 22 points 15 degrees apart;
 *  - starts on a circle of 2.4 + 0.2k units and leans out and up at
 *    55 - 5k degrees, each point as far as (13 - 2k) * sin(9j) * sin(age),
 *    the age in degrees up to 90: a petal that opens over 90 ticks;
 *  - alpha up by 5 a tick to 180, down by 5 a tick from tick 60.
 *
 * Units: the client's world units (5 to a cell), y down; angles in degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** The moving point (1204). */
export const SMA = {
	life: 100,
	wait: 3, // its counter starts at -3
	speed: 0.8,
	every: 8,
	up: 10, // less r(5)
	upRange: 5
};

/** The swirl (1205). */
export const SWIRL = {
	life: 100,
	bands: 3,
	span: 315,
	step: 15, // span / 20, in whole degrees
	points: 22,
	heights: 21, // the last point reuses the 21st height
	radius: 2.4, // + 0.2k
	radiusStep: 0.2,
	height: 13, // - 2k
	heightStep: 2,
	lean: 55, // - 5k
	leanStep: 5,
	turn: 3, // + k degrees a tick
	start: 90, // k * 90
	alphaStep: 5,
	alphaMax: 180,
	riseUntil: 40,
	fallFrom: 60, // life - 40
	grow: 90, // ticks the petal takes to open
	color: [70, 70, 70]
};

const rad = Math.PI / 180;

/**
 * The swirls a 1204 launches.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array} { tick (from the 1204's start), along (units toward the target), up (units) }
 */
export function planSwirls(random = Math.random) {
	const up = SMA.up - Math.floor(random() * SMA.upRange);
	const out = [];
	// Update u leaves the counter at u - 3; a swirl on each counter that is a multiple of 8.
	for (let u = 1; u <= SMA.life; u++) {
		const counter = u - SMA.wait;
		if (counter >= 0 && counter % SMA.every === 0) {
			out.push({ tick: u - 1, along: SMA.speed * counter, up });
		}
	}
	return out;
}

/**
 * Alpha (0..180) of a band after `n` updates.
 *
 * @param {number} n
 * @return {number}
 */
export function bandAlpha(n) {
	let alpha = 0;
	for (let c = 1; c <= n; c++) {
		if (c >= SWIRL.fallFrom) {
			alpha = Math.max(alpha - SWIRL.alphaStep, 0);
		} else if (c < SWIRL.riseUntil) {
			alpha = Math.min(alpha + SWIRL.alphaStep, SWIRL.alphaMax);
		}
	}
	return alpha;
}

/**
 * The points of band k after `n` updates, around its centre: for each, the
 * inner point on the circle and the outer one leaning out and up.
 *
 * @param {number} k band 0..2
 * @param {number} n updates
 * @return {Array} { inner: [x, y, z], outer: [x, y, z] } in units, y down
 */
export function bandPoints(k, n) {
	const radius = SWIRL.radius + SWIRL.radiusStep * k;
	const height = SWIRL.height - SWIRL.heightStep * k;
	const lean = (SWIRL.lean - SWIRL.leanStep * k) * rad;
	const start = SWIRL.start * k + (SWIRL.turn + k) * n;
	const open = Math.sin(Math.min(n, SWIRL.grow) * rad);
	const out = [];
	for (let i = 0; i < SWIRL.points; i++) {
		const a = (start + SWIRL.step * i) * rad;
		const j = Math.min(i, SWIRL.heights - 1);
		const h = Math.max(height * Math.sin(9 * j * rad) * open, 0);
		const c = Math.cos(a);
		const s = Math.sin(a);
		const reach = radius + h * Math.cos(lean);
		out.push({
			inner: [radius * c, 0, radius * s],
			outer: [reach * c, -h * Math.sin(lean), reach * s]
		});
	}
	return out;
}
