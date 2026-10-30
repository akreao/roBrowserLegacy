import { describe, expect, it } from 'vitest';
import { BLINK, blinkBodyColor, startBlinkBody } from 'Renderer/Effects/BlinkBody.js';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';

// EF_BLINK_BODY (1209), kRO 2025-07-16 case 0xbc070d: the actor blinks
// (155, 155, 255) and (50, 50, 50) on even and odd ticks up to 60, then the
// client's colour recovery brings it back by 8 a tick.

describe('Blinking body', () => {
	it('blinks pale blue and dark on even and odd ticks up to 60', () => {
		expect(blinkBodyColor(0)).toEqual([155 / 255, 155 / 255, 1]);
		expect(blinkBodyColor(1)).toEqual([50 / 255, 50 / 255, 50 / 255]);
		expect(blinkBodyColor(BLINK.last)).toEqual([155 / 255, 155 / 255, 1]);
	});

	it('then comes back by 8 a tick from pale blue', () => {
		expect(blinkBodyColor(BLINK.last + 5)[0]).toBeCloseTo(195 / 255);
		expect(blinkBodyColor(BLINK.last + 13)).toEqual([1, 1, 1]);
	});

	it('runs on the entity through its flash colour and stops once back', () => {
		const added = [];
		const entity = {
			_flashColor: [1, 1, 1, 1],
			animations: { add: f => added.push(f) },
			recalculateBlendingColor() {}
		};
		startBlinkBody(entity);
		const PRIM = 1000 / 60;
		expect(added[0](1 * PRIM)).toBe(false);
		expect(entity._flashColor[0]).toBeCloseTo(50 / 255);
		expect(added[0](80 * PRIM)).toBe(true);
		expect(entity._flashColor).toEqual([1, 1, 1, 1]);
	});
});

describe('Blinking body effect', () => {
	it('is 1209, from Soul Division on the target and Soul Collect on the caster', () => {
		expect(EffectTable[1209][0]).toMatchObject({ type: 'FUNC', attachedEntity: true });
		expect(SkillEffect[SK.SP_SOULDIVISION].damageEffectIdOnTarget).toContain(1209);
		expect(SkillEffect[SK.SP_SOULCOLLECT]).toEqual({ successEffectIdOnCaster: 1209 });
	});
});
