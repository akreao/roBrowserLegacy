import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Raid / Sightless Mind (RG_RAID, skill 214): the official client plays 276 (EF_TEIHIT3) on the
// caster from the use packet when it works, and nothing more when the splash damage packets arrive
// but the standard hit flash (0) once per packet on each target. Spec: effect-port/rogue-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Raid effects', () => {
	it('plays 276 on the caster from the use packet only, and the hit flash once per packet', () => {
		expect(skills).toContain(
			'SkillEffect[SK.RG_RAID] = { successEffectIdOnCaster: 276, hitEffectId: [0], hitEffectOnce: true };'
		);
	});
});
