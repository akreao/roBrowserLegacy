import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// A skill's hitEffectId may be 0, the hit flash (EF_HIT1): Throw Stone and Sand Attack
// play it once per damage packet in the official client. 0 used to be skipped as false.
// Spec: effect-port/thief-skills.md, effect-port/ninja-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function loadEffectManager(skillTable) {
	const source = read('Renderer/EffectManager.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
	const context = vm.createContext({
		console,
		Math,
		Number,
		Float32Array,
		SU: {},
		SkillUnit: {},
		SkillEffect: skillTable,
		Renderer: { tick: 1000 },
		EntityManager: { get: () => null }
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	return { EffectManager: context.EffectManager, spammed };
}

describe('hitEffectId 0', () => {
	it('plays the hit flash 0', () => {
		const { EffectManager, spammed } = loadEffectManager({ 1: { hitEffectId: 0, hitEffectOnce: true } });
		EffectManager.spamSkillHit(1, 20, 1000, 10, 0);
		EffectManager.spamSkillHit(1, 20, 1200, 10, 1);
		expect(spammed.map(p => [p.effectId, p.ownerAID, p.startTick])).toEqual([[0, 20, 1000]]);
	});

	it('plays nothing without a hit effect', () => {
		const { EffectManager, spammed } = loadEffectManager({ 1: {} });
		EffectManager.spamSkillHit(1, 20, 1000, 10, 0);
		expect(spammed).toEqual([]);
	});
});
