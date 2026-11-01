import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { hitHasEffects } from '../../src/DB/Skills/SplashHit.js';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Venom Splasher (AS_SPLASHER, skill 141), as the official client plays it: 125 (the poison
// particles) on the target when the skill succeeds; when it bursts, 129 (VenomSplasher.str, the
// sound on tick 10) on each target of a damage packet that carries skill level -1 (the server's
// mark on the splashed targets; the central target gets -2). Every damage packet is a splash packet, so no
// hit flash (DB/Skills/SplashHit.js).
// Spec: effect-port/assassin-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skills = read('DB/Skills/SkillEffect.js');

function row(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

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

describe('Venom Splasher effects', () => {
	it('plays 125 on success and 129 on the splashed targets, with no hit flash', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.AS_SPLASHER\] = \{ successEffectId: 125, splashEffectIdOnTarget: 129 \};/
		);
	});

	it('plays the splash effect only for level -1 packets, on the target', () => {
		const { EffectManager, spammed } = loadEffectManager({ 141: { splashEffectIdOnTarget: 129 } });
		EffectManager.spamSkillSplashMark(141, 20, 1500, 10, -1);
		EffectManager.spamSkillSplashMark(141, 21, 1500, 10, -2);
		EffectManager.spamSkillSplashMark(141, 22, 1500, 10, 5);
		EffectManager.spamSkillSplashMark(140, 23, 1500, 10, -1);
		expect(spammed.map(p => [p.effectId, p.ownerAID, p.otherAID, p.startTick])).toEqual([[129, 20, 10, 1500]]);
	});

	it('hands every damage packet level to the splash mark', () => {
		expect(read('Engine/MapEngine/Entity.js')).toMatch(
			/EffectManager\.spamSkillSplashMark\(pkt\.SKID, pkt\.targetID, Renderer\.tick, pkt\.AID, pkt\.level\);/
		);
	});

	it('shows no hit effects on its splash hits, as every splash skill', () => {
		expect(hitHasEffects(141, 5)).toBe(false);
		expect(hitHasEffects(141, 14)).toBe(false);
	});

	it('plays the burst sound on tick 10', () => {
		const [str] = row(129);
		expect(str.file).toBe('venomsplasher');
		expect(str.wav).toBe('effect/assasin_venomsplasher');
		expect(str.delayWav).toBeCloseTo(10000 / 60, 6);
	});
});
