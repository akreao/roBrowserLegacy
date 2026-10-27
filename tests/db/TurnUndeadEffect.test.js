import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';

// Turn Undead in the official client (kRO 2025-07-16): 82 on the caster as each damage packet
// arrives (EF_Bash.wav on its tick 37), then the hit flash and 152 once per packet.
// Spec: effect-port/priest-audit.md.
const effectTable = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8').replace(/\r\n/g, '\n');

describe('Turn Undead', () => {
	it('plays 82 on the caster at packet arrival and 0 + 152 once on the hit', () => {
		expect(SkillEffect[SK.PR_TURNUNDEAD]).toEqual({
			damageEffectIdOnCaster: 82,
			hitEffectId: [0, 152],
			hitEffectOnce: true
		});
	});

	it("82 plays EF_Bash.wav on tick 37", () => {
		const start = effectTable.indexOf('\n\t82: [');
		const row = effectTable.slice(start, effectTable.indexOf('\n\t],', start));
		expect(row).toMatch(/wav: 'effect\/ef_bash',\n\t+delayWav: 617,/);
	});
});
