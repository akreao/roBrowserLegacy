import { describe, expect, it } from 'vitest';
import EffectTable from 'DB/Effects/EffectTable.js';

// Third-job new effects, kRO 2025-07-16: each CEZ2STREffect plays its own sounds (sound list 0xaed3d0, each at an
// age in ticks, 60 a second). Spec: effect-port/ez2-sounds.md.

const sounds = key => EffectTable[key].filter(row => row.wav).map(row => [row.wav, row.delayWav || 0]);

describe('Third-job STR effect sounds', () => {
	it.each([
		['ef_gn_cartcannon_cast', 'Cart Cannon'],
		['ef_lg_rayofgenesis_cast', 'Ray of Genesis'],
		['ef_sr_gateofhell_cast', 'Gate of Hell'],
		['ef_sr_howlingoflion_cast', 'Howling of Lion'],
		['ef_wm_metalicsound', 'Metallic Sound'],
		['ef_gn_wallofthorn_cast', 'Wall of Thorns'],
		['ef_gn_mandragora_cast', 'Howling of Mandragora'],
		['ef_wm_sound_of_destruction_cast', 'Sound of Destruction']
	])('%s (%s) plays EF_BeginSpell.wav', key => {
		expect(sounds(key)).toEqual([['effect/ef_beginspell', 0]]);
	});

	it('Aimed Bolt cast 1649 plays EF_BeginSpell.wav once', () => {
		expect(EffectTable[1649][0]).toMatchObject({ castLoop: true, wav: 'effect/ef_beginspell', soundLoop: false });
	});

	it.each([
		['ef_rk_windcutter', [['effect/wl_siennaexecrate', 0]]],
		[1549, [['effect/ef_bash', 0]]],
		['ef_nc_axetornado', [['ice_titan_attack', 83]]],
		[
			'ef_sc_fatalmenace',
			[
				['effect/ef_bash', 0],
				['effect/_og_intimidate', 583]
			]
		],
		[
			'ef_lg_cannonspear',
			[
				['effect/ef_hit2', 167],
				['effect/ef_hit4', 333]
			]
		],
		['ef_gc_crossimpact', [['effect/ef_stonecurse', 0]]],
		['ef_lg_rayofgenesis', [['effect/mon_\xb8\xcd\xb7\xe6\xb0\xfa\xb0\xad', 83]]] // effect/mon_맹룡과강
	])('%s plays its own sounds', (key, expected) => {
		expect(sounds(key)).toEqual(expected);
	});

	it('keeps the skill sounds on the older rows only once', () => {
		expect(sounds('ef_cannonspear')).toEqual([['effect/lg_cannonspear', 0]]);
		expect(sounds('ef_rayofgenesis')).toEqual([['effect/lg_rayofgenesis', 0]]);
		expect(sounds('ef_gateofhell')).toEqual([['effect/sr_gateofhell', 0]]);
	});
});
