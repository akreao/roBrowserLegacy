/**
 * DB/Effects/ReleaseEffect.js
 *
 * Release (WL_RELEASE): effect 751 EF_FIREBALL2 as the official client (kRO
 * 2025-07-16, 0xbabc20) plays it on the caster, aimed at the target, when the
 * use packet succeeds. Fire Ball's code (effect 24) with three tinted sets:
 * on ticks 0-3 (155, 155, 255), 6-9 (155, 255, 155) and 12-15 (255, 155, 155)
 * one fireball sprite a tick flies from 15 units up to the target over 20
 * ticks, scale 1, alpha 200, 160, 120, 80 within each set. EF_FireBall.wav
 * once, on tick 5. Spec: effect-port/warlock-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

const TICK_MS = 1000 / 60;

/** Each set's first tick and tint. */
const SETS = [
	{ start: 0, color: [155, 155, 255] },
	{ start: 6, color: [155, 255, 155] },
	{ start: 12, color: [255, 155, 155] }
];

/**
 * The 12 fireballs: tick and alpha (0-255) and tint.
 *
 * @return {Array<object>}
 */
export function releaseBalls() {
	const balls = [];
	for (const set of SETS) {
		for (let i = 0; i < 4; i++) {
			balls.push({ tick: set.start + i, alpha: 40 * (5 - i), color: set.color });
		}
	}
	return balls;
}

/** EffectTable row for 751. */
export const releaseEffect = [
	...releaseBalls().map(ball => ({
		type: '3D',
		spriteName: 'fireball',
		playSprite: true,
		attachedEntity: false,
		fromSrc: true,
		rotateToTarget: true,
		rotateWithCamera: true,
		zOffset: 3,
		delayStart: ball.tick * TICK_MS,
		duration: 20 * TICK_MS,
		alphaMax: ball.alpha / 255,
		red: ball.color[0] / 255,
		green: ball.color[1] / 255,
		blue: ball.color[2] / 255,
		size: 100,
		zIndex: 1
	})),
	{
		wav: 'effect/ef_fireball',
		delayWav: 5 * TICK_MS
	}
];
