import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// Sienna Execrate (WL_SIENNAEXECRATE 2207), kRO 2025-07-16: on success 797 EF_STONERING on the target:
// wl_siennaexecrate.wav and the monster sprite 몬스터\stapo 8 units up, action 0 or 1, 4 ticks a frame, once.

describe('Sienna Execrate', () => {
	it('plays 797 on the target on success', () => {
		expect(SkillEffect[SK.WL_SIENNAEXECRATE]).toEqual({ successEffectId: 797 });
	});

	it('draws the Stapo sprite with the sound', () => {
		expect(EffectTable[797][0]).toMatchObject({
			type: 'SPR',
			completeFile: 'data/sprite/\xb8\xf3\xbd\xba\xc5\xcd/stapo',
			frame: [0, 1],
			wav: 'effect/wl_siennaexecrate'
		});
		expect(EffectTable[797][0].delayFrame).toBeCloseTo(4 * (1000 / 60));
		expect(EffectTable.ef_siennaexecrate).toBeUndefined();
	});

	it('passes the sprite path through to the attachment', () => {
		const manager = readFileSync(join(process.cwd(), 'src/Renderer/EffectManager.js'), 'utf8');
		expect(manager).toContain('completeFile: Params.effect.completeFile,');
	});
});
