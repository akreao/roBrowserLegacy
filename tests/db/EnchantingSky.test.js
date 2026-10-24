import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Enchanting Sky, as in the official client: casting shows only the generic cast
// aura (effect 831). The Sky Enchant status shows the rest: a 20-frame burst with
// the sound when it starts, then a 1 s loop from 320 ms until the status ends.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start));
}

describe('Enchanting Sky', () => {
	it('starts the burst and the loop with the Sky Enchant status', () => {
		const table = read('DB/Status/StatusEffectTable.js');
		expect(table).toMatch(
			/\[StatusConst\.SKY_ENCHANT\]: \{\n\t\tstart: \['ef_ske_enchanting_sky'\],\n\t\tloop: \['ef_ske_enchanting_sky_loop'\]\n\t\}/
		);
	});

	it('shows only the cast aura when the skill is used', () => {
		const line = skillEffect.split('\n').find(l => l.startsWith('SkillEffect[SK.SKE_ENCHANTING_SKY] ='));
		expect(line).toContain('castAuraEffectId: 831');
		expect(line).not.toMatch(/\beffectId:/);
	});

	it('plays the burst once, with the sound', () => {
		const burst = entry('ef_ske_enchanting_sky');
		expect(burst).toContain("file: 'sky_emperor/ske_enchanting_sky/ske_enchanting_sky_00'");
		expect(burst).toContain("wav: 'effect/sky_emperor/ske_enchanting_sky'");
		expect(burst).toContain('yOffset: 13');
		expect(burst).not.toMatch(/repeat|delayStart|ske_enchanting_sky_01/);
	});

	it('loops the second part from 320 ms, silently', () => {
		const loop = entry('ef_ske_enchanting_sky_loop');
		expect(loop).toContain("file: 'sky_emperor/ske_enchanting_sky/ske_enchanting_sky_01'");
		expect(loop).toContain('delayStart: 320');
		expect(loop).toContain('repeat: true');
		expect(loop).toContain('yOffset: 13');
		expect(loop).not.toMatch(/wav:|delayOffset/);
	});
});
