/**
 * Renderer/Effects/ColdHitSim.js
 *
 * The numbers of the cold hit (effect 51, the water-element hit of Cold
 * Bolt, Frost Diver, Storm Gust and others) in the official client
 * (kRO 2025-07-16, 0xba6a80), without any WebGL. Both parts are drawn in
 * screen pixels around the target's feet, and follow it:
 *  - on tick 0, 9 ice.tga shards (primitive 2) flying out in a ring, every
 *    third one long, for 15 ticks;
 *  - on ticks 0 and 7, a smoke.tga puff (primitive 0) drifting up and
 *    growing, for 25 ticks.
 *
 * Units: screen pixels, y down; angles in degrees, 0 pointing up the screen.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** The shards (primitive 2). */
export const SHARD = {
	count: 9,
	life: 15,
	step: 40, // degrees between shards
	spread: 60, // the flight turns base - 15 + r(60)
	turn: -15,
	up: 20, // pixels above the feet
	alpha: 200,
	fadeTick: 5, // life - 10
	long: { every: 3, length: 100, lengthRange: 10, width: 10, speed: 12.8 },
	short: { length: 45, lengthRange: 5, width: 4, speed: 4.8 }
};

/** The puffs (primitive 0). */
export const PUFF = {
	ticks: [0, 7],
	life: 25,
	speed: 0.85,
	spread: 40, // the drift turns r(40) - 20
	size: 1, // half side
	grow: 6,
	growChangeTick: 10,
	growAfter: 0.5,
	alpha: 254,
	fadeTick: 17 // life - life / 3
};

/** The last tick on which anything shows. */
export const LAST_TICK = Math.max(SHARD.life, PUFF.ticks[PUFF.ticks.length - 1] + PUFF.life) - 1;

/**
 * Alphas the client's alpha update gives a primitive that holds `alpha`
 * until `fadeTick` and then fades to 0 by its end.
 *
 * @return {Array} alpha on ticks 0..life-1
 */
export function fadeAlphas(alpha, fadeTick, life) {
	const out = [];
	let step = 0;
	for (let age = 0; age < life; age++) {
		if (age === fadeTick) {
			step = -alpha / (life - age);
		}
		alpha = Math.max(alpha + step, 0);
		out.push(alpha);
	}
	return out;
}

export const SHARD_ALPHAS = fadeAlphas(SHARD.alpha, SHARD.fadeTick, SHARD.life);
export const PUFF_ALPHAS = fadeAlphas(PUFF.alpha, PUFF.fadeTick, PUFF.life);

const rad = Math.PI / 180;

/**
 * The shards, as they leave the feet.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array}
 */
export function createShards(random = Math.random) {
	const r = k => Math.floor(random() * k);
	const out = [];
	for (let i = 0; i < SHARD.count; i++) {
		const base = i * SHARD.step;
		const angle = base + SHARD.turn + r(SHARD.spread);
		const kind = i % SHARD.long.every === 0 ? SHARD.long : SHARD.short;
		const length = kind.length + r(kind.lengthRange);
		const speed = kind.speed + Math.floor(r(45) / 10);
		const start = r(5);
		out.push({
			angle,
			length,
			width: kind.width,
			speed,
			accel: -speed / SHARD.life / 1.5,
			x: Math.sin(base * rad) * start,
			y: -Math.cos(base * rad) * start - SHARD.up
		});
	}
	return out;
}

/**
 * Where a shard is after `ticks` updates.
 *
 * @param {object} shard
 * @param {number} ticks
 * @return {Array} [x, y] in pixels from the feet
 */
export function shardAt(shard, ticks) {
	let travel = 0;
	let speed = shard.speed;
	for (let t = 0; t < ticks; t++) {
		speed += shard.accel;
		travel += speed;
	}
	return [shard.x + Math.sin(shard.angle * rad) * travel, shard.y - Math.cos(shard.angle * rad) * travel];
}

/**
 * A shard's two triangles around its centre, in pixels: the left one, then
 * the right one, each [side, tail, head] as [x, y, u, v]. The long axis
 * points the way it flies; the tail is drawn white and opaque, the client's
 * own colour for that corner.
 *
 * @param {object} shard
 * @return {Array}
 */
export function shardTriangles(shard) {
	const h = shard.length / 2;
	const w = shard.width / 2;
	const skew = h - h / 1.2;
	const s = Math.sin(shard.angle * rad);
	const c = Math.cos(shard.angle * rad);
	const turn = (x, y, u, v) => [x * c - y * s, y * c + x * s, u, v];
	const tail = turn(0, h, 0.5, 1);
	const head = turn(0, -h, 0.5, 0);
	return [
		[turn(-w, -skew, 0, 0.5), tail, head],
		[turn(w, skew, 1, 0.5), tail, head]
	];
}

/**
 * A new puff.
 *
 * @param {number} born the effect tick it starts on
 * @param {function} [random] returns a number in [0, 1)
 * @return {object}
 */
export function createPuff(born, random = Math.random) {
	return { born, angle: Math.floor(random() * PUFF.spread) - PUFF.spread / 2 };
}

/**
 * A puff after `ticks` updates.
 *
 * @param {object} puff
 * @param {number} ticks
 * @return {object} { x, y, size } in pixels from the feet; size is half its side
 */
export function puffAt(puff, ticks) {
	const early = Math.min(ticks, PUFF.growChangeTick);
	const size = PUFF.size + early * PUFF.grow + (ticks - early) * PUFF.growAfter;
	const travel = ticks * PUFF.speed;
	return {
		x: Math.sin(puff.angle * rad) * travel,
		y: -Math.cos(puff.angle * rad) * travel,
		size
	};
}
