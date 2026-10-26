import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Summoner (Doram) skills: what the official client plays for each. Spec: effect-port/summoner-skills.md.

const source = readFileSync(join(process.cwd(), 'src/DB/Skills/SkillEffect.js'), 'utf8');

function row(skill) {
	const match = source.match(new RegExp(`SkillEffect\\[SK\\.${skill}\\] = (\\{[^\\n]*\\});`));
	return match && match[1];
}

describe('Summoner skill effects', () => {
	it('Scratch plays once, on use success only', () => {
		expect(row('SU_SCRATCH')).toBe("{ successEffectId: 'ef_su_scratch' }");
	});
	it("Picky Peck plays once, on use success only", () => {
		expect(row('SU_PICKYPECK')).toBe("{ successEffectId: 'ef_su_pickypeck' }");
	});
	it("Tuna Belly plays once, on use success only", () => {
		expect(row('SU_TUNABELLY')).toBe("{ successEffectId: 'ef_su_tunabelly' }");
	});

	it('Tuna Belly is the one su_tunabelly STR with its sound', () => {
		const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
		const block = table.match(/\tef_su_tunabelly: \[([\s\S]*?)\r?\n\t\],/)[1];
		expect(block.match(/type: 'STR'/g)).toHaveLength(1);
		expect(block).toContain("file: 'su_tunabelly/su_tunabelly'");
		expect(block).toContain("wav: 'effect/su_tunabelly'");
	});
	it("Arclouse Dash plays on use success only", () => {
		expect(row('SU_ARCLOUSEDASH')).toBe("{ successEffectId: 'ef_su_arclousedash' }");
	});
	it("Power of Flock plays on use success only", () => {
		expect(row('SU_POWEROFFLOCK')).toBe("{ successEffectId: 'ef_su_powerofflock' }");
	});
	it("Hiss plays on use success only", () => {
		expect(row('SU_HISS')).toBe("{ successEffectId: 'ef_su_hiss' }");
	});
	it("Grooming plays on use success only", () => {
		expect(row('SU_GROOMING')).toBe("{ successEffectId: 'ef_su_grooming' }");
	});

	it("Purring plays Grooming's effect on use success", () => {
		expect(row('SU_PURRING')).toBe("{ successEffectId: 'ef_su_grooming' }");
	});
	it("Chattering plays on use success only", () => {
		expect(row('SU_CHATTERING')).toBe("{ successEffectId: 'ef_su_chattering' }");
	});

	it("Meow Meow plays Chattering's effect on use success", () => {
		expect(row('SU_MEOWMEOW')).toBe("{ successEffectId: 'ef_su_chattering' }");
	});
	it("Fresh Shrimp plays on use success only", () => {
		expect(row('SU_FRESHSHRIMP')).toBe("{ successEffectId: 'ef_su_freshshrimp' }");
	});

	it("Tasty Shrimp Party plays on use success", () => {
		expect(row('SU_SHRIMPARTY')).toBe("{ successEffectId: 'ef_su_shrimparty' }");
	});

	it('Tasty Shrimp Party is Fresh Shrimp with su_shrimpparty.wav', () => {
		const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
		const block = table.match(/\tef_su_shrimparty: \[([\s\S]*?)\r?\n\t\],/)[1];
		expect(block).toContain("file: 'su_freshshrimp/su_freshshrimp'");
		expect(block).toContain("wav: 'effect/su_shrimpparty'");
	});
	it("Bunch of Shrimp plays on use success only", () => {
		expect(row('SU_BUNCHOFSHRIMP')).toBe("{ successEffectId: 'ef_su_bunchofshrimp' }");
	});

	it('Bunch of Shrimp has its sound', () => {
		const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
		const block = table.match(/\tef_su_bunchofshrimp: \[([\s\S]*?)\r?\n\t\],/)[1];
		expect(block).toContain("wav: 'effect/su_brunchofshrimp'");
	});
	it("Stem Spear plays at the caster as the damage packet arrives", () => {
		expect(row('SU_SV_STEMSPEAR')).toBe("{ damageEffectIdOnCaster: 'ef_su_sv_stemspear' }");
	});

	it('Stem Spear has its sound and is not attached', () => {
		const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
		const block = table.match(/\tef_su_sv_stemspear: \[([\s\S]*?)\r?\n\t\],/)[1];
		expect(block).toContain("wav: 'effect/su_stemspear'");
		expect(block).not.toContain('attachedEntity');
	});
	it("Spirit of Savage plays on each target as its damage packet arrives", () => {
		expect(row('SU_SVG_SPIRIT')).toBe("{ damageEffectIdOnTarget: 'ef_su_svg_spirit' }");
	});
});
