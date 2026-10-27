import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// firstHitEffectId plays on the first hit of a damage packet only: the official client
// sends a multi-hit packet's hit-map effect with its first hit message, while the hit
// flash comes with every hit. Throw Spirit Sphere: 0 on each sphere, 1 on the first.
// Spec: effect-port/monk-skills.md.

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

describe('firstHitEffectId', () => {
	it('plays the hit flash on every hit and the first-hit effect once', () => {
		const { EffectManager, spammed } = loadEffectManager({ 1: { hitEffectId: 0, firstHitEffectId: 1 } });
		[0, 1, 2].forEach(i => EffectManager.spamSkillHit(1, 20, 1000 + 200 * i, 10, i));
		expect(spammed.map(p => [p.effectId, p.ownerAID, p.startTick])).toEqual([
			[0, 20, 1000],
			[1, 20, 1000],
			[0, 20, 1200],
			[0, 20, 1400]
		]);
	});

	it('is used by Throw Spirit Sphere, thrown from the caster at packet arrival', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.MO_FINGEROFFENSIVE\] = \{ damageEffectIdOnCaster: 265, hitEffectId: 0, firstHitEffectId: 1 \};/
		);
		const table = read('DB/Effects/EffectTable.js');
		const row = table.slice(table.indexOf('\t265: ['), table.indexOf('\t266: ['));
		expect(row).toMatch(/fromSrc: true/);
		expect(row).not.toMatch(/toSrc/);
	});
});
