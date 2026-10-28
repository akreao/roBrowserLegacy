import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';
import { martyrsReckoningBody, sacrificeBodyAt } from '../../src/DB/Effects/MartyrsReckoningEffect.js';

// Martyr's Reckoning (PA_SACRIFICE, 368) as the official client (kRO 2025-07-16) plays it: no cast
// aura, nothing on the use packet, 366 on the caster as each damage packet arrives (세크리파이스.wav
// on tick 22, the doubled body coloured 255/200/200 on ticks 20-40), the hit flash 0.
// Spec: effect-port/paladin-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

describe("Martyr's Reckoning", () => {
	it('plays 366 on the caster as each damage packet arrives, with no cast aura', () => {
		expect(SkillEffect[SK.PA_SACRIFICE]).toEqual({
			hideCastAura: true,
			damageEffectIdOnCaster: 366,
			hitEffectId: 0
		});
		expect(table).toMatch(/\t366: \[\r?\n\t\tmartyrsReckoningBody,/);
	});

	it('366: 세크리파이스.wav on tick 22', () => {
		expect(martyrsReckoningBody.wav).toBe('effect/\xbc\xbc\xc5\xa9\xb8\xae\xc6\xc4\xc0\xcc\xbd\xba');
		expect(martyrsReckoningBody.delayWav).toBe(Math.round((22 * 1000) / 60));
	});

	it('366: doubled light red body on ticks 20-40, then the colour comes back 8 a tick', () => {
		expect(sacrificeBodyAt(19)).toBeNull();
		expect(sacrificeBodyAt(20)).toEqual({ halo: true, green: 200, blue: 200, done: false });
		expect(sacrificeBodyAt(40)).toEqual({ halo: true, green: 200, blue: 200, done: false });
		expect(sacrificeBodyAt(41)).toEqual({ halo: false, green: 208, blue: 208, done: false });
		expect(sacrificeBodyAt(47)).toEqual({ halo: false, green: 255, blue: 255, done: true });
	});

	it('366: the FUNC part drives the caster body from the effect start', () => {
		let step = null;
		const entity = {
			_flashColor: [1, 1, 1, 1],
			_enableHalo: false,
			recalculateBlendingColor() {},
			animations: { add: fn => (step = fn) }
		};
		martyrsReckoningBody.func({ Init: { ownerEntity: entity } });
		const at = tick => step((tick * 1000) / 60 + 1);

		expect(at(10)).toBe(false);
		expect(entity._flashColor).toEqual([1, 1, 1, 1]);
		expect(at(30)).toBe(false);
		expect(entity._enableHalo).toBe(true);
		expect(entity._flashColor).toEqual([1, 200 / 255, 200 / 255, 1]);
		expect(at(50)).toBe(true);
		expect(entity._enableHalo).toBe(false);
		expect(entity._flashColor).toEqual([1, 1, 1, 1]);
	});
});
