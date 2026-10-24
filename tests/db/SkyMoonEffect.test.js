import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Sky Moon (SKE_SKY_MOON) as the official client plays it: the cast effect on the
// caster for the whole cast, the moon once on the target when the skill is used,
// and the hit on each damaged target. Numbers from the client's EZ2 table.
//
// Read as text: the effect tables import the renderer, which does not load
// without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src/DB', file), 'utf8').replace(/\r\n/g, '\n');
const effectTable = read('Effects/EffectTable.js');
const skillEffect = read('Skills/SkillEffect.js');

function effect(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	const end = effectTable.indexOf('\n\t],', start);
	return effectTable
		.slice(start, end)
		.split('\n\t\t{')
		.slice(1)
		.map(layer => ({
			text: layer,
			get: key => (layer.match(new RegExp(`\\b${key}: '?([^',\\n]+)'?`)) || [])[1]
		}));
}

const DIR = 'sky_emperor/ske_sky_moon/';

describe('Sky Moon effect', () => {
	it('plays the cast on the caster, the moon on success and the hit on each target', () => {
		const start = skillEffect.indexOf('SkillEffect[5503 /* SKE_SKY_MOON */] = {');
		expect(start).toBeGreaterThan(-1);
		const entry = skillEffect.slice(start, skillEffect.indexOf('};', start));
		expect(entry).toMatch(/beginCastEffectId: 'ef_ske_sky_moon_cast'/);
		expect(entry).toMatch(/successEffectId: 'ef_ske_sky_moon'/);
		expect(entry).toMatch(/hitEffectId: 'ef_ske_sky_moon_hit'/);
		expect(entry).toMatch(/hideCastAura: true/);
		// Not per splash hit, and not on the caster at the damage time.
		expect(entry).not.toMatch(/\beffectId:/);
		expect(entry).not.toMatch(/effectIdOnCaster/);
	});

	it('loops the cast effect for the cast time, sounding once', () => {
		const [top, bottom] = effect('ef_ske_sky_moon_cast');
		expect(top.get('file')).toBe(DIR + 'sky_moon_cast/sky_moon_cast');
		expect(top.get('wav')).toBe('effect/ef_beginspell');
		expect(top.get('soundLoop')).toBe('false');
		expect(bottom.get('file')).toBe(DIR + 'sky_moon_cast_bottom/sky_moon_cast_bottom');
		expect(bottom.get('wav')).toBeUndefined();
		for (const layer of [top, bottom]) {
			expect(layer.get('castLoop')).toBe('true');
			expect(layer.get('yOffset')).toBe('10');
			expect(layer.get('attachedEntity')).toBe('true');
		}
		expect(bottom.get('renderBeforeEntities')).toBe('true');
	});

	it('draws the moon and its floor on the target', () => {
		const [top, bottom] = effect('ef_ske_sky_moon');
		expect(top.get('file')).toBe(DIR + 'sky_moon/sky_moon');
		expect(top.get('wav')).toBe('effect/sky_emperor/ske_sky_moon');
		expect(bottom.get('file')).toBe(DIR + 'sky_moon_bottom/sky_moon_bottom');
		expect(bottom.get('renderBeforeEntities')).toBe('true');
		for (const layer of [top, bottom]) {
			expect(layer.get('yOffset')).toBe('10');
			expect(layer.get('attachedEntity')).toBe('true');
			expect(layer.get('castLoop')).toBeUndefined();
		}
	});

	it('plays the hit with its own sound', () => {
		const [hit] = effect('ef_ske_sky_moon_hit');
		expect(hit.get('file')).toBe(DIR + 'sky_moon_hit/sky_moon_hit');
		expect(hit.get('min')).toBe(DIR + 'sky_moon_hit/min_sky_moon_hit');
		expect(hit.get('wav')).toBe('effect/sky_emperor/ske_sky_moon_hit');
		expect(hit.get('yOffset')).toBe('8');
	});
});
