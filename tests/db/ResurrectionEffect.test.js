import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';

// Resurrection in the official client (kRO 2025-07-16): 77 (with the sound) then 140 on a revived
// player when the use packet's result is set; damage on an undead plays 0 and 140 once per packet.
// 140 plays no sound. Spec: effect-port/priest-audit.md.
const effectTable = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8').replace(/\r\n/g, '\n');

describe('Resurrection', () => {
	it('plays 77 and 140 on success, 0 and 140 once on a damage hit', () => {
		expect(SkillEffect[SK.ALL_RESURRECTION]).toEqual({
			successEffectId: [77, 140],
			hitEffectId: [0, 140],
			hitEffectOnce: true
		});
	});

	it('140 does not play the resurrection sound again', () => {
		expect(effectTable).toMatch(/\n\t140: \[\],/);
	});
});
