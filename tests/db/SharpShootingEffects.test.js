import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Sharp Shooting (SN_SHARPSHOOTING 382) as the official client (kRO 2025-07-16)
// plays it: cast aura 58 whatever the element; effect 388 on the caster as each
// damage packet arrives (splash too), its sound on tick 30; the bow arrow of the
// attack motion (action 2) from each packet that is not splash; each hit plays
// the hit flash 0, and the hit map's 1 with the first hit.

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

function skillRow(name) {
	const source = read('DB/Skills/SkillEffect.js');
	const start = source.indexOf(`SkillEffect[SK.${name}] =`);
	expect(start, name).toBeGreaterThan(-1);
	const text = source.slice(source.indexOf('{', start), source.indexOf('};', start) + 1);
	return JSON.parse(JSON.stringify(vm.runInNewContext(`(${text})`)));
}

function entry(id) {
	const table = read('DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	expect(start, `${id} is defined`).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\n\t],', start)).replace(/\s+/g, ' ');
}

describe('Sharp Shooting', () => {
	it('casts with aura 58, 388 on the caster per packet, the bow arrow and the hits', () => {
		expect(skillRow('SN_SHARPSHOOTING')).toEqual({
			castAuraEffectId: 58,
			damageEffectIdOnCaster: 388,
			releaseEffectId: 'ef_arrow_projectile',
			hitEffectId: 0,
			firstHitEffectId: 1
		});
	});

	it('388 plays its sound on the caster on tick 30', () => {
		const row = entry(388);
		expect(row).toContain("wav: 'effect/\\xbb\\xfe\\xc7\\xc1\\xbd\\xb4\\xc6\\xc3'");
		expect(row).toContain('delayWav: 30 * (1000 / 60)');
		expect(row).toContain('attachedEntity: true');
	});

	it('no bow arrow from a splash packet, 5 or 14', async () => {
		const { packetLaunchesSkill } = await import('DB/Skills/SkillMotionEffect.js');
		expect(packetLaunchesSkill(382, 5)).toBe(false);
		expect(packetLaunchesSkill(382, 14)).toBe(false);
		expect(packetLaunchesSkill(382, 8)).toBe(true);
		expect(read('Engine/MapEngine/Entity.js')).toContain(
			'if (srcEntity && dstEntity && packetLaunchesSkill(pkt.SKID, pkt.action)) {'
		);
	});

	it('a type 14 packet from a skill that takes splash as normal still plays its effect', async () => {
		const { packetLaunchesSkill } = await import('DB/Skills/SkillMotionEffect.js');
		expect(packetLaunchesSkill(2476, 14)).toBe(true); // Cart Tornado
		expect(packetLaunchesSkill(2476, 5)).toBe(false); // type 5 skipped, as before
	});

	it('the old ring_jadu cast circle is gone', () => {
		expect(read('DB/Effects/EffectTable.js')).not.toContain('496_beforecast');
		expect(read('DB/Skills/SkillEffect.js')).not.toContain('496_beforecast');
	});
});
