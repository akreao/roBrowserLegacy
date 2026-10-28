import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Power Thrust (BS_OVERTHRUST, skill 113; Maximum Power Thrust 486 shares it): the official client plays
// 128 (EF_OVERTHRUST) on the source only when the use packet succeeds; 128 plays black_overthrust.wav
// and EF_StoneCurse.wav on tick 0 (kRO 2025-07-16). Spec: effect-port/blacksmith-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Power Thrust effects', () => {
	it('plays 128 on the source only on success', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.BS_OVERTHRUST\] = \{ successEffectIdOnCaster: 128 \};/);
		expect(skills).toMatch(/SkillEffect\[SK\.WS_OVERTHRUSTMAX\] = SkillEffect\[SK\.BS_OVERTHRUST\];/);
	});

	it('plays both sounds at once', () => {
		const start = table.indexOf('//EF_OVERTHRUST');
		const row = table.slice(start, table.indexOf('],', start));
		const sounds = [...row.matchAll(/wav: '([^']+)'/g)].map(m => m[1]);
		expect(sounds).toEqual(['effect/black_overthrust', 'effect/ef_stonecurse']);
		expect(row).not.toMatch(/delayWav/);
	});
});
