import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Ground Drift (GS_GROUNDDRIFT 521): effect\그라운드.wav from the ground packet; each grenade unit (0xbe-0xc2, 0x108) a looping sprite, effects 638-642 and 1120.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Ground Drift effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_GROUNDDRIFT] = { groundEffectIdByLevel: [\'ef_gs_ground_drift\'] };');
	});

	it('gives each grenade unit its looping sprite, on the unit', () => {
		const units = read('DB/Skills/SkillUnit.js');
		const want = { WIND: 638, DARK: 639, POISON: 640, WATER: 641, FIRE: 642, NEUTRAL: 1120 };
		for (const [element, id] of Object.entries(want)) {
			expect(units).toContain(`SkillUnit[SU.UNT_GROUNDDRIFT_${element}] = ${id};`);
			const [spr] = row(id);
			expect(spr.type).toBe('SPR');
			expect(spr.attachedEntity).toBe(true);
		}
	});

	it('plays the ground drift sound', () => {
		const [sound] = row('ef_gs_ground_drift');
		expect(sound.wav).toBe('effect/\xb1\xd7\xb6\xf3\xbf\xee\xb5\xe5');
	});
});
