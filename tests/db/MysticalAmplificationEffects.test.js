import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Mystical Amplification (HW_MAGICPOWER, skill 366), as the kRO 2025-07-16 client plays it: the
// cast-aura picker keeps its default (16), and only a use packet with the result set removes and
// relaunches 382 (the actor's body flag 0x4) and plays the amplify sound. A failed use plays
// nothing. Spec: effect-port/high-wizard-audit.md.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function row() {
	const text = read('DB/Skills/SkillEffect.js');
	const start = text.indexOf('SkillEffect[SK.HW_MAGICPOWER] =');
	expect(start).toBeGreaterThan(-1);
	const line = text.slice(start, text.indexOf('\n', start));
	return vm.runInNewContext(`(${line.slice(line.indexOf('{'), line.lastIndexOf('}') + 1)})`);
}

function loadEffectManager(skillTable) {
	const source = read('Renderer/EffectManager.js')
		.replace(/^import .*;$/gm, '')
		.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
	const context = vm.createContext({ console, Math, Number, Float32Array, SU: {}, SkillUnit: {}, SkillEffect: skillTable });
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	return { EffectManager: context.EffectManager, spammed };
}

describe('Mystical Amplification effects', () => {
	it('keeps the default cast aura 16', () => {
		expect(row()).toMatchObject({ hideCastAura: true, beginCastEffectId: 16 });
	});

	it('plays nothing from a use packet without the result set', () => {
		const { EffectManager, spammed } = loadEffectManager({ 366: row() });
		EffectManager.spamSkill(366, 10, null, null, 10);
		expect(spammed).toEqual([]);
	});

	it('plays its sound on the caster when the use succeeds', () => {
		const { EffectManager, spammed } = loadEffectManager({ 366: row() });
		EffectManager.spamSkillSuccess(366, 10, null, 10, 5);
		expect(spammed.map(p => [p.effectId, p.ownerAID])).toEqual([['ef_magicpower', 10]]);
	});
});
