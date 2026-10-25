import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import SC from 'DB/Status/StatusConst.js';
import SU from 'DB/Skills/SkillUnitConst.js';
import StatusEffectTable from 'DB/Status/StatusEffectTable.js';
import SkillUnit, { SkillUnitEnd } from 'DB/Skills/SkillUnit.js';

// The kRO EZ2 rows that loop forever (IsInfinite), played as the official client
// plays them: a status keeps its loop on the actor while it is on, a ground unit
// keeps its loop on the unit until the unit goes. The names are rows of
// ez2streffect.bson, merged into the effect table by DBManager.
//
// The tables are read as text where they import the renderer.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('statuses that loop an EZ2 effect', () => {
	const rows = {
		[SC.UNLIMIT]: { loop: ['unlimit_loop_bottom', 'unlimit_loop'] },
		[SC.SERVANT_SIGN]: { loop: ['servant_sign_bottom', 'servant_sign'] },
		[SC.VIGOR]: { loop: ['vigor_buff'] },
		[SC.DANCING_KNIFE]: {
			start: ['dancing_knife_skill_bottom_begin', 'dancing_knife_skill_begin'],
			loop: ['dancing_knife_skill_bottom_loop', 'dancing_knife_skill_loop']
		},
		[SC.GUARD_STANCE]: { loop: ['new_guard_stance_loop_bottom'] },
		[SC.ATTACK_STANCE]: { loop: ['new_attack_stance_loop_bottom'] },
		[SC.GUARDIAN_S]: { start: ['new_guardianshield_buff_start'], loop: ['new_guardianshield_buff_loop'] },
		[SC.HOLY_S]: { loop: ['new_holy_shield_loop', 'new_holy_shield_loop_bottom'] },
		[SC.ULTIMATE_S]: { loop: ['ultimate_sacrifice_buff'] },
		[SC.SPEAR_SCAR]: { loop: ['new_grand_judgement_buff'] },
		[SC.CALAMITYGALE]: { loop: ['calumitygale_loop'] },
		[SC.MYSTIC_SYMPHONY]: { loop: ['mysticsymphony_note'] },
		[SC.HIDDEN_CARD]: { loop: ['hiddencard_thunder'] },
		[SC.T_FIVETH_GOD]: { loop: ['circle_directions_elements_loop'] },
		[SC.HEAVEN_AND_EARTH]: { loop: ['soul_of_heaven_and_earth_buff'] },
		[SC.HOGOGONG]: { loop: ['howling_of_chul_ho_scared'] },
		[SC.TEMPORARY_COMMUNION]: { loop: ['temporary_communion_buff_bottom', 'temporary_communion_buff'] },
		[SC.BREAKINGLIMIT]: { loop: ['breakinglimit_buff'] },
		[SC.RULEBREAK]: { loop: ['rulebreak_buff'] },
		[SC.NIGHTMARE]: { loop: ['efst_nightmare'] },
		[SC.TARGET_MARKER]: { start: ['target_marker_start'], loop: ['target_marker_loop'] },
		[SC.BLOCK_SEAL]: { start: ['npc_block_seal_start'], loop: ['npc_block_seal_loop_bottom', 'npc_block_seal_loop'] },
		[SC.GROGGY]: { loop: ['groggy_on_loop'] },
		[SC.MYSTERY_POWDER]: { loop: ['mistery_powder_loop_bottom', 'mistery_powder_loop'] }
	};

	it('uses the official status ids', () => {
		expect([SC.GUARD_STANCE, SC.ATTACK_STANCE, SC.GUARDIAN_S, SC.HOLY_S, SC.ULTIMATE_S, SC.SPEAR_SCAR]).toEqual([
			1202, 1203, 1204, 1220, 1221, 1222
		]);
		expect([SC.TARGET_MARKER, SC.BLOCK_SEAL, SC.GROGGY, SC.MYSTERY_POWDER]).toEqual([1453, 1454, 1456, 1665]);
	});

	it.each(Object.keys(rows))('status %s starts and loops its rows', id => {
		expect({ ...StatusEffectTable[id] }).toEqual(rows[id]);
	});

	it('no longer draws the buff once from the skill as well', () => {
		const effectTable = read('DB/Effects/EffectTable.js');
		for (const file of [
			'breakinglimit_buff/breakinglimit_buff',
			'rulebreak_buff/rulebreak_buff',
			'temporary_communion_buff/temporary_communion_buff',
			'temporary_communion_buff_bottom/temporary_communion_buff_bottom',
			'soul_of_heaven_and_earth_buff/soul_of_heaven_and_earth_buff',
			'vigor_buff/vigor_buff',
			'servant_sign/servant_sign',
			'new_cross_rain_bottom/new_cross_rain_bottom'
		]) {
			expect(effectTable, file).not.toContain(`/${file}'`);
		}
	});
});

describe('ground units that loop an EZ2 effect', () => {
	it('play their start rows, then their loop rows', () => {
		expect(SkillUnit[SU.UNT_JACK_FROST_NOVA]).toEqual([
			'jack_frost_nova_start_bottom',
			'jack_frost_nova_start',
			'jack_frost_nova_loop_bottom',
			'jack_frost_nova_loop'
		]);
		expect(SkillUnit[SU.UNT_GROUND_GRAVITATION]).toEqual([
			'ground_gravitation_bottom_start',
			'ground_gravitation_start',
			'ground_gravitation_bottom_loop',
			'ground_gravitation_loop'
		]);
		expect(SkillUnit[SU.UNT_TOTEM_OF_TUTELARY]).toEqual([
			'totem_of_tutelary_bottom_start',
			'totem_of_tutelary_start',
			'totem_of_tutelary_bottom_loop',
			'totem_of_tutelary_loop'
		]);
		expect(SkillUnit[SU.UNT_HYUN_ROKS_BREEZE]).toEqual(['hyun_roks_breeze_bottom', 'hyun_roks_breeze']);
		expect(SkillUnit[SU.UNT_MISSION_BOMBARD]).toEqual([
			'mission_bombard',
			'mission_bombard_fire',
			'mission_bombard_fire_bottom',
			'ef_nw_mission_bombard_field'
		]);
		expect(SkillUnit[SU.UNT_CROSS_RAIN]).toEqual(['new_cross_rain_bottom', 'ef_ig_cross_rain_field']);
	});

	it('play their end rows where they stood', () => {
		expect(SkillUnitEnd[SU.UNT_JACK_FROST_NOVA]).toEqual(['jack_frost_nova_end']);
		expect(SkillUnitEnd[SU.UNT_TOTEM_OF_TUTELARY]).toEqual(['totem_of_tutelary_bottom_end', 'totem_of_tutelary_end']);
	});

	it('leave the skill cast to the unit', () => {
		const skillEffect = read('DB/Skills/SkillEffect.js');
		// Their rows hold only what plays while casting (FourthJobCastAura.test.js)
		for (const skill of ['HN_JACK_FROST_NOVA', 'HN_GROUND_GRAVITATION', 'SOA_TOTEM_OF_TUTELARY', 'SH_HYUN_ROKS_BREEZE']) {
			const start = skillEffect.indexOf(`SkillEffect[SK.${skill}] =`);
			if (start === -1) {
				continue;
			}
			const row = skillEffect.slice(start, skillEffect.indexOf('};', start));
			expect(row.match(/\b\w+(?=: )/g).every(f => /^(castAuraEffectId|beginCastEffectId)$/.test(f)), skill).toBe(true);
		}
		expect(skillEffect).toContain(
			"SkillEffect[SK.NW_MISSION_BOMBARD] = { hitEffectId: 'ef_nw_mission_bombard_hit', castAuraEffectId: 840 };"
		);
	});

	function loadEffectManager() {
		const source = read('Renderer/EffectManager.js')
			.replace(/^import .*;$/gm, '')
			.replace('export default EffectManager;', 'this.EffectManager = EffectManager;');
		const entities = {};
		const context = vm.createContext({
			console,
			Math,
			Number,
			Float32Array,
			Preferences: { effect: true },
			EffectDB: { a_start: [{}], a_loop: [{}], a_end: [{}] },
			SU,
			SkillUnit: { 300: ['a_start', 'a_loop', 'not_loaded'] },
			SkillUnitEnd: { 300: ['a_end'] },
			Entity: class {
				static TYPE_EFFECT = 1;
			},
			EntityManager: { add: e => (entities[e.GID] = e), get: id => entities[id] },
			Altitude: { getCellHeight: () => 2 },
			Renderer: { tick: 0 }
		});
		vm.runInContext(source, context);
		const spammed = [];
		context.EffectManager.spam = params => spammed.push(params);
		context.EffectManager.remove = () => {};
		return { EffectManager: context.EffectManager, spammed };
	}

	it('spams every loaded effect of a unit, and its end rows when it goes', () => {
		const { EffectManager, spammed } = loadEffectManager();
		EffectManager.spamSkillZone(300, 10, 20, 77, 5, 3);
		expect(spammed.map(p => [p.effectId, p.ownerAID, p.persistent, p.skillLevel])).toEqual([
			['a_start', 77, true, 3],
			['a_loop', 77, true, 3]
		]);

		spammed.length = 0;
		EffectManager.spamSkillZoneEnd(77);
		expect(spammed.map(p => [p.effectId, p.ownerAID, [...p.position]])).toEqual([['a_end', undefined, [10, 20, 2]]]);
	});

	it('plays the end rows before the unit is removed', () => {
		const entity = read('Engine/MapEngine/Entity.js');
		expect(entity).toMatch(
			/function onSkillDisapear\(pkt\) \{\n\tEffectManager\.spamSkillZoneEnd\(pkt\.AID\);\n\tEffectManager\.remove\(null, pkt\.AID\);/
		);
	});
});
