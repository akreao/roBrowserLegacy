import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { COIN, planCoins, flyCoin, coinAt, coinTrailAt } from '../../src/Renderer/Effects/MammoniteCoinSim.js';
import { mammoniteEffect, coinEffect } from '../../src/DB/Effects/MammoniteEffect.js';

// Mammonite (MC_MAMMONITE, skill 42): 0 and 10 on the target once per damage packet when the hit
// lands. 10 is Maemor.str and, on tick 20, 5 coins thrown up that bounce with EF_Coin1-3.wav.
// Spec: effect-port/merchant-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const TICK = 1000 / 60;

let seed = 7;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('Mammonite coins', () => {
	it('plays 0 and 10 once when the hit lands, nothing at use', () => {
		expect(source).toMatch(/SkillEffect\[SK\.MC_MAMMONITE\] = \{ hitEffectId: \[0, 10\], hitEffectOnce: true \};/);
	});

	it('throws 5 coins within the client ranges', () => {
		const coins = planCoins(random);
		expect(coins).toHaveLength(5);
		for (const c of coins) {
			expect(c.life).toBeGreaterThanOrEqual(40);
			expect(c.life).toBeLessThanOrEqual(69);
			expect(c.heading % 30).toBe(0);
			expect([2, 3]).toContain(c.dist);
			expect(c.speed).toBeGreaterThanOrEqual(0.5);
			expect(c.speed).toBeLessThanOrEqual(0.99 + 1e-9);
			expect(c.rise).toBeGreaterThanOrEqual(2);
			expect(c.rise).toBeLessThanOrEqual(5.96 + 1e-9);
			c.sounds.forEach(s => expect(s.wav).toMatch(/^effect\/ef_coin[123]$/));
		}
	});

	it('peaks at a quarter of its life, falls, and bounces back at 2/3 speed with a sound', () => {
		const coin = { life: 60, heading: 0, dist: 2, speed: 0.8, rise: 4 };
		const path = flyCoin(coin);
		const top = path.up.indexOf(Math.max(...path.up));
		expect([14, 15]).toContain(top);
		expect(path.up[29]).toBeCloseTo(COIN.lift);
		expect(path.bounces.length).toBeGreaterThan(0);
		const b = path.bounces[0];
		expect(path.up[b]).toBeLessThan(0);
		expect(path.up[b + 1]).toBeGreaterThan(path.up[b]);
		// level speed slows by speed / life / 3.5 a tick, never backwards
		expect(path.dist[1]).toBeCloseTo(0.8 - 0.8 / 60 / 3.5);
	});

	it('fades out over its last third and has a trailing copy a tick behind', () => {
		const coin = { life: 60, heading: 90, dist: 3, speed: 0.5, rise: 3 };
		coin.path = flyCoin(coin);
		expect(coinAt(coin, 0)).toMatchObject({ up: 10, alpha: 254 });
		expect(coinAt(coin, 0).y).toBeCloseTo(3);
		expect(coinAt(coin, 39).alpha).toBe(254);
		expect(coinAt(coin, 40).alpha).toBeLessThan(254);
		expect(coinAt(coin, 59).alpha).toBe(0);
		expect(coinAt(coin, 60)).toBeNull();
		expect(coinTrailAt(coin, 0)).toBeNull();
		expect(coinTrailAt(coin, 10).up).toBeCloseTo(coinAt(coin, 9).up);
		expect(coinTrailAt(coin, 45).alpha).toBeCloseTo(coinAt(coin, 45).alpha / 2);
	});

	it('draws the coin sprite at scale 2, one frame a tick, and the trail at 1.5', () => {
		const coin = { life: 50, heading: 0, dist: 2, speed: 0, rise: 0, sounds: [] };
		coin.path = flyCoin(coin);
		const e = coinEffect(coin);
		expect(e.spriteName).toBe('\xb5\xbf\xc0\xfc');
		expect(e.playSprite).toBe(true);
		expect(e.sprDelay).toBeCloseTo(TICK);
		expect(e.attachedEntity).toBe(true);
		expect(e.track(0)).toMatchObject({ x: 0.4, z: 2, size: 200 });
		expect(coinEffect(coin, true).track(5).size).toBe(150);
		expect(e.track(50)).toBeNull();
	});

	it('plays Maemor.str without a start sound and spawns the coins on tick 20', () => {
		expect(mammoniteEffect[0]).toMatchObject({ type: 'STR', file: 'maemor', min: 'memor_min' });
		expect(mammoniteEffect.some(part => part.wav)).toBe(false);
		const spawned = [];
		mammoniteEffect[1].func.call(
			{ spamEffect: p => spawned.push(p) },
			{ Init: { ownerEntity: { position: [1, 2, 0] } }, Inst: { startTick: 1000 } }
		);
		const coins = spawned.filter(p => p.effect.type === '3D');
		expect(coins).toHaveLength(10);
		coins.forEach(p => expect(p.Inst.startTick).toBeCloseTo(1000 + 20 * TICK));
		spawned
			.filter(p => p.effect.wav)
			.forEach(p => expect(p.Inst.startTick).toBeGreaterThan(1000 + 20 * TICK));
	});
});
