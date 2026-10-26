import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Fling (GS_FLING 501): 548 (red body glow) on the target as each damage packet arrives, hit flash 0 once per packet.
// Spec: effect-port/gunslinger-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Fling effects', () => {
	it('plays what the official client plays, where and when it plays it', () => {
		expect(source).toContain('SkillEffect[SK.GS_FLING] = { damageEffectIdOnTarget: 548, hitEffectId: 0, hitEffectOnce: true };');
	});
});
