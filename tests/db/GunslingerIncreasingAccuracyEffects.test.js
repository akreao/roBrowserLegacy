import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Increasing Accuracy (GS_INCREASING 506): the client's 456 on the caster on success, EF_IncAgility.wav; not Elemental Master's increasing_activity STRs.
// Spec: effect-port/gunslinger-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start).toBeGreaterThan(0);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Increasing Accuracy effects', () => {
	it('plays where and when the official client plays it', () => {
		expect(read('DB/Skills/SkillEffect.js')).toContain('SkillEffect[SK.GS_INCREASING] = { successEffectId: \'ef_gs_increasing_accuracy\' };');
	});

	it('plays the Increase AGI sound', () => {
		const [sound] = row('ef_gs_increasing_accuracy');
		expect(sound.wav).toBe('effect/ef_incagility');
	});
});
