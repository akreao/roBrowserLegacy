import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { SMITE, launchTick, planShield, randomHeading, shieldAt } from 'Renderer/Effects/RapidSmitingSim.js';
import { trailAt } from 'Renderer/Effects/ShieldBoomerangSim.js';
import { launchCentre, smiteShieldEffect } from 'DB/Effects/RapidSmitingEffect.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Rapid Smiting (PA_SHIELDCHAIN, skill 480) as the official client (kRO 2025-07-16) plays it: the
// holy cast aura 58, 520 on the target as the damage packet arrives (cru_shield boomerang.wav and
// five shields, prim 116, 3 ticks apart), the hit flash 0 on every hit. Spec: effect-port/paladin-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Rapid Smiting wiring', () => {
	it('plays 520 on the target at packet arrival and the hit flash on every hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.PA_SHIELDCHAIN\] = \{ castAuraEffectId: 58, damageEffectIdOnTarget: 520, hitEffectId: 0 \};/
		);
		expect(effectTableSource().replace(/\r\n/g, '\n')).toMatch(/\n\t520: rapidSmitingEffect,/);
		expect(effectTableSource().replace(/\r\n/g, '\n')).not.toMatch(/ef_shield_projectile/);
		expect(read('DB/Effects/RapidSmitingEffect.js')).toContain("wav: 'effect/cru_shield boomerang'");
	});

	it('launches five shields 3 ticks apart', () => {
		expect(SMITE.count).toBe(5);
		expect([0, 1, 2, 3, 4].map(launchTick)).toEqual([0, 3, 6, 9, 12]);
	});

	it('picks a whole-degree heading', () => {
		expect(randomHeading(() => 0)).toBe(0);
		expect(randomHeading(() => 0.9999)).toBe(359);
		expect(randomHeading(() => 0.5)).toBe(180);
	});
});

describe('one shield (primitive 116)', () => {
	const plan = planShield(0); // flying along +x

	it('starts 37.5 units behind the target, 8 up, alpha 25, half size 5', () => {
		expect(shieldAt(plan, 0)).toMatchObject({ x: -37.5, up: 8, alpha: 25, angle: 0 });
		expect(shieldAt(plan, 0).y).toBeCloseTo(0);
		expect(SMITE.half).toBe(5);
	});

	it('moves 2.5 units a tick and passes through the target on its 15th update', () => {
		expect(shieldAt(plan, 1).x).toBeCloseTo(-35);
		expect(shieldAt(plan, 15).x).toBeCloseTo(0);
		expect(shieldAt(plan, 20).x).toBeCloseTo(12.5);
	});

	it('gains 45 alpha a tick for 5 ticks, then loses 10 a tick from its 15th update', () => {
		expect([1, 2, 5, 6, 14].map(k => shieldAt(plan, k).alpha)).toEqual([70, 115, 250, 250, 250]);
		expect(shieldAt(plan, 15).alpha).toBe(240);
		expect(shieldAt(plan, 38).alpha).toBe(10);
		expect(shieldAt(plan, 39)).toBeNull();
		expect(plan.last).toBe(39);
	});

	it('spins -15 degrees a tick', () => {
		expect(shieldAt(plan, 1).angle).toBe(345);
		expect(shieldAt(plan, 2).angle).toBe(330);
	});

	it('flies along its heading', () => {
		const up = planShield(90);
		expect(shieldAt(up, 0).y).toBeCloseTo(-37.5);
		expect(shieldAt(up, 15).y).toBeCloseTo(0);
		expect(shieldAt(up, 15).x).toBeCloseTo(0);
	});

	it('trails three copies, refreshed every third tick, 150 then 25 then 25 fainter', () => {
		expect(trailAt(plan, 0, 2)).toBeNull();
		expect(trailAt(plan, 0, 3)).toBeNull(); // 115 - 150: nothing to see yet
		expect(trailAt(plan, 0, 9)).toMatchObject({ alpha: 100 });
		expect(trailAt(plan, 0, 9).x).toBeCloseTo(shieldAt(plan, 8).x);
		expect(trailAt(plan, 1, 12)).toMatchObject({ alpha: 75 });
		expect(trailAt(plan, 1, 12).x).toBeCloseTo(shieldAt(plan, 8).x);
		expect(trailAt(plan, 2, 15)).toMatchObject({ alpha: 50 });
	});
});

describe('shield sprites', () => {
	it('share the texture, so they release it when they end', () => {
		expect(smiteShieldEffect(planShield(0), 0, -1).sharedTexture).toBe(true);
	});

	it('fly through the target where it stands when the shield is launched', () => {
		const target = { position: [10, 10, 0] };
		const centre = launchCentre(target, [10, 10, 0]);
		const late = smiteShieldEffect(planShield(0), 12, -1, centre);
		expect(late.track(5)).toBeNull(); // not launched yet
		target.position = [11, 10, 0]; // walked a cell before the launch
		expect(late.track(12 + 15).x).toBeCloseTo(1);
		target.position = [12, 10, 0]; // the flight keeps its launch centre
		expect(late.track(12 + 16).x).toBeCloseTo(1 + 2.5 / 5);
	});

	it('take the launch centre on the effect clock, not when the texture is ready', () => {
		const target = { position: [10, 10, 0] };
		const centre = launchCentre(target, [10, 10, 0]);
		const shield = smiteShieldEffect(planShield(0), 12, -1, centre);
		target.position = [11, 10, 0];
		centre.take(); // the launch-tick timer
		target.position = [14, 10, 0]; // walked on while the texture loaded
		expect(shield.track(12 + 15).x).toBeCloseTo(1);
	});
});
