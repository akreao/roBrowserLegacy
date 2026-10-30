import { describe, expect, it } from 'vitest';
import { getMotionEffect } from 'DB/Skills/SkillMotionEffect.js';

// Star Emperor / Soul Reaper caster motion effect (kRO 2025-07-16): none of their skilleffectinfo rows has a
// beginEffectID (GetBeginEffectID answers -1), so the fixed table decides: -1 for Full Moon Kick, Solar
// Burst and Espa, 16 for the other rows. Spec: effect-port/star-emperor-soul-reaper-skills.md,
// effect-port/caster-motion-effect.md.

describe('Star Emperor / Soul Reaper caster motion effect', () => {
	it('keeps the table value for the skilleffectinfo rows', () => {
		[2574, 2577, 2579, 2582, 2586, 2588, 2590, 2594, 2600, 2603, 2606, 2607, 2609, 2610].forEach(skill =>
			expect(getMotionEffect(skill)).toBe(16)
		);
		[2576, 2592, 2602].forEach(skill => expect(getMotionEffect(skill)).toBe(null));
	});

	it('keeps the table value for the skills without a row', () => {
		[2580, 2581, 2584, 2593, 2596, 2597, 2598, 2599, 2604].forEach(skill =>
			expect(getMotionEffect(skill)).toBe(null)
		);
		[2575, 2583, 2585, 2587, 2589, 2591, 2595, 2601, 2605, 2608, 2611, 2612].forEach(skill =>
			expect(getMotionEffect(skill)).toBe(16)
		);
	});
});
