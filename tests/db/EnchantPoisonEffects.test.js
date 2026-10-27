import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { poisonAttackEffect, POISON_ATTACK_LIFE } from '../../src/DB/Effects/PoisonAttackEffect.js';

// Enchant Poison (AS_ENCHANTPOISON, skill 138): the official client plays 125 on the target when the
// skill succeeds. 125 and 20 (EF_PATTACK) are one function: assasin_enchantpoison.wav and
// EF_PoisonAttack.wav, then a particle3 particle every 5 ticks for the effect's life (100 / 250
// ticks), moving like the Detoxify bubbles. Spec: effect-port/assassin-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

function particles(effectId) {
	const spawned = [];
	const [func] = poisonAttackEffect(effectId);
	func.func.call({ spamEffect: p => spawned.push(p) }, { Inst: { startTick: 1000 }, Init: {} });
	return spawned;
}

describe('Enchant Poison effects', () => {
	it('plays 125 on the target only when the skill succeeds', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.AS_ENCHANTPOISON\] = \{ successEffectId: 125 \};/);
	});

	it('keeps the client lifetimes: 20 lives 100 ticks, 125 lives 250', () => {
		expect(POISON_ATTACK_LIFE).toEqual({ 20: 100, 125: 250 });
	});

	it('spawns a particle3 particle every 5 ticks for the whole life', () => {
		const p125 = particles(125);
		expect(p125).toHaveLength(50);
		expect(p125[1].Inst.startTick - p125[0].Inst.startTick).toBeCloseTo(5000 / 60, 6);
		expect(p125[49].Inst.startTick).toBeCloseTo(1000 + (245 * 1000) / 60, 6);
		expect(p125.every(p => p.effect.spriteName === 'particle3' && p.effect.attachedEntity)).toBe(true);
		expect(particles(20)).toHaveLength(20);
	});

	it('plays the two poison sounds', () => {
		const wavs = poisonAttackEffect(125)
			.map(r => r.wav)
			.filter(Boolean);
		expect(wavs).toEqual(['effect/assasin_enchantpoison', 'effect/ef_poisonattack']);
	});
});
