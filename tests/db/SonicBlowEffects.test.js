import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const { sonicBlowHitBand, sonicBlowHitEffect } = await import('DB/Effects/SonicBlowEffect.js');
const { createPrimState, advancePrim } = await import('Renderer/Effects/EffectPrimSim.js');

// Sonic Blow (AS_SONICBLOW, skill 136), as the official client plays it: 121 and 143 on the caster as
// each damage packet arrives; on the hit the hit flash 0 and 122 once per packet. 122 is
// assasin_sonicblow.wav and one magic_red cone band (primitive 13) opening the way the target faces:
// base 4, top 7, height 3.5, 2 units along its axis and drifting 0.4 a tick slowing by half, 12 ticks,
// fading from tick 6, 0-2 units along x and 1-11 up at random. Spec: effect-port/assassin-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Sonic Blow effects', () => {
	it('plays 121 and 143 on the caster per packet and 0 + 122 once per hit packet', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.AS_SONICBLOW\] = \{ damageEffectIdOnCaster: \[121, 143\], hitEffectId: \[0, 122\], hitEffectOnce: true \};/
		);
	});

	it('draws the hit as a facing magic_red cone band with the client numbers', () => {
		const band = sonicBlowHitBand(() => 0);
		expect(band).toMatchObject({
			type: 'PRIM',
			prim: 'cone',
			texture: 'magic_red',
			frames: 12,
			facing: true,
			pitch: -90,
			baseRadius: 4,
			topRadius: 7,
			coneHeight: 3.5,
			driftStart: 2,
			drift: 0.4,
			fadeOutFrame: 6
		});
		expect(band.driftAccel).toBeCloseTo(-0.4 / 24, 8);
	});

	it('places the band 0-2 units along x and 1-11 units up, in whole units', () => {
		expect([sonicBlowHitBand(() => 0).offsetX, sonicBlowHitBand(() => 0.999).offsetX]).toEqual([0, 2]);
		expect([sonicBlowHitBand(() => 0).height, sonicBlowHitBand(() => 0.999).height]).toEqual([11, 1]);
	});

	it('starts 2 units along its axis and drifts on from there', () => {
		const state = createPrimState(sonicBlowHitBand(() => 0));
		expect(state.driftOffset).toBe(2);
		advancePrim(state, 1);
		expect(state.driftOffset).toBeCloseTo(2 + 0.4 - 0.4 / 24, 6);
	});

	it('plays the Sonic Blow sound with the band', () => {
		expect(sonicBlowHitEffect.map(r => r.wav).filter(Boolean)).toEqual(['effect/assasin_sonicblow']);
	});
});
