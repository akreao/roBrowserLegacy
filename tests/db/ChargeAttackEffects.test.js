import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Charge Attack (KN_CHARGEATK, skill 1001), as the official client plays it: on the hit, once per
// damage packet, EF_HIT2 (1) from its hit map, and no hit flash (skills above 492 have none). No
// use or damage-packet effect. Spec: effect-port/knight-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Charge Attack effects', () => {
	it('plays EF_HIT2 once on the hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.KN_CHARGEATK\] = \{ beginCastEffectId: 'white_pulse', hitEffectId: 1, hitEffectOnce: true \};/
		);
	});
});
