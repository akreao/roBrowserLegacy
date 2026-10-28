import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import EffectTable from 'DB/Effects/EffectTable.js';

// Intimidate / Snatch (RG_INTIMIDATE, skill 219): the official client plays 227 where the caster
// stands as the damage packet arrives (ef_bash.wav at once, rog_intimidate.wav on tick 35), and the
// standard hit flash (0) once per packet on the target. roBrowser played 227 (one sound) on the target
// after attackMT and again from the use packet. Spec: effect-port/rogue-skills.md.

const skills = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

describe('Intimidate effects', () => {
	it('plays 227 at the caster per damage packet and the hit flash once per packet', () => {
		expect(skills).toContain(
			'SkillEffect[SK.RG_INTIMIDATE] = { damageEffectIdOnCaster: 227, hitEffectId: [0], hitEffectOnce: true };'
		);
	});

	it('plays the bash sound at once and the Intimidate sound on tick 35, left where the caster was', () => {
		const rows = EffectTable[227];
		expect(rows.map(r => [r.wav, r.delayWav || 0])).toEqual([
			['effect/ef_bash', 0],
			['effect/rog_intimidate', 583]
		]);
		expect(rows.every(r => r.attachedEntity === false)).toBe(true);
	});
});
