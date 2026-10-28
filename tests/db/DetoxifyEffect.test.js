import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DETOX, planBubbles, bubbleAt, bubbleAlpha } from '../../src/Renderer/Effects/DetoxBubbleSim.js';
import { detoxifyEffect, detoxBubbleEffect } from '../../src/DB/Effects/DetoxifyEffect.js';

// Detoxify (TF_DETOXIFY, skill 53): effect 21 on the target when it succeeds, EF_Detoxication.wav
// and a particle2 bubble every 5 ticks rising around it. Spec: effect-port/thief-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

let seed = 9;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe('Detoxify bubbles', () => {
	it('plays 21 on the target only when the skill succeeds', () => {
		expect(source).toMatch(/SkillEffect\[SK\.TF_DETOXIFY\] = \{ successEffectId: 21 \};/);
	});

	it('makes 20 bubbles, one every 5 ticks, within the client ranges', () => {
		const bubbles = planBubbles(random);
		expect(bubbles.map(b => b.spawn)).toEqual(Array.from({ length: 20 }, (_, i) => i * 5));
		for (const b of bubbles) {
			const d = Math.hypot(b.x, b.y);
			expect(d).toBeGreaterThanOrEqual(2 - 1e-9);
			expect(d).toBeLessThanOrEqual(7 + 1e-9);
			expect(b.rise).toBeGreaterThanOrEqual(0.3);
			expect(b.rise).toBeLessThanOrEqual(0.59 + 1e-9);
			expect(b.scale).toBeGreaterThanOrEqual(0.4);
			expect(b.scale).toBeLessThanOrEqual(0.89 + 1e-9);
		}
	});

	it('fades in over 10 ticks and out from tick 32', () => {
		expect([0, 5, 10, 31, 32, 39].map(bubbleAlpha)).toEqual([0, 127, 254, 254, (254 * 7) / 8, 0]);
	});

	it('rises, slowing to half, and spins', () => {
		const b = { spawn: 0, x: 3, y: -4, rise: 0.4, scale: 0.5 };
		expect(bubbleAt(b, 0)).toMatchObject({ x: 3, y: -4, up: 0, angle: 0 });
		expect(bubbleAt(b, 20).up).toBeCloseTo(0.4 * 20 - (0.4 / 80) * 210);
		expect(bubbleAt(b, 20).angle).toBe(60);
		expect(bubbleAt(b, DETOX.life)).toBeNull();
	});

	it('draws a bubble as the particle2 sprite, following the target', () => {
		const e = detoxBubbleEffect({ spawn: 0, x: 5, y: 0, rise: 0, scale: 0.5 });
		expect(e.spriteName).toBe('particle2');
		expect(e.attachedEntity).toBe(true);
		expect(e.track(10)).toMatchObject({ x: 1, y: 0, z: 0, size: 50, alpha: 254 / 255 });
	});

	it('starts each bubble on its own tick and plays the sound once', () => {
		const spawned = [];
		detoxifyEffect[0].func.call(
			{ spamEffect: p => spawned.push(p) },
			{ Init: { ownerEntity: { position: [0, 0, 0] } }, Inst: { startTick: 1000 } }
		);
		expect(spawned).toHaveLength(20);
		expect(spawned[0].Inst.startTick).toBe(1000);
		expect(spawned[19].Inst.startTick).toBeCloseTo(1000 + (95 * 1000) / 60);
		expect(detoxifyEffect[1].wav).toBe('effect/ef_detoxication');
	});
});
