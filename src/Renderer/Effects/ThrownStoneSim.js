/**
 * Renderer/Effects/ThrownStoneSim.js
 *
 * The official client's thrown items, without any WebGL, so they can be tested
 * on their own: Throw Stone's stone (effect 308, EF_THROWITEM3) and the Ninja's
 * shuriken, kunai, huuma and coin (613-616, EF_THROWITEM7-10), which the client
 * draws with the same code and other numbers (NINJA_ITEM), and the Alchemist's
 * bottles (BOTTLE: Acid Terror's 298, Aid Potion's 299, Aid Berserk Potion's 541).
 * Specs: effect-port/thief-skills.md,
 * effect-port/ninja-skills.md, effect-port/alchemist-skills.md.
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
	startAngle: 0, // roll on the first tick
	moveUntil: 1.05, // t it stops at
	fade: 20, // alpha lost a tick once stopped
	half: 2, // half width
	trail: [150, 25, 25] // alpha each trailing copy loses from the one ahead
};

/**
 * The Ninja's thrown items (613-616): 8 x 8 units, 3 units a tick, almost no
 * arc, spinning 45 degrees a tick from 330, tinted (255, 200, 255).
 */
export const NINJA_ITEM = Object.assign({}, STONE, {
	speed: 3,
	arc: 1,
	spin: 45,
	startAngle: 330,
	half: 4,
	color: [255, 200, 255]
});

/** Stone image, under data/texture (유저인터페이스/item/돌.bmp). */
export const STONE_TEXTURE = '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xb5\xb9.bmp';

/** Throw Venom Knife's knife (effect 600): the Ninja's thrown item with the knife's image. */
export const VENOM_KNIFE = Object.assign({}, NINJA_ITEM, {
	// 유저인터페이스/item/베넘나이프.bmp
	texture:
		'\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/\xba\xa3\xb3\xd1\xb3\xaa\xc0\xcc\xc7\xc1.bmp'
});

/** Item images, under data/texture (유저인터페이스/item/). */
const ITEM = '\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/';

/**
 * The Alchemist's thrown bottles: 6 x 6 units, in a 30-unit arc, and always
 * 25 ticks in flight: the speed is distance / 25, so a bottle arrives after
 * 26 updates however far it goes. Spins 10 degrees a tick, as the stone.
 */
export const BOTTLE = Object.assign({}, STONE, {
	flight: 25, // ticks in flight, whatever the distance
	arc: 30,
	half: 3
});

/** Acid Terror's bottle (298, EF_THROWITEM): 빈병.bmp tinted green, alpha-blended. */
export const ACID_BOTTLE = Object.assign({}, BOTTLE, {
	texture: ITEM + '\xba\xf3\xba\xb4.bmp', // 빈병
	color: [135, 255, 135]
});

/** Aid Potion's bottle (299, EF_THROWITEM2): 빈포션병.bmp, tinted by the skill level (potionBottle). */
export const POTION_BOTTLE = Object.assign({}, BOTTLE, {
	texture: ITEM + '\xba\xf3\xc6\xf7\xbc\xc7\xba\xb4.bmp' // 빈포션병
});

/** Aid Berserk Potion's bottle (541, EF_THROWITEM5): 버서크포션.bmp, colour 4 (white, untinted). */
export const BERSERK_POTION = Object.assign({}, BOTTLE, {
	texture: ITEM + '\xb9\xf6\xbc\xad\xc5\xa9\xc6\xf7\xbc\xc7.bmp' // 버서크포션
});

/** Aid Potion's tints for levels 1-5: red, orange, yellow, white and blue potions. */
export const POTION_COLORS = [
	[255, 135, 135],
	[255, 205, 135],
	[255, 255, 135],
	[255, 255, 255],
	[135, 135, 255]
];

/**
 * Aid Potion's bottle for a skill level. The client clamps the level to 1-10
 * and uses it as the colour: 1-5 tinted and alpha-blended, 6 white and
 * additive, 7-10 not drawn.
 *
 * @param {number} level the use packet's level
 * @return {?object} the kind, or null when nothing is drawn
 */
export function potionBottle(level) {
	const colour = Math.min(Math.max(Math.floor(level) || 1, 1), 10);
	if (colour <= POTION_COLORS.length) {
		return Object.assign({}, POTION_BOTTLE, { color: POTION_COLORS[colour - 1] });
	}
	return colour === 6 ? Object.assign({}, POTION_BOTTLE, { blendMode: 2 }) : null;
}

/**
 * @param {number[]} from start [x, y, height] in units
 * @param {number[]} to end [x, y, height] in units
 * @param {object} [kind] STONE, NINJA_ITEM, VENOM_KNIFE or a BOTTLE
 * @return {object} the throw
 */
export function planThrow(from, to, kind = STONE) {
	const dx = to[0] - from[0];
	const dy = to[1] - from[1];
	const dist = Math.sqrt(dx * dx + dy * dy);
	// A bottle's speed comes from its flight time; with no distance it never moves
	const speed = kind.flight ? dist / kind.flight : kind.speed;
	return {
		kind,
		from,
		dist,
		speed,
		dir: dist > 0 ? [dx / dist, dy / dist] : [1, 0],
		climb: dist > 0 ? (speed / dist) * (to[2] - from[2]) : 0,
		ticks: kind.flight ? (dist > 0 ? kind.flight + 1 : 0) : Math.floor(dist / speed) + 1
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
	const kind = t.kind;
	let moves = 0;
	while (moves < k && (moves + 1) / t.ticks <= kind.moveUntil) {
		moves++;
	}
	const s = t.ticks > 0 ? Math.min(moves / t.ticks, 1) : 0;
	return {
		x: t.from[0] + t.dir[0] * t.speed * moves,
		y: t.from[1] + t.dir[1] * t.speed * moves,
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
		alpha -= t.kind.trail[n];
	}
	if (alpha < 1) {
		return null;
	}
	p.alpha = alpha;
	return p;
}
