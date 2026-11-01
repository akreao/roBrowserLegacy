import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Asura Strike (MO_EXTREMITYFIST, 271): as the damage packet arrives the official client
// shakes the camera and plays 266 with mon_아수라 패황권.wav on the target; the hit flash 0
// on the hit. Its cast-effect picker (kRO 2025-07-16, 0xd84890) gives the cast 328, the big
// Asura images, in place of the cast aura, or 510 when the caster's job id is 4016 (MONK_H)
// or above. The cast packet comes even with no cast time, so a comboed Asura shows them too.
// Spec: effect-port/monk-skills.md.

const { default: SkillEffect } = await import('DB/Skills/SkillEffect.js');
const { default: SK } = await import('DB/Skills/SkillConst.js');
const { default: JobId } = await import('DB/Jobs/JobConst.js');

const row = SkillEffect[SK.MO_EXTREMITYFIST];

describe('Asura Strike effects', () => {
	it('plays the quake and 266 at packet arrival and 0 on the hit', () => {
		expect(row).toMatchObject({ damageEffectIdOnCaster: 'quake', damageEffectIdOnTarget: 266, hitEffectId: 0 });
	});

	it('shows the Asura images instead of the cast aura, picked by job', () => {
		expect(row.hideCastAura).toBe(true);
		expect(row.beginCastEffectId({ _job: JobId.MONK })).toBe(328);
		expect(row.beginCastEffectId({ _job: JobId.MONK_H })).toBe(510);
		expect(row.beginCastEffectId({ _job: JobId.SURA })).toBe(510);
		expect(row.beginCastEffectId(null)).toBe(328);
	});
});
