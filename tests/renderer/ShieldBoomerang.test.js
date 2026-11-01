import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { SHIELD, heading, planBoomerang, shieldAt, trailAt } from 'Renderer/Effects/ShieldBoomerangSim.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Shield Boomerang (CR_SHIELDBOOMERANG, skill 251) as the official client (2020-12-29) plays it:
// 249 on the caster as each damage packet arrives (cru_shield boomerang.wav and the thrown shield,
// primitive 42), the hit flash 0 once per packet. Spec: effect-port/crusader-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Shield Boomerang wiring', () => {
	it('plays 249 on the caster at packet arrival and the hit flash once', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.CR_SHIELDBOOMERANG\] = \{ damageEffectIdOnCaster: 249, hitEffectId: 0, hitEffectOnce: true \};/
		);
		expect(effectTableSource().replace(/\r\n/g, '\n')).toMatch(/\n\t249: shieldBoomerangEffect,/);
		expect(read('DB/Effects/ShieldBoomerangEffect.js')).toContain("wav: 'effect/cru_shield boomerang'");
	});
});

describe('heading (whole degrees, as the client takes it)', () => {
	it('reads the axes', () => {
		expect(heading(1, 0)).toBe(0);
		expect(heading(0, 1)).toBe(90);
		expect(heading(-1, 0)).toBe(180);
		expect(heading(0, -1)).toBe(270);
	});

	it('rounds away from the x axis and mirrors below it', () => {
		expect(heading(Math.cos(Math.PI / 6), 0.5)).toBe(30);
		expect(heading(1, 0.01)).toBe(1);
		expect(heading(1, -0.01)).toBe(359);
	});
});

describe('thrown shield (primitive 42)', () => {
	const plan = planBoomerang([0, 0, 0], [25, 0, 0]); // 5 cells along +x

	it('starts 8 units up, white, spinning 15 degrees a tick', () => {
		expect(shieldAt(plan, 0)).toMatchObject({ x: 0, y: 0, up: 8, alpha: 255, angle: 0 });
		expect(shieldAt(plan, 1).angle).toBe(345);
		expect(shieldAt(plan, 2).angle).toBe(330);
		expect(SHIELD.half).toBe(7);
	});

	it('flies out 2 units a tick until it passes the target', () => {
		expect(shieldAt(plan, 1).x).toBeCloseTo(2);
		expect(shieldAt(plan, 12).phase).toBe(0);
		expect(shieldAt(plan, 13).phase).toBe(1); // 13 x 2 > 25
		expect(shieldAt(plan, 13).x).toBeCloseTo(26);
	});

	it('swings round 5 degrees a tick until it heads back at the caster, then fades 12 a tick', () => {
		expect(shieldAt(plan, 14).dir).toBe(5);
		const back = plan.states.findIndex(s => s.phase === 2);
		const s = plan.states[back];
		expect(Math.abs(s.dir - heading(-s.x, -s.y))).toBeLessThanOrEqual(SHIELD.aim + SHIELD.turn);
		expect(plan.states[back + 1].alpha).toBe(255 - 12);
		expect(plan.last - back).toBe(22); // 255 / 12, rounded up
		expect(shieldAt(plan, plan.last)).toBe(null);
	});

	it('comes back as quickly on a target next to or under the caster', () => {
		const far = planBoomerang([0, 0, 0], [25, 0, 0]).last;
		for (const d of [0, 0.5, 1.5]) {
			const near = planBoomerang([0, 0, 0], [d, 0, 0]);
			expect(near.states[1].phase).toBe(0); // one step out first
			expect(near.last).toBeLessThan(120); // about 1.5 s, not the 499-tick limit
			expect(Math.abs(near.last - far)).toBeLessThanOrEqual(10);
		}
		// A close target's height is spread over the step, not the shorter distance
		expect(planBoomerang([0, 0, 0], [1, 0, 1]).states[1].up).toBeCloseTo(8 + 1); // not 8 + 2
	});

	it('follows the ground out and back', () => {
		const up = planBoomerang([0, 0, 0], [20, 0, 5]);
		expect(up.states[1].up).toBeCloseTo(8 + 0.5);
		const back = up.states.findIndex(s => s.phase === 2);
		expect(up.states[back + 1].up).toBeCloseTo(up.states[back].up - 0.5);
	});

	it('trails three copies refreshed every third tick, 150 then 25 and 25 fainter', () => {
		expect(trailAt(plan, 0, 2)).toBe(null);
		expect(trailAt(plan, 0, 3)).toMatchObject({ x: shieldAt(plan, 2).x, alpha: 105 });
		expect(trailAt(plan, 0, 5)).toMatchObject({ x: shieldAt(plan, 2).x, alpha: 105 });
		expect(trailAt(plan, 1, 5)).toBe(null);
		expect(trailAt(plan, 1, 6)).toMatchObject({ x: shieldAt(plan, 2).x, alpha: 80 });
		expect(trailAt(plan, 2, 9)).toMatchObject({ x: shieldAt(plan, 2).x, alpha: 55 });
		expect(trailAt(plan, 0, 9).angle).toBe(shieldAt(plan, 8).angle);
	});
});
