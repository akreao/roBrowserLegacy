import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Star Light Kick's caster effect, official effect 2426. It draws nothing: on the
// 60 Hz effect clock it holds the caster on frame 5 of the skill motion at tick 5
// (83 ms) and lets them go back to standing at tick 35 (583 ms), but only if
// nothing else changed their motion in between.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return effectTable.slice(start, effectTable.indexOf('\n\t],', start) + 3);
}

// Runs the effect's func against a fake entity and returns a clock to drive it.
function play(entityOverrides = {}) {
	const Renderer = { tick: 1000 };
	const src = entry('ef_ske_star_light_kick_caster');
	const layers = vm.runInNewContext(`(${src.slice(src.indexOf('[')).replace(/,$/, '')})`, { Renderer });
	expect(layers).toHaveLength(1);
	const [layer] = layers;
	expect(layer.type).toBe('FUNC');
	expect(layer.attachedEntity).toBe(true);

	const anims = [];
	const entity = {
		ACTION: { IDLE: 0, WALK: 1, SIT: 2, DIE: 8, SKILL: 12 },
		action: 12,
		animation: { play: true, next: false },
		calls: [],
		animations: { add: cb => anims.push({ tick: Renderer.tick, cb }) },
		setAction(opt) {
			this.calls.push(opt);
			this.action = opt.action;
			this.animation = { play: opt.play, next: opt.next };
		},
		...entityOverrides
	};
	layer.func({ Init: { ownerEntity: entity }, Inst: { startTick: Renderer.tick } });
	const at = ms => {
		Renderer.tick = 1000 + ms;
		for (let i = anims.length - 1; i >= 0; i--) {
			if (anims[i].cb(Renderer.tick - anims[i].tick)) {
				anims.splice(i, 1);
			}
		}
	};
	return { entity, at, pending: () => anims.length };
}

describe('Star Light Kick caster pose (effect 2426)', () => {
	it('is played on the caster once per successful use', () => {
		const start = skillEffect.indexOf('SkillEffect[5504 /* SKE_STAR_LIGHT_KICK */] = {');
		const row = skillEffect.slice(start, skillEffect.indexOf('};', start));
		expect(row).toContain("successEffectIdOnCaster: 'ef_ske_star_light_kick_caster'");
	});

	it('holds frame 5 of the skill motion from tick 5, then goes back to standing at tick 35', () => {
		const { entity, at, pending } = play();
		at(80);
		expect(entity.calls).toHaveLength(0);
		at(84);
		expect(entity.calls).toEqual([{ action: 12, frame: 5, repeat: false, play: false, next: false }]);
		at(580);
		expect(entity.calls).toHaveLength(1);
		at(584);
		expect(entity.calls[1]).toEqual({ action: 0, frame: 0, repeat: true, play: true, next: false });
		expect(pending()).toBe(0);
	});

	it('leaves the caster alone if they moved on before tick 35', () => {
		const { entity, at, pending } = play();
		at(84);
		entity.setAction({ action: 1, frame: 0, repeat: true, play: true, next: false });
		at(600);
		expect(entity.calls).toHaveLength(2);
		expect(entity.action).toBe(1);
		expect(pending()).toBe(0);
	});

	it('does not pose a dead or sitting caster', () => {
		const { entity, at, pending } = play({ action: 8 });
		at(100);
		expect(entity.calls).toHaveLength(0);
		expect(pending()).toBe(0);
	});
});
