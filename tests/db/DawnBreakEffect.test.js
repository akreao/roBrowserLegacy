import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Dawn Break (SKE_DAWN_BREAK) as the official client draws it.
// Spec: effect-port/dawn-break.md.

// The effect tables import most of the renderer, so read them from their source.
const read = file => readFileSync(join(process.cwd(), 'src/DB', file), 'utf8').replace(/\r\n/g, '\n');
const effectTable = read('Effects/EffectTable.js');
const skillEffect = read('Skills/SkillEffect.js');

function effectEntry(name) {
	const start = effectTable.indexOf(`\n\t${name}: [`);
	expect(start, `${name} is defined`).toBeGreaterThan(-1);
	const end = effectTable.indexOf('\n\t],', start);
	return vm.runInNewContext(`(${effectTable.slice(start, end + 3).trim().replace(/^\w+:/, '').replace(/,$/, '')})`);
}

describe('Dawn Break', () => {
	it('plays once per use on the caster, with the fixed cast aura 58', () => {
		expect(skillEffect).toMatch(
			/SkillEffect\[SK\.SKE_DAWN_BREAK\] = \{ successEffectIdOnCaster: 'ef_ske_dawn_break', castAuraEffectId: 58 \};/
		);
	});

	it('is the EZ2 effect ske_dawn_break: one STR on the caster, PosY 7, no delay', () => {
		const parts = effectEntry('ef_ske_dawn_break');
		expect(parts).toHaveLength(1);
		const [str] = parts;
		expect(str.type).toBe('STR');
		expect(str.file).toBe('sky_emperor/ske_dawn_break/ske_dawn_break');
		expect(str.texturePath).toBe('sky_emperor/ske_dawn_break/');
		expect(str.min).toBe('sky_emperor/ske_dawn_break/min_ske_dawn_break');
		expect(str.wav).toBe('effect/sky_emperor/ske_dawn_break');
		expect(str.attachedEntity).toBe(true);
		expect(str.yOffset).toBe(7);
		expect(str.xOffset).toBeUndefined();
		expect(str.delayStart).toBeUndefined();
		expect(str.repeat).toBeUndefined();
	});
});

