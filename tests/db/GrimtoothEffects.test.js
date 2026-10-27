import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Grimtooth (AS_GRIMTOOTH, skill 137): the official client plays 123 on the caster as each damage
// packet arrives (EF_FrostDiver.wav and stone spikes walking at the target, 2 units a tick, one every
// 3 ticks, stopping within 2.5 units), and on the hit the hit flash 0 and 132 once per packet.
// Spec: effect-port/assassin-skills.md.

const read = file => readFileSync(join(process.cwd(), file), 'utf8');
const skills = read('src/DB/Skills/SkillEffect.js');

function row(id) {
	const table = read('src/DB/Effects/EffectTable.js');
	const start = table.indexOf(`\n\t${id}: [`);
	const text = table.slice(table.indexOf('[', start), table.indexOf('\n\t],', start) + 3);
	return vm.runInNewContext(`(${text})`);
}

describe('Grimtooth effects', () => {
	it('plays 123 on the caster per damage packet and 0 + 132 once per hit packet', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.AS_GRIMTOOTH\] = \{ damageEffectIdOnCaster: 123, hitEffectId: \[0, 132\], hitEffectOnce: true \};/
		);
	});

	it('walks the spikes from the caster and stops half a cell short of the target', () => {
		const [sound, trail] = row(123);
		expect(sound.wav).toBe('effect/ef_frostdiver');
		expect(trail.type).toBe('TRAIL');
		expect(trail.sourceIsOwner).toBe(true);
		expect(trail.speed).toBe(24); // 2 units a tick = 0.4 cells x 60
		expect(trail.interval).toBe(50); // every 3 ticks
		expect(trail.stopAtTarget).toBe(true);
		expect(trail.overshoot).toBe(-0.5);
	});
});
