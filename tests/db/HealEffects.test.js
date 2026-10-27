import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// Heal (AL_HEAL, skill 28) as the official client shows it. Spec: effect-port/acolyte-skills.md.
// - use packet, result set: by the healed amount (level field) 7 / 312 / 313 / 325 on the target;
//   the effect plays the one heal sound
// - on an undead: 320 on the target as the damage packet arrives, then 0 on every hit and 1 with the first

const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skills = read('DB/Skills/SkillEffect.js');

// The effect table imports most of the renderer, so read entries from its source.
function effectEntry(id) {
	const source = read('DB/Effects/EffectTable.js');
	const start = source.indexOf(`\n\t${id}: [`);
	const end = source.indexOf('\n\t],', start);
	const body = source.slice(start, end + 3).trim().replace(/^\d+:/, '').replace(/,$/, '');
	return vm.runInNewContext(`(${body})`);
}

const pick = vm.runInNewContext(`(${skills.match(/const healEffectByAmount = (.*);\n/)[1]})`);

describe('Heal effects', () => {
	it('picks the effect by the healed amount', () => {
		expect([1, 199, 200, 1999, 2000, 3999, 4000, 9999].map(pick)).toEqual([7, 7, 312, 312, 313, 313, 325, 325]);
	});

	it('plays it on success, and the undead damage effects', () => {
		expect(skills).toMatch(
			/SkillEffect\[SK\.AL_HEAL\] = \{\n\tsuccessEffectId: healEffectByAmount,\n\tdamageEffectIdOnTarget: 320,\n\thitEffectId: 0,\n\tfirstHitEffectId: 1\n\};/
		);
	});

	it('plays the heal sound once per effect', () => {
		for (const id of [7, 312, 313, 320, 325]) {
			expect(effectEntry(id).filter(row => row.wav === '_heal_effect')).toHaveLength(1);
		}
	});

	it('does not add a second heal sound from the use packet', () => {
		expect(read('Engine/MapEngine/Entity.js')).toMatch(
			/if \(pkt\.SKID !== SkillId\.AL_HEAL\) \{\n\t+Sound\.playPosition\('_heal_effect\.wav'/
		);
	});
});
