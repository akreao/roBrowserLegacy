import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { STONE, planThrow, stoneAt, trailAt } from '../../src/Renderer/Effects/ThrownStoneSim.js';
import { throwStoneEffect, stoneEffect, lastStoneTick } from '../../src/DB/Effects/ThrowStoneEffect.js';

// Throw Stone (TF_THROWSTONE, skill 152): effect 308 from the caster at the target as the damage
// packet arrives, a stone in a 10-unit arc at 2 units a tick with three trailing copies; every hit
// plays the hit flash (0). Spec: effect-port/thief-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Throw Stone', () => {
	it('plays 308 from the caster as the damage packet arrives and the hit flash on every hit', () => {
		expect(source).toMatch(/SkillEffect\[SK\.TF_THROWSTONE\] = \{ damageEffectIdOnCaster: 308, hitEffectId: 0 \};/);
	});

	it('flies at 2 units a tick and arrives after floor(d / 2) + 1 ticks', () => {
		const t = planThrow([0, 0, 0], [30, 0, 0]);
		expect(t.ticks).toBe(16);
		expect(stoneAt(t, 0)).toMatchObject({ x: 0, y: 0, up: STONE.lift, alpha: 255, angle: 0 });
		const mid = stoneAt(t, 8);
		expect(mid.x).toBeCloseTo(16);
		expect(mid.up).toBeCloseTo(8 + 10);
		expect(mid.angle).toBe(80);
	});

	it('stops after 1.05 n ticks and fades 20 a tick', () => {
		const t = planThrow([0, 0, 0], [30, 0, 0]);
		expect(stoneAt(t, 16).x).toBeCloseTo(32);
		expect(stoneAt(t, 16).up).toBeCloseTo(8);
		expect(stoneAt(t, 20).x).toBeCloseTo(32);
		expect(stoneAt(t, 20).alpha).toBe(255 - 80);
		expect(stoneAt(t, 30).alpha).toBe(0);
		expect(lastStoneTick(t)).toBe(29);
	});

	it('climbs from the caster height to the target height', () => {
		const t = planThrow([0, 0, 0], [0, 20, 10]);
		expect(stoneAt(t, 11).y).toBeCloseTo(22);
		expect(stoneAt(t, 11).up).toBeCloseTo(8 + 11 + 0);
	});

	it('trails three copies at 105, 80 and 55 alpha, refreshed on odd ticks', () => {
		const t = planThrow([0, 0, 0], [30, 0, 0]);
		expect(trailAt(t, 0, 2)).toBeNull();
		expect(trailAt(t, 0, 3)).toMatchObject({ alpha: 105 });
		expect(trailAt(t, 0, 3).x).toBeCloseTo(stoneAt(t, 2).x);
		expect(trailAt(t, 0, 4).x).toBeCloseTo(stoneAt(t, 2).x);
		expect(trailAt(t, 1, 4)).toBeNull();
		expect(trailAt(t, 1, 5)).toMatchObject({ alpha: 80 });
		expect(trailAt(t, 1, 5).x).toBeCloseTo(stoneAt(t, 2).x);
		expect(trailAt(t, 2, 7)).toMatchObject({ alpha: 55 });
		expect(trailAt(t, 2, 7).x).toBeCloseTo(stoneAt(t, 2).x);
	});

	it('draws the stone 4 units wide in cells, from the caster', () => {
		const t = planThrow([0, 0, 0], [30, 0, 0]);
		const s = stoneEffect(t, -1).track(8);
		expect(s.x).toBeCloseTo(16 / 5);
		expect(s.z).toBeCloseTo(18 / 5);
		expect(s.size).toBeCloseTo(28);
		expect(s.alpha).toBe(1);
		expect(stoneEffect(t, 0).track(1)).toBeNull();
	});

	it('spawns the stone and its trail at the caster, aimed at the target', () => {
		const spawned = [];
		const host = { spamEffect: p => spawned.push(p) };
		throwStoneEffect[0].func.call(host, {
			Init: { ownerEntity: { position: [10, 20, 0] }, otherEntity: { position: [16, 20, 0] } },
			Inst: { startTick: 500 }
		});
		expect(spawned).toHaveLength(4);
		expect(spawned[0].Init.position).toEqual([10, 20, 0]);
		expect(spawned[0].effect.track(16).x).toBeCloseTo(32 / 5);
		const none = [];
		throwStoneEffect[0].func.call(
			{ spamEffect: p => none.push(p) },
			{ Init: { ownerEntity: { position: [0, 0, 0] } }, Inst: { startTick: 0 } }
		);
		expect(none).toHaveLength(0);
	});
});
