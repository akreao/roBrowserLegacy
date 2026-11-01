import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SkillEffect from 'DB/Skills/SkillEffect.js';
import SK from 'DB/Skills/SkillConst.js';

// White Imprison (WL_WHITEIMPRISON 2201), kRO 2025-07-16: the use packet plays nothing; the target shows 802 while
// its body state is IMPRISON (8), launched and removed by Actor_UpdateOption (0xc55f00).

const entity = readFileSync(join(process.cwd(), 'src/Engine/MapEngine/Entity.js'), 'utf8').replace(/\r\n/g, '\n');

describe('White Imprison', () => {
	it('plays nothing from the use packet', () => {
		expect(SkillEffect[SK.WL_WHITEIMPRISON]).toEqual({});
	});

	it('shows 802 while the body state is IMPRISON', () => {
		const option = entity.slice(entity.indexOf('function onEntityOptionChange('));
		expect(option.indexOf('updateImprisonEffect(pkt.AID, entity._bodyState, pkt.bodyState);')).toBeGreaterThan(0);
		expect(option.indexOf('updateImprisonEffect(')).toBeLessThan(option.indexOf('entity.bodyState = pkt.bodyState;'));
		const fn = entity.slice(entity.indexOf('function updateImprisonEffect('));
		expect(fn).toContain('EffectManager.remove(null, AID, EffectConst.EF_BOTTOM_BASILICA2);');
		expect(fn).toContain('EffectManager.spam({ effectId: EffectConst.EF_BOTTOM_BASILICA2, ownerAID: AID });');
	});

	it('shows 802 on an actor that comes into view imprisoned, for up to the official 2999 ticks', () => {
		const spawn = entity.slice(entity.indexOf('function onEntitySpam('));
		expect(spawn).toContain('const oldBodyState = entity ? entity._bodyState : 0;');
		expect(spawn.indexOf('updateImprisonEffect(entity.GID, oldBodyState, entity._bodyState);')).toBeGreaterThan(
			spawn.indexOf('EntityManager.add(entity);')
		);
		const table = readFileSync(join(process.cwd(), 'src/DB/Effects/EffectTable.js'), 'utf8');
		const row = table.slice(table.indexOf('\t802: ['), table.indexOf('\t803'));
		expect(row).not.toContain('duration: 20000');
		expect(row).toContain('duration: 49983');
	});
});
