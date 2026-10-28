import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from '../../src/DB/Skills/SkillEffect.js';
import SK from '../../src/DB/Skills/SkillConst.js';

// Head Crush 398 and Joint Beat 399: the official client (kRO 2025-07-16) gives them no cast aura,
// plays 399 / 400 on the caster as each damage packet arrives (not at the cast) and the hit flash 0
// on each hit; the hit message plays the weapon hit sound itself. 400's sound plays on tick 22.
// Spec: effect-port/lord-knight-skills.md.

const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');

function row(name) {
	const start = table.indexOf(`\t${name}: [`);
	expect(start).toBeGreaterThan(-1);
	return table.slice(start, table.indexOf('\t],', start));
}

describe('Head Crush and Joint Beat effects', () => {
	it.each([
		['LK_HEADCRUSH', 399],
		['LK_JOINTBEAT', 400]
	])('%s: no cast aura, caster effect as the packet arrives, hit flash', (name, onCaster) => {
		expect(SkillEffect[SK[name]]).toEqual({
			hideCastAura: true,
			damageEffectIdOnCaster: onCaster,
			hitEffectId: 0
		});
	});

	it('399 plays its sound at once', () => {
		expect(row('399')).not.toMatch(/delayWav/);
	});

	it('400 plays its sound on tick 22', () => {
		expect(row('400')).toMatch(/delayWav: 22 \* \(1000 \/ 60\),/);
	});
});
