import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import EffectTable from 'DB/Effects/EffectTable.js';
import { planStreaks, streakAlpha } from 'DB/Effects/AgilityEffect.js';

// Increasing Accuracy (GS_INCREASING 506): the client's 456 on the caster on success, EF_IncAgility.wav and 50 streaks; not Elemental Master's increasing_activity STRs.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Increasing Accuracy effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_INCREASING] = { successEffectId: \'ef_gs_increasing_accuracy\' };');
	});

	it('plays the Increase AGI sound and 50 faint rising streaks', () => {
		const [sound, streaks] = EffectTable.ef_gs_increasing_accuracy;
		expect(sound.wav).toBe('effect/ef_incagility');
		const spawned = [];
		streaks.func.call({ spamEffect: p => spawned.push(p) }, { Init: {}, Inst: { startTick: 0 } });
		expect(spawned).toHaveLength(50);
		expect(spawned.every(p => p.effect.file === 'effect/ac_center2.tga')).toBe(true);
	});

	it('uses the client numbers for 456 variant 0', () => {
		for (const s of planStreaks('accuracy', Math.random)) {
			expect(s.rising).toBe(true);
			expect(s.alphaMax).toBe(60);
			expect(s.halfLength).toBeGreaterThanOrEqual(2);
			expect(s.halfLength).toBeLessThanOrEqual(11.9);
			expect([0.1, 0.2, 0.3, 0.4].some(w => Math.abs(w - s.halfWidth) < 1e-9)).toBe(true);
		}
		expect(streakAlpha(20, { alphaMax: 60, alphaStep: 3 })).toBe(60);
		expect(streakAlpha(5, { alphaMax: 60, alphaStep: 3 })).toBe(15);
	});
});
