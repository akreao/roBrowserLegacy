import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	FUNNEL,
	GANBANTEIN_FUNNEL,
	FUNNEL_VERTICES,
	bandState,
	buildFunnel,
	funnelAlpha,
	visibleTicks
} from '../../src/Renderer/Effects/CastFunnelSim.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Ganbantein (HW_GANBANTEIN, skill 483), as the official client plays it from the ground packet:
// EF_FireWall.wav and effect 223 at the cell, the funnel of four ring_white.tga rings (prim 31)
// in its variant 2: like the cast funnel (variant 4) but leaning 70 degrees at first and fading
// 8 a tick after tick 10, so it is gone on tick 35. Spec: effect-port/wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Ganbantein funnel', () => {
	it('differs from the cast funnel only in its lean and fade', () => {
		expect({ ...GANBANTEIN_FUNNEL, lean: FUNNEL.lean, alphaDown: FUNNEL.alphaDown }).toEqual(FUNNEL);
		expect(GANBANTEIN_FUNNEL.lean).toBe(70);
		expect(GANBANTEIN_FUNNEL.alphaDown).toBe(8);
	});

	it('rises to 200 over 10 ticks, then fades 8 a tick and is gone on tick 35', () => {
		expect(funnelAlpha(10, GANBANTEIN_FUNNEL)).toBe(200);
		expect(funnelAlpha(11, GANBANTEIN_FUNNEL)).toBe(192);
		expect(funnelAlpha(34, GANBANTEIN_FUNNEL)).toBe(8);
		expect(funnelAlpha(35, GANBANTEIN_FUNNEL)).toBe(0);
		expect(visibleTicks(GANBANTEIN_FUNNEL)).toBe(35);
		expect(visibleTicks()).toBe(50);
	});

	it('leans from 70 degrees down to 40', () => {
		expect(bandState(0, 1, GANBANTEIN_FUNNEL).lean).toBe(69);
		expect(bandState(0, 30, GANBANTEIN_FUNNEL).lean).toBe(40);
		expect(bandState(0, 1).lean).toBe(79);
	});

	it('builds the same number of triangles as the cast funnel', () => {
		const out = new Float32Array(FUNNEL_VERTICES * 5);
		expect(buildFunnel(out, 5, [10, 10, 0], GANBANTEIN_FUNNEL)).toBe(FUNNEL_VERTICES);
	});

	it('plays 223 and EF_FireWall.wav from the ground packet', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.HW_GANBANTEIN\] = \{ effectId: \[223, 'ef_ganbantein_wav'\], castAuraEffectId: 58 \};/
		);
		const table = effectTableSource().replace(/\r\n/g, '\n');
		const row = table.slice(table.indexOf('\n\t223: ['), table.indexOf('\n\t],', table.indexOf('\n\t223: [')));
		expect(row).toContain("new CastFunnel(Params.Inst.position, Params.Inst.startTick, 300, 'ring_white.tga', GANBANTEIN_FUNNEL)");
		const wav = table.slice(table.indexOf('\n\tef_ganbantein_wav: ['), table.indexOf('\n\t],', table.indexOf('\n\tef_ganbantein_wav: [')));
		expect(wav).toContain("wav: 'effect/ef_firewall'");
	});
});
