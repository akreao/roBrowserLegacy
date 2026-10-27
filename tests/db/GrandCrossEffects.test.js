import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Grand Cross (CR_GRANDCROSS, skill 254). The official client: nothing on the use packet, 226 on
// the caster as each damage packet arrives, and the standard hit flash 0 once per damage packet.
// roBrowser's 226 is a single cross drawn over the whole area, so it stays a one-off on the caster
// (from the use packet) until the client's 226 look is ported; it no longer plays on each target.
// Spec: effect-port/crusader-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Grand Cross effects', () => {
	it('plays 226 once on the caster and the hit flash once per packet', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.CR_GRANDCROSS\] = \{ successEffectIdOnCaster: 226, hitEffectId: 0, hitEffectOnce: true \};/
		);
	});
});
