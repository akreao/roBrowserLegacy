import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Blitz Beat (HT_BLITZBEAT, skill 129): the official client (kRO 2020-12-29)
// sends the falcon to the target and plays the hit map's 115 once per damage
// packet that lands (splash targets too), with no hit flash. Nothing else.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Blitz Beat effects', () => {
	it('plays 115 once per damage packet, as its hit', () => {
		expect(source).toMatch(/SkillEffect\[SK\.HT_BLITZBEAT\] = \{ hitEffectId: 115, hitEffectOnce: true \};/);
	});
});
