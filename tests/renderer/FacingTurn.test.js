import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let current;
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => current } }));

import FacingTurn, { turnedDirection, TURN_TICKS } from 'Renderer/Effects/FacingTurn.js';

// Tornado Kick (TK_STORMKICK, skill 413): on success the official client plays 435
// (EF_STORMKICK) on the caster: its sound on tick 5, and the caster's facing turned 30 degrees a
// tick for 48 ticks. Every hit plays the hit flash 0. Spec: effect-port/taekwon-skills.md.

const TICK = 1000 / 60;

beforeEach(() => {
	current = { GID: 1, direction: 4 };
});

describe('turnedDirection', () => {
	it('steps one direction every 45 degrees, the way the server numbers go round', () => {
		// roBrowser 4 is server direction 0; one step on is server 1, roBrowser 3.
		expect(turnedDirection(4, 0)).toBe(4); // 30 degrees
		expect(turnedDirection(4, 1)).toBe(3); // 60 degrees
		expect(turnedDirection(4, 11)).toBe(4); // 360 degrees: one full turn
	});

	it('ends where it started after four full turns', () => {
		for (let d = 0; d < 8; d++) {
			expect(turnedDirection(d, TURN_TICKS - 1)).toBe(d);
			expect(turnedDirection(d, 100)).toBe(d);
		}
	});
});

describe('FacingTurn', () => {
	it('turns its owner and stops after 48 ticks, facing as before', () => {
		const turn = new FacingTurn(current, 0);
		turn.render(null, 1 * TICK);
		expect(current.direction).toBe(3);
		turn.render(null, 30 * TICK);
		expect(turn.needCleanUp).toBeUndefined();
		turn.render(null, 47 * TICK);
		expect(turn.needCleanUp).toBe(true);
		expect(current.direction).toBe(4);
	});
});

describe('Tornado Kick skill row', () => {
	it('plays 435 on the caster on success and the hit flash on every hit', () => {
		const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
		expect(source).toMatch(
			/SkillEffect\[SK\.TK_STORMKICK\] = \{ successEffectIdOnCaster: 435, hitEffectId: \[0\] \};/
		);
	});
});
