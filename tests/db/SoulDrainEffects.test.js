import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Soul Drain (HW_SOULDRAIN, skill 364), as the kRO 2025-07-16 client plays it: a use packet with the
// result set launches 378 on the caster aimed at the target. 378 sends three particle1 souls from
// the target to the caster in 60 ticks and colours the caster (100, 100, 255) on ticks 55-65.
// Spec: effect-port/high-wizard-audit.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effect378() {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf('\n\t378: [');
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
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

describe('Soul Drain effects', () => {
	it('plays 378 on the caster on success only', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.HW_SOULDRAIN\] = \{ successEffectIdOnCaster: 378 \};/
		);
	});

	it('runs only from the success path, on the caster aimed at the target', () => {
		const { EffectManager, spammed } = loadEffectManager({ 364: { successEffectIdOnCaster: 378 } });
		EffectManager.spamSkill(364, 20, null, null, 10);
		expect(spammed).toEqual([]);
		EffectManager.spamSkillSuccess(364, 20, null, 10, 5);
		expect(spammed.map(p => [p.effectId, p.ownerAID, p.otherAID])).toEqual([[378, 10, 20]]);
	});

	it('sends three souls from the target to the caster in one second', () => {
		const [souls] = effect378();
		expect(souls.type).toBe('3D');
		expect(souls.duplicate).toBe(3);
		expect(souls.duration).toBe(1000);
		expect(souls.toSrc).toBe(true);
		expect(souls.absoluteSpriteName).toMatch(/particle1$/);
	});

	it('colours the caster blue on ticks 55-65 only', () => {
		const [, tint] = effect378();
		let callback = null;
		const entity = {
			_flashColor: [1, 1, 1, 1],
			animations: { add: fn => (callback = fn) },
			recalculateBlendingColor() {}
		};
		tint.func({ Init: { ownerEntity: entity } });
		const at = tick => {
			const done = callback((tick * 1000) / 60);
			return { done, color: entity._flashColor.slice(0, 3) };
		};
		expect(at(54)).toEqual({ done: false, color: [1, 1, 1] });
		expect(at(55)).toEqual({ done: false, color: [100 / 255, 100 / 255, 1] });
		expect(at(65)).toEqual({ done: false, color: [100 / 255, 100 / 255, 1] });
		expect(at(66)).toEqual({ done: true, color: [1, 1, 1] });
	});
});
