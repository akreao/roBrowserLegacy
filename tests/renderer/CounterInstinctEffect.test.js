import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import { SCHEDULES } from 'Renderer/Effects/CasterMarks.js';

// Counter Instinct (ST_REJECTSWORD, skill 390): the official client's 392 on the caster plays
// sword.str and kyrie_guard.wav, and to tick 29 adds a glow copy round the caster while its colour
// goes grey (100) on ticks with age mod 6 below 3 and near white (250) on the others.
// Spec: effect-port/rogue-skills.md, effect-port/stalker-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Counter Instinct', () => {
	it('plays 392 on the caster only when the use packet succeeds', () => {
		// kRO 2025-07-16: the use packet case needs the result set and the source known.
		expect(skills).toContain('SkillEffect[SK.ST_REJECTSWORD] = { successEffectIdOnCaster: 392 };');
	});

	it('marks the caster to tick 29', () => {
		const at = SCHEDULES[392];
		expect(at(0)).toEqual({ add: false, glow: true, split: false, color: [100, 100, 100] });
		expect(at(3).color).toEqual([250, 250, 250]);
		expect(at(29).glow).toBe(true);
		expect(at(30)).toEqual({ add: false, glow: false, split: false, color: null });
	});

	it('runs the marks with 392', () => {
		expect(table).toContain('new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 200, 392)');
	});
});
