import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Massive Flame Blaster, as the official client plays it: when the use-skill
// packet arrives, effect 2094 (massivefblaster.str) once on the ground where
// the caster stands, not following them. Each hit still plays the hit art on
// its target. Before, the blaster sat in effectId and so also played on every
// target of every damage packet, out in front of the caster.
//
// Read as text: the tables import the renderer, which does not load without a canvas.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skillEffect = read('DB/Skills/SkillEffect.js');
const effectTable = read('DB/Effects/EffectTable.js');

function row() {
	const start = skillEffect.indexOf('SkillEffect[SK.IQ_MASSIVE_F_BLASTER] =');
	expect(start).toBeGreaterThan(-1);
	const text = skillEffect.slice(skillEffect.indexOf('{', start), skillEffect.indexOf('\n};', start) + 2);
	return vm.runInNewContext(`(${text})`);
}

function entry(id) {
	const start = effectTable.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return vm.runInNewContext(effectTable.slice(effectTable.indexOf('[', start), effectTable.indexOf('\n\t],', start) + 3));
}

describe('Massive Flame Blaster', () => {
	it('plays the blaster on the caster at use, and only the hit art per hit', () => {
		expect({ ...row() }).toEqual({
			successEffectIdOnCaster: 'ef_iq_massive_f_blaster',
			hitEffectId: 'ef_iq_massive_f_blaster_hit'
		});
	});

	it('leaves the blaster where the caster stood', () => {
		const rows = entry('ef_iq_massive_f_blaster');
		expect(rows).toHaveLength(1);
		expect(rows[0].file).toBe('4iq_massivefblaster/massivefblaster/massivefblaster');
		expect(rows[0].attachedEntity).toBeUndefined();
	});
});
