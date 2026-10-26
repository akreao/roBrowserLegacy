/**
 * Renderer/Effects/MammoniteCoinSim.js
 *
 * The official client's Mammonite coins (effect 10, EF_COIN), without any
 * WebGL, so they can be tested on their own. Spec: effect-port/merchant-skills.md.
 *
 * As the official client plays it, on the target when the Mammonite hit lands:
 *
 *  - Tick 20 of the effect: 5 coins (sprite 동전, 6 frames, one frame a tick),
 *    nothing after.
 *  - A coin lives L = 40 + r(30) ticks. It gets a heading r(12) x 30 degrees and
 *    starts 2 or 3 units from the target that way, raised 10 units. It follows
 *    the target.
 *  - Level: speed (50 + r(50)) / 100 units a tick along the heading, slowing by
 *    speed / L / 3.5 each tick (never below 0) before it moves.
 *  - Up: speed (50 + r(100)) / 25 units a tick, gravity 4 x that / L each tick
 *    before it moves. When it is moving down and below the ground it bounces
 *    back up at 2/3 of its speed, with a coin sound (EF_Coin1-3, at random).
 *  - Scale 2, constant. Alpha full, fading from tick L - floor(L / 3) to 0 at
 *    its end. One trailing copy where the coin was a tick earlier, at half its
 *    alpha and scale 1.5.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 * r(k) is a whole number from 0 to k - 1. "up" is height above the target's
 * feet, taken as the ground.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { fadeAlpha } from 'Renderer/Effects/StealSparkSim.js';

/** Numbers of the coins. */
export const COIN = {
	count: 5,
	startTick: 20,
	lift: 10,
	scale: 2,
	trailScale: 1.5
};

const r = (random, k) => Math.floor(random() * k);
const rad = d => (d * Math.PI) / 180;

/**
 * @param {function} [random] returns a number in [0, 1)
 * @return {Array<object>} the coins, in client units
 */
export function planCoins(random = Math.random) {
	const coins = [];
	for (let i = 0; i < COIN.count; i++) {
		const life = 40 + r(random, 30);
		const heading = r(random, 12) * 30;
		const dist = 2 + r(random, 2);
		const speed = (50 + r(random, 50)) / 100;
		const rise = (50 + r(random, 100)) / 25;
		coins.push({ life, heading, dist, speed, rise, sounds: [] });
	}
	coins.forEach(coin => {
		coin.path = flyCoin(coin);
		coin.sounds = coin.path.bounces.map(tick => ({ tick, wav: `effect/ef_coin${1 + r(random, 3)}` }));
	});
	return coins;
}

/**
 * Steps a coin through its life.
 *
 * @param {object} coin
 * @return {object} { dist, up } per tick (index = ticks done), and the ticks it bounced on
 */
export function flyCoin(coin) {
	const dist = [0];
	const up = [COIN.lift];
	const bounces = [];
	let v = coin.speed;
	let vUp = coin.rise;
	let d = 0;
	let h = COIN.lift;
	const slow = coin.speed / coin.life / 3.5;
	const gravity = (4 * coin.rise) / coin.life;
	for (let k = 1; k < coin.life; k++) {
		v = Math.max(v - slow, 0);
		d += v;
		vUp -= gravity;
		h += vUp;
		if (vUp < 0 && h < 0) {
			vUp = -vUp / 1.5;
			bounces.push(k);
		}
		dist.push(d);
		up.push(h);
	}
	return { dist, up, bounces };
}

/**
 * A coin after `age` ticks, or null outside its life.
 *
 * @param {object} coin from planCoins
 * @param {number} age
 * @return {?object} { x, y, up } in client units from the target, alpha 0-254
 */
export function coinAt(coin, age) {
	const k = Math.floor(age);
	if (k < 0 || k >= coin.life) {
		return null;
	}
	const h = rad(coin.heading);
	const d = coin.dist + coin.path.dist[k];
	return {
		x: Math.cos(h) * d,
		y: Math.sin(h) * d,
		up: coin.path.up[k],
		alpha: fadeAlpha(k, coin.life, coin.life - Math.floor(coin.life / 3))
	};
}

/**
 * The trailing copy after `age` ticks: where the coin was a tick earlier, at half its alpha.
 *
 * @param {object} coin from planCoins
 * @param {number} age
 * @return {?object} as coinAt
 */
export function coinTrailAt(coin, age) {
	const now = coinAt(coin, age);
	const before = coinAt(coin, age - 1);
	if (!now || !before) {
		return null;
	}
	return { x: before.x, y: before.y, up: before.up, alpha: now.alpha / 2 };
}
