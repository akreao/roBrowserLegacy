import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { hitHasEffects } from 'DB/Skills/SplashHit.js';
import { motionEffectForPacket } from 'DB/Skills/SkillMotionEffect.js';

// Splash hits, as the official client (kRO 2025-07-16) shows them: a damage packet of type 5 or 14
// whose target is a known actor queues its hit with no hit effects (no flash, no hit-map effect),
// except for skills whose splash packets go on as normal ones and a few newer skills.
// Spec: effect-port/merchant-audit.md "2025 re-check".

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
		motionEffectForPacket,
		Renderer: { tick: 1000 },
		EntityManager: { get: () => null }
	});
	vm.runInContext(source, context);
	const spammed = [];
	context.EffectManager.spam = params => spammed.push(params);
	return { EffectManager: context.EffectManager, spammed };
}

describe('splash hits', () => {
	it('carry no hit effects for a splash packet (5 or 14)', () => {
		expect(hitHasEffects(153, 5)).toBe(false); // Cart Revolution, targets around the first
		expect(hitHasEffects(7, 5)).toBe(false); // Magnum Break
		expect(hitHasEffects(17, 14)).toBe(false); // Fire Ball
	});

	it('carry them for other damage types', () => {
		[4, 6, 8, 9, 13].forEach(type => expect(hitHasEffects(153, type)).toBe(true));
	});

	it('carry them for skills whose splash packets go on as normal ones', () => {
		expect(hitHasEffects(47, 5)).toBe(true); // Arrow Shower
		expect(hitHasEffects(11, 5)).toBe(true); // Napalm Beat
	});

	it('carry them for the newer skills with their own splash hit effects, and unknown ones', () => {
		[5215, 5245, 5385].forEach(id => expect(hitHasEffects(id, 5)).toBe(true));
		expect(hitHasEffects(1172, 5)).toBe(true);
	});

	it('skips the target effects of a splash hit but keeps the caster ones', () => {
		const { EffectManager, spammed } = loadEffectManager({
			153: { damageEffectIdOnCaster: 170, hitEffectId: 0, firstHitEffectId: 170, hitEffectIdOnCaster: 99 }
		});
		EffectManager.spamSkillHit(153, 2, 1000, 1, 0, true);
		expect(spammed.map(e => [e.effectId, e.ownerAID])).toEqual([[99, 1]]);
		spammed.length = 0;
		EffectManager.spamSkillHit(153, 2, 1000, 1, 0);
		expect(spammed.map(e => [e.effectId, e.ownerAID])).toEqual([
			[0, 2],
			[170, 2],
			[99, 1]
		]);
	});

	it('is applied to packets from actors, not from ground skill units', () => {
		const entity = read('Engine/MapEngine/Entity.js');
		expect(entity).toContain(
			'const targetHitEffects = !srcEntity || srcEntity.skillUnitId != null || hitHasEffects(pkt.SKID, pkt.action);'
		);
		expect(entity).toMatch(/EffectManager\.spamSkillHit\(\s*pkt\.SKID,\s*pkt\.targetID,\s*startTick,\s*pkt\.AID,\s*i,\s*!targetHitEffects,/);
	});
});
