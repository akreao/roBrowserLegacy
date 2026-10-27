import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Stave Crasher (HW_MAGICCRASHER, skill 365), as the official client plays it: effect 380 on the
// target as the damage packet arrives (매직 크래쉬.wav on tick 25, a camera quake on tick 30, the
// target flickering random colours on ticks 30 to 60), and the standard hit flash (0) once per
// packet with the damage. Spec: effect-port/wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function entry(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	return table.slice(start, table.indexOf('\n\t],', start));
}

describe('Stave Crasher effects', () => {
	it('plays 380 on the target at packet arrival and the hit flash once', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.HW_MAGICCRASHER\] = \{ damageEffectIdOnTarget: 380, hitEffectId: \[0\], hitEffectOnce: true \};/
		);
	});

	it('plays the sound on tick 25 and quakes on tick 30', () => {
		const row = entry(380);
		expect(row).toContain('delayWav: 25 * (1000 / 60)');
		expect(row).toContain('Params.Inst.startTick + 30 * (1000 / 60)');
	});
});
