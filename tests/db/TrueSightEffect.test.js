import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

// True Sight (SN_SIGHT 380) as the official client (kRO 2025-07-16) plays it:
// effect 386 on the caster from the use packet, only when the packet's result
// is set. 386 plays hunter_detecting.wav on its first tick.

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

describe('True Sight', () => {
	it('plays 386 on the caster only when the use succeeds', () => {
		expect(skillRow('SN_SIGHT')).toEqual({ successEffectIdOnCaster: 386 });
	});

	it('386 plays hunter_detecting.wav on the caster', () => {
		expect(entry(386)).toContain("wav: 'effect/hunter_detecting'");
		expect(entry(386)).toContain('attachedEntity: true');
	});
});
