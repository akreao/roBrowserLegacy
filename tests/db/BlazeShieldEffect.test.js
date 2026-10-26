import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Blaze Shield (NJ_KAENSIN, skill 535): the official client draws nothing for the skill itself; each
// Kaen unit (0xbd) plays 화염진.wav 1 time in 8 when it appears and keeps relaunching 634: 화염진
// action 0, looping, 3-7 ticks a frame, 1 unit up. Spec: effect-port/ninja-skills.md.

const root = process.cwd();
const skills = readFileSync(join(root, 'src/DB/Skills/SkillEffect.js'), 'utf8');
const units = readFileSync(join(root, 'src/DB/Skills/SkillUnit.js'), 'utf8');
const table = readFileSync(join(root, 'src/DB/Effects/EffectTable.js'), 'utf8');
const manager = readFileSync(join(root, 'src/Renderer/EffectManager.js'), 'utf8');
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\t],', table.indexOf(`\t${id}: [`)));

describe('Blaze Shield', () => {
	it('draws nothing for the skill itself; the units play 634', () => {
		expect(skills).toMatch(/SkillEffect\[SK\.NJ_KAENSIN\] = \{\};/);
		expect(units).toContain('SkillUnit[SU.UNT_KAEN] = EC.EF_KAEN;');
	});

	it('loops 화염진 at 5 ticks a frame, 1 unit up, with its sound 1 time in 8', () => {
		const r = row(634);
		expect(r).toContain('delayFrame: 5 * (1000 / 60),');
		expect(r).toContain('yOffset: -7,');
		expect(r).toContain('repeat: true,');
		expect(r).toContain('wavChance: 1 / 8');
	});

	it('skips a row sound when its chance roll fails', () => {
		expect(manager).toContain('!(Params.effect.wavChance < 1 && Math.random() >= Params.effect.wavChance)');
	});
});
