import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { scaledLayer } from '../../src/Renderer/Entity/ScaledLayer.js';

// Lightning Jolt (NJ_RAIGEKISAI, skill 541): the official client plays 622 at the cell (ground packet)
// and on the caster when the use packet succeeds: the 썬더스톰 sprite, 2 ticks a frame, once, 2.5
// times its size, 4.5 units up, EF_ThunderStorm.wav at the start. No STR. Spec:
// effect-port/ninja-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
const row = id => table.slice(table.indexOf(`\t${id}: [`), table.indexOf('\t],', table.indexOf(`\t${id}: [`)));

describe('Lightning Jolt', () => {
	it('plays 622 from the skill packets', () => {
		expect(skills).toContain('SkillEffect[SK.NJ_RAIGEKISAI] = { effectId: 622 };');
	});

	it('draws the 썬더스톰 sprite 2.5 times its size, 2 ticks a frame, 4.5 units up', () => {
		const r = row(622);
		expect(r).toContain("type: 'SPR',");
		expect(r).toContain("file: '\\xbd\\xe3\\xb4\\xf5\\xbd\\xba\\xc5\\xe8',");
		expect(r).toContain('delayFrame: 2 * (1000 / 60),');
		expect(r).toContain('scale: 2.5,');
		expect(r).toContain('yOffset: -31');
		expect(r).toContain("wav: 'effect/ef_thunderstorm',");
		expect(r).not.toContain('setsudan');
	});

	it('scales an effect sprite layer offset with its size', () => {
		const layer = { pos: [-17, -64], scale: [1, 1], index: 0 };
		expect(scaledLayer(layer, 1)).toBe(layer);
		const big = scaledLayer(layer, 2.5);
		expect(big.pos).toEqual([-42.5, -160]);
		expect(big.index).toBe(0);
		expect(layer.pos).toEqual([-17, -64]);
	});
});

// spamSprite from EffectManager.js, run on its own with a stub Entity
function spamSprite() {
	const src = readFileSync(join(process.cwd(), 'src/Renderer/EffectManager.js'), 'utf8');
	const start = src.indexOf('function spamSprite(');
	const end = src.indexOf('\n}', start) + 2;
	const added = [];
	class Entity {
		static TYPE_EFFECT = 99;
		constructor() {
			this.attachments = { add: a => (this.added = a) };
		}
	}
	const context = vm.createContext({ Entity, EntityManager: { add: e => added.push(e) }, spriteAction: f => f });
	vm.runInContext(src.slice(start, end) + '\nthis.spamSprite = spamSprite;', context);
	return { run: context.spamSprite, added };
}

describe('Lightning Jolt placement', () => {
	const effect = { type: 'SPR', scale: 2.5, yOffset: -31, delayFrame: 2 * (1000 / 60) };

	it('the ground packet draws the bolt at the cell, not on the caster', () => {
		expect(row(622)).not.toContain('attachedEntity');
		const { run, added } = spamSprite();
		const caster = { position: [10, 10, 0], attachments: { add: () => expect.fail('drawn on caster') } };
		run({ effect, Init: { ownerEntity: caster, ownerAID: 1 }, Inst: { position: [13, 10, 0] } });
		expect(added).toHaveLength(1);
		expect(added[0].position).toEqual([13, 10, 0]);
		expect(added[0].added.scale).toBe(2.5);
	});

	it('the water depth pass draws attachments at their own scale', () => {
		const attachments = readFileSync(join(process.cwd(), 'src/Renderer/Entity/EntityAttachments.js'), 'utf8');
		const render = readFileSync(join(process.cwd(), 'src/Renderer/Entity/EntityRender.js'), 'utf8');
		expect(attachments).toContain('scale: attachment.scale,');
		expect(render).toContain('item.scale === 1 ? item.layers[i] : scaledLayer(item.layers[i], item.scale)');
	});
});
