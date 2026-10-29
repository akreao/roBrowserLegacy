import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Acid Demonstration (CR_ACIDDEMONSTRATION, skill 490), effect 537 (EF_ACIDDEMON): the official client's
// prim-118 ring set of ring_black.tga at the target's cell. kRO 2025-07-16. Spec: effect-port/creator-skills.md.

const { RING_BANDS, RING_FRAMES, RING_VERTICES, RING_COLOR, LIFETIME, ringAlpha, ringHeight, planTurns, buildRings } =
	await import('Renderer/Effects/AcidDemonRingSim.js');
const { default: SkillEffect } = await import('DB/Skills/SkillEffect.js');
const { default: SK } = await import('DB/Skills/SkillConst.js');

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Acid Demonstration rings (effect 537)', () => {
	it('has the client\'s four bands', () => {
		expect(RING_BANDS.map(b => [b.foot, b.tilt, b.arc, b.turn, b.height, b.grow, ...b.step])).toEqual([
			[2.4, 70, 315, 0, 25, 1.005, 4, 6],
			[2.7, 57, 315, 90, 22, 1.005, 4, 6],
			[3.0, 45, 315, 180, 19, 1.005, 4, 6],
			[2.2, 90, 360, 0, 30, 1.025, 2, 3]
		]);
		expect(RING_VERTICES).toBe((21 * 3 + 20) * 6);
		expect(RING_COLOR).toEqual([255, 50, 255]);
		expect(LIFETIME).toBe(200);
	});

	it('fades in 5 a tick to 80, holds to tick 39, then loses 15 a tick', () => {
		expect(ringAlpha(1)).toBe(5);
		expect(ringAlpha(16)).toBe(80);
		expect(ringAlpha(39)).toBe(80);
		expect(ringAlpha(40)).toBe(65);
		expect(ringAlpha(44)).toBe(5);
		expect(ringAlpha(45)).toBe(0);
		expect(RING_FRAMES).toBe(44);
	});

	it('raises each point with sin(tick) while the amplitude grows', () => {
		expect(ringHeight(0, 0, 10)).toBe(0);
		expect(ringHeight(0, 10, 30)).toBeCloseTo(25 * Math.pow(1.005, 30) * 0.5, 6);
		expect(ringHeight(3, 10, 30)).toBeCloseTo(30 * Math.pow(1.025, 30) * 0.5, 6);
	});

	it('turns the inner bands 4-6 degrees a tick and the upright one 2-3', () => {
		const low = planTurns(3, () => 0);
		const high = planTurns(3, () => 0.999);
		expect(low.map(b => b[3])).toEqual([12, 102, 192, 6]);
		expect(high.map(b => b[3])).toEqual([18, 108, 198, 9]);
	});

	it('stands the bands on the cell, feet on the ground', () => {
		const out = new Float32Array(RING_VERTICES * 5);
		const starts = buildRings(out, 20, planTurns(20, () => 0), [10, 20, 0]);
		expect(starts).toEqual([0, 126, 252, 378, 498]);
		// first vertex: band 0's foot at angle 0, 2.4 units out
		expect(out[0]).toBeCloseTo(10.5 + 2.4 / 5 * Math.cos((80 * Math.PI) / 180), 5);
		expect(out[1]).toBeCloseTo(0, 5);
	});
});

describe('Acid Demonstration rows', () => {
	it('plays 537 at the target per damage packet and the hit flash on every hit', () => {
		expect(SkillEffect[SK.CR_ACIDDEMONSTRATION]).toEqual({ damageEffectIdOnTarget: 537, hitEffectId: 0 });
	});

	it('537 draws the rings at the cell with EF_FireWall.wav and quakes on tick 5', () => {
		const table = read('DB/Effects/EffectTable.js');
		const row = table.slice(table.indexOf('\t537: ['), table.indexOf('\t//538'));
		expect(row).toContain('attachedEntity: false');
		expect(row).toContain("wav: 'effect/ef_firewall'");
		expect(row).toContain('new AcidDemonRing(Params.Inst.position, Params.Inst.startTick)');
		expect(row).toContain('Camera.setQuake(Params.Inst.startTick + 5 * (1000 / 60))');
	});
});
