import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { layoutGraffiti, graffitiUV } from 'Renderer/Effects/GraffitiSim.js';
import SkillUnit from 'DB/Skills/SkillUnit.js';
import SU from 'DB/Skills/SkillUnitConst.js';

// Official CGraffiSkill (kRO 2025-07-16): the caster's text, written with
// effect\alpabet.bmp into a 384 px texture, lies on the 18 x 18 cells around
// the unit, turned by the local player's facing.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Graffiti layout', () => {
	it('picks glyphs: A-Z 0-25, a-z 26-51, ? 53, ! 54, 0-9 from 54', () => {
		expect(layoutGraffiti('Az?!09').map(g => g.glyph)).toEqual([0, 51, 53, 54, 54, 63]);
	});

	it('reads glyphs from an 8-wide sheet of 32 px cells', () => {
		const [g] = layoutGraffiti('z');
		expect([g.sx, g.sy]).toEqual([(51 & 7) * 32, (51 >> 3) * 32]);
	});

	it('gives letters 32 px, punctuation 16, and a space the width before it', () => {
		const glyphs = layoutGraffiti('ab! c');
		expect(glyphs.map(g => [g.x, g.w])).toEqual([
			[0, 32],
			[32, 32],
			[64, 16],
			[96, 32]
		]);
	});

	it('starts lower the shorter the text is', () => {
		expect(layoutGraffiti('hi')[0].y).toBe(5 * 36);
		expect(layoutGraffiti('x'.repeat(48))[0].y).toBe(4 * 36);
	});

	it('wraps at 352 px, and moves a word that would not fit to the next line', () => {
		// a glyph ending at 352 is already past the end: ten letters a line
		const eleven = layoutGraffiti('abcdefghijk');
		expect(eleven[9].x).toBe(288);
		expect(eleven[10]).toMatchObject({ x: 0, y: eleven[0].y + 36 });

		const words = layoutGraffiti('abcdefgh abcd');
		// the space itself still takes its width on the new line, as in the client
		const second = words[8];
		expect(second).toMatchObject({ x: 32, y: words[0].y + 36 });
	});

	it('draws nothing for characters outside the sheet', () => {
		expect(layoutGraffiti('a#b').map(g => g.x)).toEqual([0, 48]);
	});
});

describe('Graffiti on the ground', () => {
	it('lays the texture over the 18 cells with v down south and u from the east, facing south', () => {
		const [u0, v0] = graffitiUV(9, -9, 0);
		expect(u0).toBeCloseTo(0);
		expect(v0).toBeCloseTo(0);
		const [u1, v1] = graffitiUV(-9, 9, 0);
		expect(u1).toBeCloseTo(1);
		expect(v1).toBeCloseTo(1);
	});

	it('turns with the facing', () => {
		const [u, v] = graffitiUV(9, 9, 90);
		expect(u).toBeCloseTo(0);
		expect(v).toBeCloseTo(0);
	});

	it('maps unit 0xB0 to the graffiti row and passes the packet text along', () => {
		expect(SkillUnit[SU.UNT_GRAFFITI]).toBe('ef_graffiti');
		expect(read('DB/Effects/EffectTable.js')).toContain('ef_graffiti: graffitiEffect,');
		expect(read('Engine/MapEngine/Entity.js')).toContain('pkt.level, pkt.range, pkt.msg);');
		expect(read('Renderer/EffectManager.js')).toContain('unitMessage: message');
		expect(read('DB/Effects/GraffitiEffect.js')).toContain('Params.Init.unitMessage');
	});
});
