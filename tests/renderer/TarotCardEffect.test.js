import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import { SCHEDULES, colorAt } from 'Renderer/Effects/CasterMarks.js';

// Tarot Card of Fate (CG_TAROTCARD, skill 489) in the official client (kRO 2025-07-16): cast aura 58
// whatever the element; the use packet (result set) plays priest_slowpoison.wav and 500 on the target.
// 500 lives 120 ticks: on ages 0 to 30 a glow copy every tick, the target drawn adding light in blue
// (0, 0, 255) on even ages and white on odd ones. Spec: effect-port/clown-gypsy-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe('Tarot Card of Fate', () => {
	it('plays its sound and 500 on the target on success, with cast aura 58', () => {
		expect(SkillEffect[SK.CG_TAROTCARD]).toEqual({ successEffectId: ['ef_tarot_card_sound', 500], castAuraEffectId: 58 });
	});

	it('500 flickers the target blue and white with a glow copy to age 30', () => {
		const at = SCHEDULES[500];
		expect(at(0)).toEqual({ add: true, glow: true, split: false, color: [0, 0, 255] });
		expect(at(1)).toEqual({ add: false, glow: true, split: false, color: [255, 255, 255] });
		expect(at(30)).toEqual({ add: true, glow: true, split: false, color: [0, 0, 255] });
		expect(at(31)).toEqual({ add: false, glow: false, split: false, color: null });
		// After age 30 the blue comes back by 8 a tick
		expect(colorAt(at, 32)).toEqual([16, 16, 255]);
		expect(table).toContain('new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 120, 500)');
	});

	it('Full Chemical Protection plays 500 too, after 300, on success (effect-port/creator-skills.md)', () => {
		expect(SkillEffect[SK.CR_FULLPROTECTION]).toEqual({ successEffectId: [300, 500] });
	});
});
