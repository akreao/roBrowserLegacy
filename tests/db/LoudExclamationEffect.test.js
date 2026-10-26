import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Loud Exclamation (MC_LOUD, skill 155), as the official client plays it: effect 311 (loud.str
// and its shout sound) on the caster from the use packet, only when the packet's result is set.
// Spec: effect-port/merchant-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Loud Exclamation effect', () => {
	it('plays 311 only when the use packet says it worked', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(/SkillEffect\[SK\.MC_LOUD\] = \{ successEffectId: 311 \};/);
	});
});
