import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { effectTableSource } from '../helpers/effectTableSource.js';

// Spear Boomerang (KN_SPEARBOOMERANG, skill 59), as the official client plays it: as each damage
// packet arrives, effect 80 on the caster (four spear sprites thrown at the target on ticks 0, 4,
// 8 and 12, 15 ticks each, 15 units up, EF_FireBall.wav each, alpha 254 / 180 / 130 / 80), then
// 151 (SpearBoomerang.str) on the caster with no sound. The hit plays EF_HIT4 (3) once per packet,
// with no hit flash. Spec: effect-port/knight-skills.md.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const TICK = 1000 / 60;

function effectEntry(id) {
	const table = effectTableSource().replace(/\r\n/g, '\n');
	const start = table.indexOf(`\n\t${id}: [`);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Spear Boomerang effects', () => {
	it('plays 80 and 151 on the caster per damage packet and 3 once on the hit', () => {
		expect(read('DB/Skills/SkillEffect.js')).toMatch(
			/SkillEffect\[SK\.KN_SPEARBOOMERANG\] = \{ damageEffectIdOnCaster: \[80, 151\], hitEffectId: 3, hitEffectOnce: true \};/
		);
	});

	it('throws four spears on ticks 0, 4, 8 and 12, each flying 15 ticks to the target', () => {
		const spears = effectEntry(80).filter(part => part.type === '3D');
		expect(spears).toHaveLength(4);
		spears.forEach((spear, i) => {
			expect(spear.spriteName).toBe('\xc3\xa2');
			expect(spear.fromSrc).toBe(true);
			expect(spear.attachedEntity).toBe(false);
			expect(spear.zOffset).toBe(3);
			expect(spear.size).toBe(100);
			expect(Math.abs(spear.delayStart - 4 * i * TICK)).toBeLessThan(1);
			expect(Math.abs(spear.duration - 15 * TICK)).toBeLessThan(1);
		});
		expect(spears.map(s => Math.round(s.alphaMax * 255))).toEqual([255, 180, 130, 80]);
	});

	it('plays EF_FireBall.wav with each spear', () => {
		const sounds = effectEntry(80).filter(part => part.wav);
		expect(sounds.map(s => s.wav)).toEqual(Array(4).fill('effect/ef_fireball'));
		sounds.forEach((s, i) => expect(Math.abs(s.delayWav - 4 * i * TICK)).toBeLessThan(1));
	});

	it('plays SpearBoomerang.str with no sound', () => {
		const parts = effectEntry(151);
		expect(parts).toHaveLength(1);
		expect(parts[0]).toMatchObject({ type: 'STR', file: 'spearboomerang' });
		expect(parts[0].wav).toBeUndefined();
	});
});
