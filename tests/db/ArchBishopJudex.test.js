import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { planJudexLights, JUDEX_LIGHTS } from 'DB/Effects/JudexEffect.js';

// Judex (AB_JUDEX 2038): no cast aura; 1629 + 1630 for the cast time; as each damage packet's damage arrives: 1627 +
// 1628 on the caster, AB_judex.wav, 1631 + 1632 on the target and twelve 1633 + 1634 lights round it. No hit effect.
// kRO 2025-07-16, spec: effect-port/arch-bishop-skills.md.

describe('Judex plays the official cast, target and falling lights', () => {
	it('matches the official client', () => {
		expect(SkillEffect[SK.AB_JUDEX]).toEqual({ hideCastAura: true, beginCastEffectId: [1629, 1630], arrivalEffectIdOnCaster: [1627, 1628], arrivalEffectIdOnTarget: ['ef_ab_judex_sound', 1631, 1632, 'ef_ab_judex_lights'] });
		expect(EffectTable[1629][0]).toMatchObject({ type: 'STR', file: 'new_judex/new_judex_cast_loop/new_judex_cast_loop', min: 'mineffect/new_judex/new_judex_cast_loop/new_judex_cast_loop', castLoop: true, wav: 'effect/ef_beginspell', soundLoop: false });
		expect(EffectTable[1630][0]).toMatchObject({ castLoop: true, renderBeforeEntities: true });
		expect(EffectTable[1631][0].file).toBe('new_judex/new_judex_target/new_judex_target');
		expect(EffectTable[1633][0]).toMatchObject({ file: 'new_judex/new_judex_light/new_judex_light', attachedEntity: false });
		expect(EffectTable.ef_ab_judex_sound).toEqual([{ wav: 'effect/ab_judex', attachedEntity: true }]);
	});

	it('drops twelve lights 2-14 units round the target, up to 450 ms late', () => {
		for (let n = 0; n < 20; n++) {
			const lights = planJudexLights();
			expect(lights).toHaveLength(JUDEX_LIGHTS);
			for (const l of lights) {
				const d = Math.hypot(l.dx, l.dy) * 5;
				expect(d).toBeGreaterThanOrEqual(2 - 1e-9);
				expect(d).toBeLessThanOrEqual(14 + 1e-9);
				expect(l.delay % 50).toBe(0);
				expect(l.delay).toBeLessThanOrEqual(450);
			}
		}
		// r(15) = 0 still puts the light 2 units out
		const [l] = planJudexLights(() => 0);
		expect(l.dx).toBeCloseTo(2 / 5);
		expect(l.dy).toBeCloseTo(0);
		expect(l.delay).toBe(0);
		const spammed = [];
		EffectTable.ef_ab_judex_lights[0].func.call({ spam: p => spammed.push(p) }, { Inst: { position: [1, 1, 0], startTick: 2 }, Init: {} });
		expect(spammed).toHaveLength(24);
		expect(spammed.map(p => p.effectId).slice(0, 2)).toEqual([1633, 1634]);
	});
});
