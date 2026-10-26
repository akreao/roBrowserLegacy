/**
 * Renderer/Effects/ThrownStoneSim.js
 *
 * The official client's Throw Stone stone (effect 308, EF_THROWITEM3), without
 * any WebGL, so it can be tested on its own. Spec: effect-port/thief-skills.md.
 *
 * As the official client plays it, on the caster as the damage packet arrives,
 * aimed at the target's position:
 *
 *  - One billboard of the stone item image, 4 x 4 units, white, alpha-blended,
 *    alpha 255. No sound.
 *  - It starts 8 units above the caster and flies straight at the target at
 *    2 units a tick; it arrives after n = floor(distance / 2) + 1 ticks. Its
 *    height goes linearly from the caster's to the target's, plus an arc of
 *    10 x sin(180 x t) units, t = tick / n (capped at 1).
 *  - It spins 10 degrees a tick.
 *  - It moves while t <= 1.05; then it stays and loses 20 alpha a tick.
 *  - Three copies trail it, refreshed every second tick: the first takes the
 *    stone's last position with alpha - 150, each next one the copy ahead's
 *    with 25 less again.
 *
 * Throw Venom Knife's knife (effect 600, EF_THROWITEM6) is the same flight with
 * its own numbers (VENOM_KNIFE): 8 x 8 units, tinted (255, 200, 255), 3 units
 * a tick, an arc of 1 unit, starting turned 330 degrees and spinning 45 a
 * tick. Spec: effect-port/assassin-skills.md.
 *
 * Units are the client's: world units (5 to a cell), ticks (60 a second).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Numbers of the throw. */
export const STONE = {
	speed: 2, // units a tick
	lift: 8, // start and end height above the ground
	arc: 10, // arc height
	spin: 10, // degrees a tick
	moveUntil: 1.05, // t it stops at
	fade: 20, // alpha lost a tick once stopped
	half: 2, // half width
	trail: [150, 25, 25], // alpha each trailing copy loses from the one ahead
	startAngle: 0 // degrees on the first update
};

/** Stone image, under data/texture (유저인터페이스/item/돌.bmp). */
export const STONE_TEXTURE = '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xb5\xb9.bmp';
STONE.texture = STONE_TEXTURE;

/** Numbers of Throw Venom Knife's knife (effect 600): the stone's, with these changes. */
export const VENOM_KNIFE = Object.assign({}, STONE, {
	speed: 3,
	arc: 1,
	spin: 45,
	startAngle: 330,
	half: 4,
	tint: [255, 200, 255],
	// 유저인터페이스/item/베넘나이프.bmp
	texture:
		'\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xba\xa3\xb3\xd1\xb3\xaa\xc0\xcc\xc7\xc1.bmp'
});

/**
 * @param {number[]} from start [x, y, height] in units
 * @param {number[]} to end [x, y, height] in units
 * @param {object} [kind] STONE or VENOM_KNIFE
 * @return {object} the throw
 */
export function planThrow(from, to, kind = STONE) {
	const dx = to[0] - from[0];
	const dy = to[1] - from[1];
	const dist = Math.sqrt(dx * dx + dy * dy);
	return {
		from,
		dist,
		kind,
		dir: dist > 0 ? [dx / dist, dy / dist] : [1, 0],
		climb: dist > 0 ? (kind.speed / dist) * (to[2] - from[2]) : 0,
		ticks: Math.floor(dist / kind.speed) + 1
	};
}

/**
 * The stone after k updates.
 *
 * @param {object} t from planThrow
 * @param {number} k
 * @return {object} { x, y, up } in units (up from the caster's ground), alpha 0-255, angle
 */
export function stoneAt(t, k) {
	const kind = t.kind || STONE;
	let moves = 0;
	while (moves < k && (moves + 1) / t.ticks <= kind.moveUntil) {
		moves++;
	}
	const s = Math.min(moves / t.ticks, 1);
	return {
		x: t.from[0] + t.dir[0] * kind.speed * moves,
		y: t.from[1] + t.dir[1] * kind.speed * moves,
		up: kind.lift + t.climb * moves + kind.arc * Math.sin(Math.PI * s),
		alpha: Math.max(255 - kind.fade * (k - moves), 0),
		angle: (kind.startAngle + kind.spin * k) % 360
	};
}

/**
 * Trailing copy i (0 nearest) after k updates, or null when it does not show.
 * On each odd update j the copies take, in turn: copy 2 copy 1, copy 1 copy 0,
 * copy 0 the stone as it was before update j. So after the refresh on j, copy i
 * is the stone after j - 1 - 2i updates, valid once j - 2i >= 3.
 *
 * @param {object} t from planThrow
 * @param {number} i
 * @param {number} k
 * @return {?object}
 */
export function trailAt(t, i, k) {
	const j = k % 2 === 1 ? k : k - 1; // last refresh
	if (j - 2 * i < 3) {
		return null;
	}
	const p = stoneAt(t, j - 1 - 2 * i);
	let alpha = p.alpha;
	for (let n = 0; n <= i; n++) {
		alpha -= (t.kind || STONE).trail[n];
	}
	if (alpha < 1) {
		return null;
	}
	p.alpha = alpha;
	return p;
}
