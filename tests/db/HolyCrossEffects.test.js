import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Holy Cross (CR_HOLYCROSS, skill 253), as the official client plays it: 245 (cru_holy cross.wav,
// then holy_cross.str) on the target as each damage packet arrives, and the standard hit flash 0
// once per damage packet, not once per hit. Spec: effect-port/crusader-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Holy Cross effects', () => {
	it('plays 245 on the target at packet arrival and the hit flash once', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.CR_HOLYCROSS\] = \{ damageEffectIdOnTarget: 245, hitEffectId: 0, hitEffectOnce: true \};/
		);
	});
});
