import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import StatusConst from 'DB/Status/StatusState.js';
import { stepFlight, flightPx, flyingLiftPx, HOVER_PX, SIT_PX } from 'Renderer/Entity/FlyingLift.js';

// Official 0xc577f0: a flying body (Star Gladiator Union) floats 20 px up while it
// stands or walks, bobbing 4 px, and drops to the ground for other actions.
const FRAME = 1000 / 60;
const ACTION = { IDLE: 0, WALK: 1, SIT: 2, ATTACK: 3 };
const flyer = action => ({ ACTION, action, _effectState: StatusConst.EffectState.FLYING });

describe('Flying lift', () => {
	it('rises one pixel every 15 frames up to the hover height', () => {
		const state = { angle: 0, base: 0 };
		for (let i = 0; i < 15; i++) {
			stepFlight(state, HOVER_PX);
		}
		expect(state.base).toBe(1);
		for (let i = 0; i < 15 * 40; i++) {
			stepFlight(state, HOVER_PX);
		}
		expect(state.base).toBe(HOVER_PX);
	});

	it('bobs 4 pixels around the base over a 3 second cycle', () => {
		expect(flightPx({ angle: 90, base: 20 })).toBe(24);
		expect(flightPx({ angle: 270, base: 20 })).toBe(16);
		expect(flightPx({ angle: 270, base: 0 })).toBe(0);
	});

	it('drops a pixel every frame when not standing, walking or sitting', () => {
		const state = { angle: 0, base: 20 };
		for (let i = 0; i < 5; i++) {
			stepFlight(state, 0);
		}
		expect(state.base).toBe(15);
	});

	it('floats higher while sitting, and settles back down after', () => {
		const state = { angle: 0, base: 20 };
		for (let i = 0; i < 15 * 200; i++) {
			stepFlight(state, SIT_PX);
		}
		expect(state.base).toBe(SIT_PX);
		for (let i = 0; i < 15; i++) {
			stepFlight(state, HOVER_PX);
		}
		expect(state.base).toBe(SIT_PX - 1);
	});

	it('lifts only entities with the flying option', () => {
		const walker = { ACTION, action: ACTION.IDLE, _effectState: 0 };
		expect(flyingLiftPx(walker, 1000)).toBe(0);
		expect(flyingLiftPx(walker, 60000)).toBe(0);

		const entity = flyer(ACTION.IDLE);
		flyingLiftPx(entity, 1000);
		let now = 1000;
		for (let i = 0; i < 400; i++) {
			now += FRAME * 15;
			flyingLiftPx(entity, now);
		}
		expect(entity._flight.base).toBe(HOVER_PX);
		expect(flyingLiftPx(entity, now)).toBeGreaterThanOrEqual(16);

		entity.action = ACTION.ATTACK;
		flyingLiftPx(entity, now + FRAME * 30);
		expect(entity._flight.base).toBe(0);
	});

	it('raises every sprite layer but the shadow, and the click box with them', () => {
		const code = readFileSync(join(process.cwd(), 'src/Renderer/Entity/EntityRender.js'), 'utf8');
		expect(code).toContain('this._flyLiftPx = flyingLiftPx(this, Date.now());');
		expect(code).toMatch(/type !== 'shadow' && type !== 'cartshadow'\) \{\s+SpriteRenderer\.offset\[1\] -= this\._flyLiftPx;/);
		expect(code).toContain('-(layer.pos[1] + pos[1]) + h + lift');
	});
});
