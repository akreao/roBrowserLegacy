import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import EffectTable from 'DB/Effects/EffectTable.js';
import SK from 'DB/Skills/SkillConst.js';
import { iconFile, iconCopyEffect } from 'DB/Effects/RecognizedSpellEffect.js';
import { planIcons, copyAlpha, iconSize, copyAt, ICON_LIFE } from 'Renderer/Effects/RecognizedSpellSim.js';

// 803 EF_RECOGNIZED (kRO 2025-07-16, case 0xbbb278): 10 x 0xbda890(delay 30 i + 1) prim 68 (update 0xb52550 mode 4,
// draw 0xb68200) with a random Mage (9-20) or Wizard (80-92) skill icon. Spec: effect-port/warlock-skills.md.
describe('Recognized Spell cast icons (803)', () => {
	it('shows ten icons 30 ticks apart from tick 1, Mage or Wizard skills', () => {
		const low = planIcons(() => 0);
		expect(low.map(i => i.start)).toEqual([1, 31, 61, 91, 121, 151, 181, 211, 241, 271]);
		expect(low[0].skillId).toBe(9);
		expect(planIcons(() => 0.999)[0].skillId).toBe(92);
	});

	it('brightens each copy 13 a tick to its cap; copy 10 holds to tick 25, then fades while the icon grows', () => {
		expect([1, 6, 19, 20, 34].map(n => copyAlpha(1, n))).toEqual([13, 70, 70, 65, 0]);
		expect([19, 25, 26, 74, 75].map(n => copyAlpha(10, n))).toEqual([247, 247, 242, 2, 0]);
		expect(ICON_LIFE).toBe(75);
		expect(iconSize(25)).toBe(5);
		expect(iconSize(30)).toBeCloseTo(5 * 1.01 ** 5);
		expect(iconSize(200)).toBeCloseTo(5 * 1.01 ** 49);
	});

	it('draws the copies 40 units up, a unit apart', () => {
		expect(copyAt(10, 0)).toEqual({ z: 8, size: 5 * Math.SQRT2 * 7, alpha: 13 });
		expect(copyAt(1, 0).size - copyAt(10, 0).size).toBeCloseTo(9 * Math.SQRT2 * 7);
	});

	it('uses the skill icon, untinted, normal blending', () => {
		expect(iconFile(SK.MG_COLDBOLT)).toBe('\xc0\xaf\xc0\xfa\xc0\xce\xc5\xcd\xc6\xe4\xc0\xcc\xbd\xba/item/mg_coldbolt.bmp');
		expect(iconCopyEffect('x.bmp', 3)).toMatchObject({ file: 'x.bmp', blendMode: 8 });
		const spammed = [];
		EffectTable[803][0].func.call({ spamEffect: p => spammed.push(p) }, { Init: {}, Inst: { startTick: 0 } });
		expect(spammed).toHaveLength(100);
		expect(EffectTable[803][0].wav).toBeUndefined();
	});
});
