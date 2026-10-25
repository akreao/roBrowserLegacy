import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Intensive Aim, as in the official client: while the stance is on, the server
// raises the Intensive Aim Count status from 1 to 10. Each value clears the gauge
// and shows that value's stage; 10 adds the full glow. Ending the count leaves the
// stage; ending the stance clears it. Using the skill plays the helix on the caster.

vi.mock('Renderer/EffectManager.js', () => ({
	default: { spam: vi.fn(), has: vi.fn(() => false), remove: vi.fn() }
}));

const { default: EffectManager } = await import('Renderer/EffectManager.js');
const { default: StatusConst } = await import('DB/Status/StatusConst.js');
const { updateStatusEffects } = await import('Engine/MapEngine/StatusEffects.js');

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function effectEntry(name) {
	const source = read('DB/Effects/EffectTable.js');
	const start = source.indexOf(`\n\t${name}: [`);
	expect(start, `${name} is defined`).toBeGreaterThan(-1);
	const end = source.indexOf('\n\t],', start);
	return vm.runInNewContext(`(${source.slice(start, end + 3).trim().replace(/^\w+:/, '').replace(/,$/, '')})`);
}

const stage = n => 'ef_nw_intensive_aim_' + String(n).padStart(2, '0');
const gauge = [...Array.from({ length: 11 }, (_, n) => stage(n)), 'ef_nw_intensive_aim_full'];
const spammed = () => EffectManager.spam.mock.calls.map(c => c[0].effectId);
const removed = () => EffectManager.remove.mock.calls.map(c => c[2]);

describe('Intensive Aim gauge', () => {
	beforeEach(() => vi.clearAllMocks());

	it.each([1, 5, 9])('count %i clears the gauge and shows that stage', n => {
		updateStatusEffects(7, StatusConst.INTENSIVE_AIM_COUNT, 1, n);
		expect(removed().sort()).toEqual([...gauge].sort());
		expect(EffectManager.remove.mock.calls.every(c => c[0] === null && c[1] === 7)).toBe(true);
		expect(EffectManager.spam.mock.calls.map(c => c[0])).toEqual([{ effectId: stage(n), ownerAID: 7 }]);
		// cleared before the new stage starts
		expect(Math.max(...EffectManager.remove.mock.invocationCallOrder)).toBeLessThan(
			EffectManager.spam.mock.invocationCallOrder[0]
		);
	});

	it('count 10 shows the last stage and the full glow', () => {
		updateStatusEffects(7, StatusConst.INTENSIVE_AIM_COUNT, 1, 10);
		expect(spammed()).toEqual([stage(10), 'ef_nw_intensive_aim_full']);
	});

	it('a count with no stage only clears the gauge', () => {
		updateStatusEffects(7, StatusConst.INTENSIVE_AIM_COUNT, 1, undefined);
		expect(spammed()).toEqual([]);
		expect(removed()).toHaveLength(12);
	});

	it('ending the count leaves the stage', () => {
		updateStatusEffects(7, StatusConst.INTENSIVE_AIM_COUNT, 0);
		expect(EffectManager.remove).not.toHaveBeenCalled();
		expect(EffectManager.spam).not.toHaveBeenCalled();
	});

	it('ending the stance clears every stage and the full glow', () => {
		updateStatusEffects(7, StatusConst.INTENSIVE_AIM, 0);
		expect(removed().sort()).toEqual([...gauge].sort());
		updateStatusEffects(7, StatusConst.INTENSIVE_AIM, 1, 1);
		expect(EffectManager.spam).not.toHaveBeenCalled();
	});
});

describe('Intensive Aim files', () => {
	it.each(Array.from({ length: 11 }, (_, n) => n))('stage %i uses the official file and placement', n => {
		const nn = String(n).padStart(2, '0');
		const [layer] = effectEntry(stage(n));
		expect(layer.file).toBe(`night_watch/nw_intensive_aim/intensive_aim/intensive_aim_${nn}`);
		expect(layer.min).toBe(`night_watch/nw_intensive_aim/intensive_aim/min_intensive_aim_${nn}`);
		expect(layer.texturePath).toBe('night_watch/nw_intensive_aim/intensive_aim/');
		expect(layer.xOffset).toBe(8);
		expect(layer.yOffset).toBe(7);
		expect(layer.attachedEntity).toBe(true);
		expect(layer.renderBeforeEntities).toBeUndefined();
		// 00 to 09 loop, 10 plays once; all but 00 sound once
		expect(!!layer.repeat).toBe(n < 10);
		expect(layer.wav).toBe(n === 0 ? undefined : 'effect/night_watch/nw_intensive_aim');
		if (layer.repeat && layer.wav) {
			expect(layer.soundLoop).toBe(false);
		}
	});

	it('loops the full glow from 496 ms, silently', () => {
		const [layer] = effectEntry('ef_nw_intensive_aim_full');
		expect(layer.file).toBe('night_watch/nw_intensive_aim/intensive_aim_full/intensiveaim_full');
		expect(layer.repeat).toBe(true);
		expect(layer.delayStart).toBe(496);
		expect(layer.wav).toBeUndefined();
		expect([layer.xOffset, layer.yOffset]).toEqual([8, 7]);
	});

	it('plays the helix once on the caster each time the skill is used', () => {
		const [layer] = effectEntry('ef_nw_intensive_aim_helix');
		expect(layer.file).toBe('night_watch/nw_intensive_aim/intensive_aim_helix/intensiveaim_helix');
		expect(layer.wav).toBe('effect/night_watch/nw_intensiveaim_helix');
		expect(layer.repeat).toBeUndefined();
		expect(layer.xOffset).toBeUndefined();
		expect(layer.yOffset).toBe(10);
		const line = read('DB/Skills/SkillEffect.js')
			.split('\n')
			.find(l => l.startsWith('SkillEffect[SK.NW_INTENSIVE_AIM] ='));
		expect(line).toMatch(/= \{ successEffectIdOnCaster: 'ef_nw_intensive_aim_helix' \};/);
	});

	it('passes the status value on from the status packet', () => {
		expect(read('Engine/MapEngine/Entity.js')).toContain(
			'updateStatusEffects(pkt.AID, pkt.index, pkt.state, pkt.val ? pkt.val[0] : undefined);'
		);
	});
});
