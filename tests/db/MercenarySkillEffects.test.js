import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Mercenary skills (8201-8240) in the kRO 2025-07-16 client: not in the start-up effect maps, no damage-arrival
// or ground cases, no hit flash except Magnum Break's 49; the use packet plays only a few effects.
// See effect-port/mercenary-audit.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');
const row = name => {
	const m = source.match(new RegExp(`SkillEffect\\[SK\\.${name}\\] = ([^;]*);`));
	return m && m[1];
};

describe('Mercenary skill effects', () => {
	it('plays nothing for the skills whose use packet has no case', () => {
		[
			'MS_BASH',
			'MS_REFLECTSHIELD',
			'MA_SKIDTRAP',
			'MA_LANDMINE',
			'MA_SANDMAN',
			'MA_FREEZINGTRAP',
			'MA_REMOVETRAP',
			'ML_PIERCE',
			'ML_SPIRALPIERCE',
			'ML_DEVOTION',
			'MER_QUICKEN',
			'MER_PROVOKE',
			'MER_DECAGI',
			'MER_LEXDIVINA'
		].forEach(name => expect(row(name), name).toBe('{}'));
	});

	it('gives Magnum Break 17 on the caster and the 49 hit flash, nothing from the hit map', () => {
		expect(row('MS_MAGNUM')).toBe('{ successEffectIdOnCaster: 17, hitEffectId: 49 }');
	});

	it('keeps the player rows where the client uses the same case', () => {
		expect(row('MS_PARRYING')).toBe('SkillEffect[SK.LK_PARRYING]');
		expect(row('MS_BERSERK')).toBe('SkillEffect[SK.LK_BERSERK]');
		expect(row('ML_DEFENDER')).toBe('SkillEffect[SK.CR_DEFENDER]');
		expect(row('ML_AUTOGUARD')).toBe('SkillEffect[SK.CR_AUTOGUARD]');
		expect(row('MER_MAGNIFICAT')).toBe('SkillEffect[SK.PR_MAGNIFICAT]');
		expect(row('MER_KYRIE')).toBe('SkillEffect[SK.PR_KYRIE]');
	});

	it('plays Blessing and Increase AGI on the target with no hit effects', () => {
		expect(row('MER_BLESSING')).toBe('{ successEffectId: 42 }');
		expect(row('MER_INCAGI')).toBe('{ successEffectId: 37 }');
	});

	it('keeps only the bow arrow for the archer skills', () => {
		expect(row('MA_DOUBLE')).toBe("{ damageEffectIdOnTarget: 'ef_arrow_projectile' }");
		expect(row('MA_SHOWER')).toBe("{ releaseEffectId: 'ef_arrow_projectile' }");
		expect(row('MA_SHARPSHOOTING')).toBe("{ releaseEffectId: 'ef_arrow_projectile' }");
		expect(row('MA_CHARGEARROW')).toBe('{ hideCastAura: true }');
	});
});
