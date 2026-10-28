/**
 * DB/Effects/MartyrsReckoningEffect.js
 *
 * Effect 366 (EF_BASH3D), Martyr's Reckoning's look on the caster, as the
 * official client (kRO 2025-07-16) plays it as each damage packet arrives:
 * 세크리파이스.wav on tick 22; on ticks 20 to 40 the doubled body (halo) and the
 * body coloured (255, 200, 200), the colour then coming back 8 a channel a
 * tick. Spec: effect-port/paladin-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Client ticks (1/60 s) of the doubled, coloured body. */
export const BODY = { from: 20, to: 40, green: 200, blue: 200, recover: 8 };

/**
 * The caster's body on a client tick of the effect.
 *
 * @param {number} tick
 * @return {?object} null before the body changes, else { halo, green, blue, done } (0-255)
 */
export function sacrificeBodyAt(tick) {
	if (tick < BODY.from) {
		return null;
	}
	const back = Math.max(0, tick - BODY.to) * BODY.recover;
	const green = Math.min(255, BODY.green + back);
	const blue = Math.min(255, BODY.blue + back);
	return { halo: tick <= BODY.to, green, blue, done: green >= 255 && blue >= 255 };
}

/** First part of the EffectTable row for 366: the sound and the body. */
export const martyrsReckoningBody = {
	//EF_BASH3D	   Martyr's Reckoning, on the caster as each damage packet arrives
	wav: 'effect/\xbc\xbc\xc5\xa9\xb8\xae\xc6\xc4\xc0\xcc\xbd\xba', //세크리파이스
	delayWav: 367, // tick 22
	type: 'FUNC',
	attachedEntity: true,
	func: Params => {
		const entity = Params.Init.ownerEntity;
		entity.animations.add(ms => {
			const body = sacrificeBodyAt(Math.floor((ms * 60) / 1000));
			if (!body) {
				return false;
			}
			entity._enableHalo = body.halo;
			entity._flashColor[0] = 1.0;
			entity._flashColor[1] = body.green / 255;
			entity._flashColor[2] = body.blue / 255;
			entity._flashColor[3] = 1.0;
			entity.recalculateBlendingColor();
			return body.done;
		});
	}
};
