import { describe, expect, it } from 'vitest';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';
import EffectTable from 'DB/Effects/EffectTable.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Sonic Wave (RK_SONICWAVE 2002): no use effect; when the damage arrives the official client plays
// 기공포.wav and launches 832 and 1678 (new_sonicwave rings, SonicWaveSim.js) on the caster.
// kRO 2025-07-16, spec: effect-port/rune-knight-skills.md.

describe('Sonic Wave', () => {
	it('plays 832 (the sound) and 1678 on the caster as each packet damage is due, nothing on use', () => {
		expect(SkillEffect[SK.RK_SONICWAVE]).toMatchObject({ arrivalEffectIdOnCaster: [832, 1678] });
		expect(EffectTable[832][0].wav).toBe('effect/\xb1\xe2\xb0\xf8\xc6\xf7');
	});
});

describe('arrival effects', () => {
	it('play once per damage packet at the arrival tick, on the caster or the target', () => {
		const source = readFileSync(join(process.cwd(), 'src', 'Renderer/EffectManager.js'), 'utf8')
			.replace(/\r\n/g, '\n')
			.replace(/^import .*;$/gm, '')
			.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
		const context = vm.createContext({
			console,
			Math,
			Number,
			Float32Array,
			SU: {},
			SkillUnit: {},
			SkillEffect: { 1: { arrivalEffectIdOnCaster: 'a', arrivalEffectIdOnTarget: 'b' } },
			EntityManager: { get: () => null }
		});
		vm.runInContext(source, context);
		const spammed = [];
		context.EffectManager.spam = params => spammed.push(params);
		context.EffectManager.spamSkillDamage(1, 2, 100, 3, undefined, 1, 450);
		expect(spammed.map(p => [p.effectId, p.ownerAID, p.startTick])).toEqual([
			['a', 3, 450],
			['b', 2, 450]
		]);
	});
});
