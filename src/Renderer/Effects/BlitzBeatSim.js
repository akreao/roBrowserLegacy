/**
 * Renderer/Effects/BlitzBeatSim.js
 *
 * The numbers of Blitz Beat's hit (effect 115) in the official client
 * (kRO 2025-07-16, 0xba4960), without any WebGL:
 *  - on its first tick, 10 ac_center2.tga streaks (primitive 16: two crossed
 *    quads, update 0xb50fd0, draw 0xb623e0) that shoot backwards through the
 *    target along the line it faces;
 *  - from tick 36, every 3 ticks, one magic_green.tga cone band (primitive 13)
 *    for each hit of the damage packet;
 *  - hunter_blitzbeat_1st.wav on tick 5 and hunter_blitzbeat.wav on tick 30.
 *
 * Units are the client's: 5 to a cell, y down (negative is up), angles in degrees.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

const DEG = Math.PI / 180;

/** One streak (primitive 16) as the effect sets it up. */
export const STREAK = {
	count: 10,
	life: 20,
	ahead: 15, // starts this far along the facing line
	ring: 3.5, // around the target, at a random angle
	height: 7, // above the ground
	speed: -1.2, // along the facing line, per tick
	accel: -0.1,
	changeTick: 10, // speed and accel are replaced on this tick
	changeSpeed: -0.3,
	changeAccel: 0.001,
	lengthMin: 2, // half length, 2.0..5.9 in steps of 0.1
	lengthSteps: 40,
	lengthSpeed: 0.1,
	lengthAccel: -0.01,
	thickness: 0.2, // half width of each of the two crossed quads
	alphaStep: 125,
	alphaMax: 250,
	fadeTick: 18 // life - 2
};

/** The cone bands (primitive 13). */
export const CONE = {
	firstTick: 36,
	every: 3,
	life: 12
};

/** The two sounds, on their ticks. */
export const SOUNDS = [
	{ tick: 5, wav: 'effect/hunter_blitzbeat_1st' },
	{ tick: 30, wav: 'effect/hunter_blitzbeat' }
];

/**
 * A new streak.
 *
 * @param {function} [random] returns a number in [0, 1)
 * @return {object}
 */
export function createStreak(random = Math.random) {
	const angle = Math.floor(random() * 360) * DEG;
	return {
		age: 0,
		base: [Math.cos(angle) * STREAK.ring, -STREAK.height, -Math.sin(angle) * STREAK.ring],
		travel: STREAK.ahead,
		speed: STREAK.speed,
		accel: STREAK.accel,
		length: (Math.floor(random() * STREAK.lengthSteps) + STREAK.lengthMin * 10) / 10,
		lengthSpeed: STREAK.lengthSpeed,
		alpha: 0,
		alphaSpeed: STREAK.alphaStep
	};
}

/**
 * One tick of a streak, in the order of the client's update.
 *
 * @param {object} s from createStreak
 */
export function stepStreak(s) {
	if (s.age === STREAK.changeTick) {
		s.speed = STREAK.changeSpeed;
		s.accel = STREAK.changeAccel;
	}
	s.speed += s.accel;
	s.travel += s.speed;
	s.lengthSpeed += STREAK.lengthAccel;
	s.length += s.lengthSpeed;
	if (s.age === STREAK.fadeTick) {
		s.alphaSpeed = -s.alpha / (STREAK.life - s.age);
	}
	s.alpha = Math.min(Math.max(s.alpha + s.alphaSpeed, 0), STREAK.alphaMax);
	s.age++;
}

/**
 * @param {object} s
 * @return {boolean} still drawn
 */
export function streakAlive(s) {
	return s.age <= STREAK.life;
}

/**
 * The two crossed quads of a streak, relative to the target, each corner in
 * the order the batch draws them (UV (0,0) (1,0) (1,1) (0,1)). The long side
 * runs along the facing line (the client's local z, turned by yaw), one quad
 * is level and the other upright.
 *
 * @param {object} s
 * @param {number} yaw degrees, the target's facing angle
 * @return {Array} two arrays of four [x, y, z]
 */
export function streakQuads(s, yaw) {
	const sy = Math.sin(yaw * DEG);
	const cy = Math.cos(yaw * DEG);
	const forward = [sy, 0, cy];
	const side = [cy, 0, -sy];
	const up = [0, 1, 0];
	const c = [s.base[0] + forward[0] * s.travel, s.base[1], s.base[2] + forward[2] * s.travel];
	const w = s.length;
	const h = STREAK.thickness;
	const corner = (across, a, b) => [
		c[0] + across[0] * a + forward[0] * b,
		c[1] + across[1] * a + forward[1] * b,
		c[2] + across[2] * a + forward[2] * b
	];
	return [side, up].map(across => [
		corner(across, h, w),
		corner(across, h, -w),
		corner(across, -h, -w),
		corner(across, -h, w)
	]);
}

/**
 * Ticks the cone bands start on, one per hit.
 *
 * @param {number} hitCount the damage packet's hit count
 * @return {Array} ticks
 */
export function coneTicks(hitCount) {
	const ticks = [];
	for (let i = 0; i < Math.max(1, Math.floor(hitCount) || 1); i++) {
		ticks.push(CONE.firstTick + i * CONE.every);
	}
	return ticks;
}
