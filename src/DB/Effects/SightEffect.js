/**
 * DB/Effects/SightEffect.js
 *
 * Sight (effect 22, EF_SIGHT) as the official client (kRO 2025-07-16, effect
 * function 0xbd11b0, lifetime 270 ticks) draws it. While the actor's Sight
 * state is on, the client relaunches 22 each time its 270 ticks run out
 * (CRenderObject::OnProcess), so the look keeps going until the state ends.
 *
 * Every even tick of a 270-tick cycle, at angle a = -5 x tick degrees, 15
 * units from the actor (x = 15 sin a, y = -15 cos a on the map), two sprite
 * primitives that follow the actor and live 20 ticks:
 *  - 이팩트\Sight.spr 20 units up, sinking 0.1 a tick, 3 ticks a frame, scale
 *    2.5 shrinking 0.1 a tick, alpha 150 falling 3 a tick;
 *  - Shadow.spr on the ground, 2 ticks a frame, scale 1.5 shrinking 0.06 a
 *    tick, alpha 120 falling 1 a tick.
 * Spec: effect-port/mage-audit.md (Sight).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';

/** Effect 22's lifetime, ticks: one orbit cycle. */
export const CYCLE = 270;

/** Ticks drawn per launch: Sight lasts 10 s (600 ticks); the state's end removes what is left. */
export const SPAN = 600;

/** Life of each sprite, ticks. */
export const LIFE = 20;

/** Orbit radius, client units. */
export const RADIUS = 15;

/**
 * The orbit point of a pair spawned on cycle tick `age`.
 *
 * @param {number} age even tick of the cycle
 * @return {{x: number, y: number}} cells from the actor
 */
export function orbitPoint(age) {
	const a = (-5 * age * Math.PI) / 180;
	return { x: (RADIUS * Math.sin(a)) / UNITS_PER_CELL, y: (-RADIUS * Math.cos(a)) / UNITS_PER_CELL };
}

/**
 * The sight sprite on its tick `t` (0 on the first).
 *
 * @param {number} t
 * @return {{up: number, scale: number, alpha: number}|null} up in client units, alpha 0-255
 */
export function sightAt(t) {
	if (t >= LIFE) {
		return null;
	}
	return { up: 20 - 0.1 * t, scale: 2.5 - 0.1 * t, alpha: Math.max(0, 150 - 3 * t) };
}

/**
 * The shadow on its tick `t`.
 *
 * @param {number} t
 * @return {{scale: number, alpha: number}|null}
 */
export function shadowAt(t) {
	if (t >= LIFE) {
		return null;
	}
	return { scale: 1.5 - 0.06 * t, alpha: Math.max(0, 120 - t) };
}

function sightSprite(point) {
	return {
		type: '3D',
		spriteName: 'sight',
		attachedEntity: true,
		alphaMax: 1,
		blendMode: 8,
		playSprite: true,
		sprDelay: 3 * PRIM_TICK_MS,
		duration: LIFE * PRIM_TICK_MS,
		track(t) {
			const s = sightAt(t);
			return (
				s && {
					x: point.x,
					y: point.y,
					z: s.up / UNITS_PER_CELL,
					size: s.scale * 100,
					alpha: s.alpha / 255
				}
			);
		}
	};
}

function shadowSprite(point) {
	return {
		type: '3D',
		shadowTexture: true,
		attachedEntity: true,
		alphaMax: 1,
		blendMode: 8,
		playSprite: true,
		sprDelay: 2 * PRIM_TICK_MS,
		duration: LIFE * PRIM_TICK_MS,
		track(t) {
			const s = shadowAt(t);
			return s && { x: point.x, y: point.y, size: s.scale * 100, alpha: s.alpha / 255 };
		}
	};
}

/**
 * Spawns the pairs as their ticks come, so a Sight never holds more than its
 * live sprites (10 pairs) in the effect list. Removing effect 22 from the
 * actor (the state ending) removes this emitter with them.
 */
export class SightEmitter {
	static ready = true;
	static renderBeforeEntities = true;
	static beforeRender() {}
	static afterRender() {}

	/**
	 * @param {object} manager EffectManager
	 * @param {object} Params the effect's params
	 */
	constructor(manager, Params) {
		this.manager = manager;
		this.Params = Params;
		this.startTick = Params.Inst.startTick;
		this.next = 0;
		this.ready = true;
	}

	/**
	 * Spawn every pair due by `tick`.
	 *
	 * @param {number} tick
	 */
	emit(tick) {
		// Pairs whose 20 ticks are already over (the emitter was off screen) are skipped
		while (this.next < SPAN && this.startTick + (this.next + LIFE) * PRIM_TICK_MS <= tick) {
			this.next += 2;
		}
		while (this.next < SPAN && this.startTick + this.next * PRIM_TICK_MS <= tick) {
			const point = orbitPoint(this.next % CYCLE);
			const startTick = this.startTick + this.next * PRIM_TICK_MS;
			[sightSprite(point), shadowSprite(point)].forEach((effect, i) => {
				this.manager.spamEffect({
					effect,
					Inst: { effectID: 22, duplicateID: this.next + i, startTick },
					Init: this.Params.Init
				});
			});
			this.next += 2;
		}
		if (this.next >= SPAN) {
			this.needCleanUp = true;
		}
	}

	render(gl, tick) {
		this.emit(tick);
	}
}

/** EffectTable row for 22. */
export const sightEffect = [
	{
		//EF_SIGHT	Sight
		// Each 270-tick cycle starts the orbit over, as the client relaunches 22
		type: 'FUNC',
		attachedEntity: true,
		func: function (Params) {
			this.add(new SightEmitter(this, Params), Params);
		}
	},
	{
		wav: 'effect/ef_sight'
	}
];
