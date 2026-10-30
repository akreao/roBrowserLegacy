import { describe, expect, it } from 'vitest';
import { getMotionEffect, motionEffectForPacket } from 'DB/Skills/SkillMotionEffect.js';

// Kagerou / Oboro caster motion effect (kRO 2025-07-16): the skilleffectinfo row's beginEffectID when it
// has one (GetBeginEffectID answers -1 for a missing field), else the fixed table: -1 for Kunai
// Explosion, Kunai Splash and Rapid Throw, 16 for the rest. Spec: effect-port/kagerou-oboro-skills.md,
// effect-port/caster-motion-effect.md.

describe('Kagerou / Oboro caster motion effect', () => {
	it('uses the row beginEffectID', () => {
		expect(getMotionEffect(3011)).toBe(57); // Pure Soul: EF_BEGINSPELL5
		expect(getMotionEffect(3013)).toBe(59); // Illusion - Shock: EF_BEGINSPELL7
		expect(getMotionEffect(3014)).toBe(54); // Illusion - Death: EF_BEGINSPELL2
		expect(getMotionEffect(3015)).toBe(55); // Fire Charm: EF_BEGINSPELL3
		expect(getMotionEffect(3016)).toBe(441); // Ice Charm: EF_BLUECASTING
		expect(getMotionEffect(3017)).toBe(56); // Wind Charm: EF_BEGINSPELL4
		expect(getMotionEffect(3018)).toBe(12); // Earth Charm: EF_BEGINSPELL
		expect(getMotionEffect(3021)).toBe(55); // Illusion - Bewitch
		expect(getMotionEffect(3026)).toBe(12); // Distorted Crescent
		expect(getMotionEffect(3029)).toBe(55); // Ominous Moonlight
	});

	it('keeps the table value for rows without one', () => {
		[3004, 3005, 3009, 3019, 3020, 3022, 3023, 3024, 3025, 3027].forEach(skill =>
			expect(getMotionEffect(skill)).toBe(16)
		);
		[3006, 3007, 3008].forEach(skill => expect(getMotionEffect(skill)).toBe(null));
	});

	it('plays on the no-damage damage packet of a status skill', () => {
		expect(motionEffectForPacket(3029, 8, 5, true)).toBe(55);
		expect(motionEffectForPacket(3024, 8, 5, true)).toBe(16);
	});
});
