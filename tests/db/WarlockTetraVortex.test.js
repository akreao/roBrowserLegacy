import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { tetraSubOffsets } from 'DB/Effects/TetraVortexEffect.js';

// Tetra Vortex (WL_TETRAVORTEX 2217): cast aura 805 + 1277 + 1261. Elements 2218-2221: use packet (result set): three sounds,
// ground + explosion on the target (and four sub explosions, not ported); hits at attackMT + 0 / 500 / 1000 / 1500 ms.
// kRO 2025-07-16, spec: effect-port/warlock-skills.md.

describe('Tetra Vortex cast and element blasts as the official client plays them', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.WL_TETRAVORTEX]).toEqual({ castAuraEffectId: 805, beginCastEffectId: [1277, 1261] });
		expect(SkillEffect[SK.WL_TETRAVORTEX_FIRE]).toEqual({ successEffectIdOnCaster: 'ef_wl_tetravortex_sound', successEffectId: [1270, 1266, 'ef_wl_tetravortex_sub_fire'] });
		expect(SkillEffect[SK.WL_TETRAVORTEX_WATER]).toMatchObject({ successEffectId: [1271, 1267, 'ef_wl_tetravortex_sub_water'], hitDelay: 500 });
		expect(SkillEffect[SK.WL_TETRAVORTEX_WIND]).toMatchObject({ successEffectId: [1272, 1268, 'ef_wl_tetravortex_sub_wind'], hitDelay: 1000 });
		expect(SkillEffect[SK.WL_TETRAVORTEX_GROUND]).toMatchObject({ successEffectId: [1273, 1269, 'ef_wl_tetravortex_sub_earth'], hitDelay: 1500 });
		expect(EffectTable[1266][0].file).toBe('tetravortex/tetra_01_fire_explosion/tetra_01_fire_expn');
		expect(EffectTable[1273][0].file).toBe('tetravortex/tetra_03_earth_ground/tetra_03_earth_grd');
		expect(EffectTable.ef_wl_tetravortex_sound.map(p => p.wav)).toEqual(['effect/wizard_meteo', 'effect/hunter_blastmine', 'effect/wl_tetravortex']);
	});

	it('puts four sub explosions round the target, one in each quarter, 10-34 units out and 5 up', () => {
		const offsets = tetraSubOffsets();
		expect(offsets.map(([x, y]) => [Math.sign(x), Math.sign(y)])).toEqual([
			[1, 1],
			[1, -1],
			[-1, -1],
			[-1, 1]
		]);
		for (const [x, y, z] of offsets) {
			expect(Math.abs(x)).toBeGreaterThanOrEqual(2);
			expect(Math.abs(x)).toBeLessThanOrEqual(6.8);
			expect(Math.abs(y)).toBeGreaterThanOrEqual(2);
			expect(Math.abs(y)).toBeLessThanOrEqual(6.8);
			expect(z).toBe(1);
		}
		expect(tetraSubOffsets(() => 0)[0]).toEqual([2, 2, 1]);
		const spammed = [];
		EffectTable.ef_wl_tetravortex_sub_wind[0].func.call(
			{ spam: p => spammed.push(p) },
			{ Inst: { position: [10, 10, 0], startTick: 3 }, Init: {} }
		);
		expect(spammed.map(p => p.effectId)).toEqual([1280, 1280, 1280, 1280]);
		expect(EffectTable[1278][0]).toMatchObject({ file: 'tetravortex/tetra_01_fire_sub_explosion/tetra_01_fire_sub_expn', attachedEntity: false });
		expect(EffectTable[1281][0].file).toBe('tetravortex/tetra_03_earth_sub_explosion/tetra_03_earth_sub_expn');
	});
});
