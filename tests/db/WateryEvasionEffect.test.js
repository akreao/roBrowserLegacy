import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Watery Evasion (NJ_SUITON, skill 538): the official client plays 수둔.wav from the ground packet.
// Spec: effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();

describe('Watery Evasion', () => {
	it('plays 수둔.wav from the ground packet', () => {
		expect(skills).toContain("SkillEffect[SK.NJ_SUITON] = { effectId: 'ef_watery_evasion_sound' };");
		const r = table.slice(table.indexOf('\tef_watery_evasion_sound: ['));
		expect(r.slice(0, r.indexOf('\t],'))).toContain("wav: 'effect/\\xbc\\xf6\\xb5\\xd0'");
	});
});
