import { describe, it, expect, vi } from 'vitest';

vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));

import GunslingerBodyEffects from 'DB/Effects/GunslingerBodyEffects.js';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import { SCHEDULES, glowLayers, READY_COLOR, RED_COLOR } from 'Renderer/Effects/BodyMotionSim.js';

// Numbers from the official client (kRO 2020-12-29), effect-port/gunslinger-skills.md
describe('Gunslinger body glows', () => {
	it('glows Fling targets red on ticks 0 to 16 with counter 3 x age', () => {
		expect(SCHEDULES[548](0)).toEqual({ red: 0 });
		expect(SCHEDULES[548](4)).toEqual({ red: 12 });
		expect(SCHEDULES[548](16)).toEqual({ red: 48 });
		expect(SCHEDULES[548](17)).toBeNull();
		expect(glowLayers([SCHEDULES[548](5)])).toEqual([{ color: RED_COLOR, alpha: 160 }]);
		expect(glowLayers([SCHEDULES[548](16)])).toEqual([{ color: RED_COLOR, alpha: 15 }]);
	});

	it('flickers Madness Canceller blue and Adjustment red on one tick in four', () => {
		const on = age => [0, 1, 2, 3, 4, 5, 56, 57].filter(a => SCHEDULES[age](a));
		expect(on(625)).toEqual([0, 4, 56]);
		expect(on(626)).toEqual([0, 4, 56]);
		expect(glowLayers([SCHEDULES[625](8)])).toEqual([{ color: READY_COLOR, alpha: 160 }]);
		expect(glowLayers([SCHEDULES[626](8)])).toEqual([{ color: RED_COLOR, alpha: 160 }]);
	});

	it('draws blue before red when both are on', () => {
		expect(glowLayers([{ red: 20 }, { ready: 20 }]).map(g => g.color)).toEqual([READY_COLOR, RED_COLOR]);
		expect(glowLayers([{ press: 1 }])).toEqual([]);
	});

	it('lives 60 ticks, as the client table says', () => {
		for (const id of [548, 625, 626]) {
			expect(GunslingerBodyEffects[id]).toHaveLength(1);
			expect(GunslingerBodyEffects[id][0].type).toBe('FUNC');
		}
	});

	it('plays Madness Canceller only on success', () => {
		expect(SkillEffect[SK.GS_MADNESSCANCEL]).toEqual({ successEffectId: 625 });
	});
});
