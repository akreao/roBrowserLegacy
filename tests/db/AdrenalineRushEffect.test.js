import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Adrenaline Rush (BS_ADRENALINE, skill 111): the official client plays 98 (EF_HASTEUP) on the source
// only when the use packet succeeds; nothing at cast start. 98 plays black_adrenalinerush_a.wav on tick 0
// and black_adrenalinerush_b.wav on tick 30 (kRO 2025-07-16). Spec: effect-port/blacksmith-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = effectTableSource();

describe('Adrenaline Rush effects', () => {
	it('plays 98 on the source only on success, nothing at cast start', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.BS_ADRENALINE\] = \{ successEffectIdOnCaster: 98 \};/);
		expect(table).not.toMatch(/98_beforecast/);
	});

	it('plays _a at once and _b at 500 ms', () => {
		const row = table.slice(table.indexOf('//EF_HASTEUP'), table.indexOf('//EF_REPAIRWEAPON'));
		expect(row).toMatch(/wav: 'effect\/black_adrenalinerush_a',\s+attachedEntity: true/);
		expect(row).toMatch(/wav: 'effect\/black_adrenalinerush_b',\s+delayWav: 500,/);
	});
});
