import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import { SCHEDULES, colorAt } from 'Renderer/Effects/CasterMarks.js';

// Shrink (CR_SHRINK, skill 1002) as the official client (2020-12-29) plays it: on use success,
// effect 599 on the Crusader: EF_BeginSpell.wav on tick 5, then to tick 25 a yellow (added
// light) and white flicker, no glow copy. Spec: effect-port/crusader-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function entry(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\n\t],', start)).replace(/\s+/g, ' ');
}

describe('Shrink effect', () => {
	it('plays 599 on the caster, only on success', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.CR_SHRINK\] = \{ successEffectIdOnCaster: 599 \};/
		);
	});

	it('599 marks the caster and plays EF_BeginSpell on tick 5', () => {
		const row = entry(599);
		expect(row).toContain("wav: 'effect/ef_beginspell'");
		expect(row).toContain('delayWav: 5 * (1000 / 60)');
		expect(row).toContain('new CasterMarks(Params.Init.ownerEntity, Params.Inst.startTick, 26, 599)');
	});

	it('flickers yellow (added) and white from tick 5 to 25, without a glow copy', () => {
		const s = SCHEDULES[599];
		expect(s(4)).toEqual({ add: false, glow: false, split: false, color: null });
		expect(s(5)).toEqual({ add: false, glow: false, split: false, color: [255, 255, 255] });
		expect(s(6)).toEqual({ add: true, glow: false, split: false, color: [250, 250, 100] });
		expect(s(24).color).toEqual([250, 250, 100]);
		expect(s(25).color).toEqual([255, 255, 255]);
		expect(s(26)).toEqual({ add: false, glow: false, split: false, color: null });
		expect(colorAt(s, 26)).toEqual([255, 255, 255]);
	});
});
