/**
 * @module DB/Effects/Table/ef_rk
 *
 * The effect table's named ef_rk_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Enchant Blade (RK_ENCHANTBLADE) and Giant Growth (RK_GIANTGROWTH): the use-packet sound, on the caster.
	// See effect-port/rune-knight-skills.md.
	ef_rk_ninja_throw_sound: [
		{
			wav: 'effect/\xb4\xd1\xc0\xda_\xb4\xf8\xc1\xf6\xb1\xe2', // effect/닌자_던지기
			attachedEntity: true
		}
	],

	// EF_BLUECASTING (441) launched by a use packet, not a cast: the cast-aura row 441 lasts as long as the
	// cast, so on its own it would never end. The official client gives 441 a 60-tick (1 s) lifetime. Rune Knight
	// buffs (Death Bound, Millennium Shield, Stone Hard Skin, Fighting Spirit, Phantom Thrust). See effect-port/rune-knight-skills.md.
	ef_rk_bluecasting: [
		{
			//EF_BLUECASTING (441), 1 s
			alphaMax: 0.8,
			animation: 2,
			attachedEntity: true,
			blendMode: 2,
			blue: 1,
			bottomSize: 1,
			duration: 1000,
			fade: true,
			green: 1,
			height: 4,
			red: 1,
			rotate: true,
			textureName: 'ring_blue',
			topSize: 5,
			type: 'CYLINDER',
			wav: 'effect/ef_beginspell'
		}
	],

	// Wind Cutter (RK_WINDCUTTER): official effect 1690 on the caster when the use packet has the result set,
	// then 1691 / 1692 (floor slash, by the caster's facing). See effect-port/rune-knight-skills.md.
	ef_rk_windcutter: [
		{
			//new_windcutter (1690): CEZ2STREffect, new_windcutter\\new_windcutter\\new_windcutter.str
			type: 'STR',
			file: 'new_windcutter/new_windcutter/new_windcutter',
			texturePath: 'new_windcutter/new_windcutter/',
			min: 'mineffect/new_windcutter/new_windcutter/new_windcutter',
			minTexturePath: 'mineffect/new_windcutter/new_windcutter/',
			attachedEntity: true
		}
	],

	// Wind Cutter's floor slash toward 1 o'clock (1691).
	ef_rk_windcutter_bottom_01: [
		{
			//new_windcutter_bottom_01clock (1691): CEZ2STREffect, new_windcutter\\new_windcutter_bottom_01clock\\new_windcutter_bottom_01clock.str
			type: 'STR',
			file: 'new_windcutter/new_windcutter_bottom_01clock/new_windcutter_bottom_01clock',
			texturePath: 'new_windcutter/new_windcutter_bottom_01clock/',
			min: 'mineffect/new_windcutter/new_windcutter_bottom_01clock/new_windcutter_bottom_01clock',
			minTexturePath: 'mineffect/new_windcutter/new_windcutter_bottom_01clock/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Wind Cutter's floor slash toward 5 o'clock (1692).
	ef_rk_windcutter_bottom_05: [
		{
			//new_windcutter_bottom_05clock (1692): CEZ2STREffect, new_windcutter\\new_windcutter_bottom_05clock\\new_windcutter_bottom_05clock.str
			type: 'STR',
			file: 'new_windcutter/new_windcutter_bottom_05clock/new_windcutter_bottom_05clock',
			texturePath: 'new_windcutter/new_windcutter_bottom_05clock/',
			min: 'mineffect/new_windcutter/new_windcutter_bottom_05clock/new_windcutter_bottom_05clock',
			minTexturePath: 'mineffect/new_windcutter/new_windcutter_bottom_05clock/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Wind Cutter on each target other than the caster, as the damage packet arrives (1693).
	ef_rk_windcutter_target: [
		{
			//new_windcutter_target (1693): CEZ2STREffect, new_windcutter\\new_windcutter_target\\new_windcutter_target.str
			type: 'STR',
			file: 'new_windcutter/new_windcutter_target/new_windcutter_target',
			texturePath: 'new_windcutter/new_windcutter_target/',
			min: 'mineffect/new_windcutter/new_windcutter_target/new_windcutter_target',
			minTexturePath: 'mineffect/new_windcutter/new_windcutter_target/',
			attachedEntity: true
		}
	],

	// Ignition Break (RK_IGNITIONBREAK): official effects 1624 and 1625 (floor) and wl_jackfrost.wav on the
	// caster when the use packet has the result set. See effect-port/rune-knight-skills.md.
	ef_rk_ignitionbreak: [
		{
			//new_ignitionbreak (1624): CEZ2STREffect, new_ignitionbreak\\new_ignitionbreak\\new_ignitionbreak.str
			type: 'STR',
			file: 'new_ignitionbreak/new_ignitionbreak/new_ignitionbreak',
			texturePath: 'new_ignitionbreak/new_ignitionbreak/',
			min: 'mineffect/new_ignitionbreak/new_ignitionbreak/new_ignitionbreak',
			minTexturePath: 'mineffect/new_ignitionbreak/new_ignitionbreak/',
			wav: 'effect/wl_jackfrost',
			attachedEntity: true
		},
		{
			//new_ignitionbreak_bottom (1625): CEZ2STREffect, new_ignitionbreak\\new_ignitionbreak_bottom\\new_ignitionbreak_bottom.str
			type: 'STR',
			file: 'new_ignitionbreak/new_ignitionbreak_bottom/new_ignitionbreak_bottom',
			texturePath: 'new_ignitionbreak/new_ignitionbreak_bottom/',
			min: 'mineffect/new_ignitionbreak/new_ignitionbreak_bottom/new_ignitionbreak_bottom',
			minTexturePath: 'mineffect/new_ignitionbreak/new_ignitionbreak_bottom/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Dragon Breath (RK_DRAGONBREATH): the breath on the caster as a damage packet arrives, one of 1380-1383 by the
	// caster's facing, 200 ms in; then the bomb on each target. See effect-port/rune-knight-skills.md.
	ef_rk_dragonbreath_01: [
		{
			//new_dragonbreath_01_clock (1380): CEZ2STREffect, new_dragonbreath\\new_dragonbreath_01_clock\\new_dragonbreath_01_clock.str
			type: 'STR',
			file: 'new_dragonbreath/new_dragonbreath_01_clock/new_dragonbreath_01_clock',
			texturePath: 'new_dragonbreath/new_dragonbreath_01_clock/',
			min: 'mineffect/new_dragonbreath/new_dragonbreath_fire_01/new_dragonbreath_fire_01',
			minTexturePath: 'mineffect/new_dragonbreath/new_dragonbreath_fire_01/',
			delayStart: 200,
			attachedEntity: true
		}
	],

	// dragonbreath toward 5 o'clock (1381).
	ef_rk_dragonbreath_05: [
		{
			//new_dragonbreath_05_clock (1381): CEZ2STREffect, new_dragonbreath\\new_dragonbreath_05_clock\\new_dragonbreath_05_clock.str
			type: 'STR',
			file: 'new_dragonbreath/new_dragonbreath_05_clock/new_dragonbreath_05_clock',
			texturePath: 'new_dragonbreath/new_dragonbreath_05_clock/',
			min: 'mineffect/new_dragonbreath/new_dragonbreath_fire_05/new_dragonbreath_fire_05',
			minTexturePath: 'mineffect/new_dragonbreath/new_dragonbreath_fire_05/',
			delayStart: 200,
			attachedEntity: true
		}
	],

	// dragonbreath toward 7 o'clock (1382).
	ef_rk_dragonbreath_07: [
		{
			//new_dragonbreath_07_clock (1382): CEZ2STREffect, new_dragonbreath\\new_dragonbreath_07_clock\\new_dragonbreath_07_clock.str
			type: 'STR',
			file: 'new_dragonbreath/new_dragonbreath_07_clock/new_dragonbreath_07_clock',
			texturePath: 'new_dragonbreath/new_dragonbreath_07_clock/',
			min: 'mineffect/new_dragonbreath/new_dragonbreath_fire_07/new_dragonbreath_fire_07',
			minTexturePath: 'mineffect/new_dragonbreath/new_dragonbreath_fire_07/',
			delayStart: 200,
			attachedEntity: true
		}
	],

	// dragonbreath toward 11 o'clock (1383).
	ef_rk_dragonbreath_11: [
		{
			//new_dragonbreath_11_clock (1383): CEZ2STREffect, new_dragonbreath\\new_dragonbreath_11_clock\\new_dragonbreath_11_clock.str
			type: 'STR',
			file: 'new_dragonbreath/new_dragonbreath_11_clock/new_dragonbreath_11_clock',
			texturePath: 'new_dragonbreath/new_dragonbreath_11_clock/',
			min: 'mineffect/new_dragonbreath/new_dragonbreath_fire_11/new_dragonbreath_fire_11',
			minTexturePath: 'mineffect/new_dragonbreath/new_dragonbreath_fire_11/',
			delayStart: 200,
			attachedEntity: true
		}
	],

	// Dragon Breath on each target as the damage packet arrives: 1378 and 1379 (floor), 350 ms in, and 폭염룡.wav.
	ef_rk_dragonbreath_bomb: [
		{
			//new_dragonbreath_bomb (1378): CEZ2STREffect, new_dragonbreath\\new_dragonbreath_bomb\\new_dragonbreath_bomb.str
			type: 'STR',
			file: 'new_dragonbreath/new_dragonbreath_bomb/new_dragonbreath_bomb',
			texturePath: 'new_dragonbreath/new_dragonbreath_bomb/',
			min: 'mineffect/new_dragonbreath/new_dragonbreath_fire_bomb/new_dragonbreath_fire_bomb',
			minTexturePath: 'mineffect/new_dragonbreath/new_dragonbreath_fire_bomb/',
			delayStart: 350,
			delayWav: 350,
			wav: 'effect/\xc6\xf8\xbf\xb0\xb7\xe6', // 폭염룡
			attachedEntity: true
		},
		{
			//new_dragonbreath_bomb_bottom (1379): CEZ2STREffect, new_dragonbreath\\new_dragonbreath_bomb_bottom\\new_dragonbreath_bomb_bottom.str
			type: 'STR',
			file: 'new_dragonbreath/new_dragonbreath_bomb_bottom/new_dragonbreath_bomb_bottom',
			texturePath: 'new_dragonbreath/new_dragonbreath_bomb_bottom/',
			minSkip: true,
			delayStart: 350,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Dragon Breath - Water (RK_DRAGONBREATH_WATER): as Dragon Breath, with 1388-1391 on the caster.
	ef_rk_dragonbreath_water_01: [
		{
			//new_dragonbreath_water_01_clock (1388): CEZ2STREffect, new_dragonbreath_water\\new_dragonbreath_water_01_clock\\new_dragonbreath_water_01_clock.str
			type: 'STR',
			file: 'new_dragonbreath_water/new_dragonbreath_water_01_clock/new_dragonbreath_water_01_clock',
			texturePath: 'new_dragonbreath_water/new_dragonbreath_water_01_clock/',
			min: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_01/new_dragonbreath_water_01',
			minTexturePath: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_01/',
			delayStart: 200,
			attachedEntity: true
		}
	],

	// dragonbreath_water toward 5 o'clock (1389).
	ef_rk_dragonbreath_water_05: [
		{
			//new_dragonbreath_water_05_clock (1389): CEZ2STREffect, new_dragonbreath_water\\new_dragonbreath_water_05_clock\\new_dragonbreath_water_05_clock.str
			type: 'STR',
			file: 'new_dragonbreath_water/new_dragonbreath_water_05_clock/new_dragonbreath_water_05_clock',
			texturePath: 'new_dragonbreath_water/new_dragonbreath_water_05_clock/',
			min: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_05/new_dragonbreath_water_05',
			minTexturePath: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_05/',
			delayStart: 200,
			attachedEntity: true
		}
	],

	// dragonbreath_water toward 7 o'clock (1390).
	ef_rk_dragonbreath_water_07: [
		{
			//new_dragonbreath_water_07_clock (1390): CEZ2STREffect, new_dragonbreath_water\\new_dragonbreath_water_07_clock\\new_dragonbreath_water_07_clock.str
			type: 'STR',
			file: 'new_dragonbreath_water/new_dragonbreath_water_07_clock/new_dragonbreath_water_07_clock',
			texturePath: 'new_dragonbreath_water/new_dragonbreath_water_07_clock/',
			min: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_07/new_dragonbreath_water_07',
			minTexturePath: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_07/',
			delayStart: 200,
			attachedEntity: true
		}
	],

	// dragonbreath_water toward 11 o'clock (1391).
	ef_rk_dragonbreath_water_11: [
		{
			//new_dragonbreath_water_11_clock (1391): CEZ2STREffect, new_dragonbreath_water\\new_dragonbreath_water_11_clock\\new_dragonbreath_water_11_clock.str
			type: 'STR',
			file: 'new_dragonbreath_water/new_dragonbreath_water_11_clock/new_dragonbreath_water_11_clock',
			texturePath: 'new_dragonbreath_water/new_dragonbreath_water_11_clock/',
			min: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_11/new_dragonbreath_water_11',
			minTexturePath: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_11/',
			delayStart: 200,
			attachedEntity: true
		}
	],

	// Dragon Breath - Water on each target: 1386 and 1387 (floor), 350 ms in, and 폭염룡.wav.
	ef_rk_dragonbreath_water_bomb: [
		{
			//new_dragonbreath_water_bomb (1386): CEZ2STREffect, new_dragonbreath_water\\new_dragonbreath_water_bomb\\new_dragonbreath_water_bomb.str
			type: 'STR',
			file: 'new_dragonbreath_water/new_dragonbreath_water_bomb/new_dragonbreath_water_bomb',
			texturePath: 'new_dragonbreath_water/new_dragonbreath_water_bomb/',
			min: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_bomb/new_dragonbreath_water_bomb',
			minTexturePath: 'mineffect/new_dragonbreath_water/new_dragonbreath_water_bomb/',
			delayStart: 350,
			delayWav: 350,
			wav: 'effect/\xc6\xf8\xbf\xb0\xb7\xe6', // 폭염룡
			attachedEntity: true
		},
		{
			//new_dragonbreath_water_bomb_bottom (1387): CEZ2STREffect, new_dragonbreath_water\\new_dragonbreath_water_bomb_bottom\\new_dragonbreath_water_bomb_bottom.str
			type: 'STR',
			file: 'new_dragonbreath_water/new_dragonbreath_water_bomb_bottom/new_dragonbreath_water_bomb_bottom',
			texturePath: 'new_dragonbreath_water/new_dragonbreath_water_bomb_bottom/',
			minSkip: true,
			delayStart: 350,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Dragon Breath and Dragon Breath - Water: dragon_breath.wav as the damage arrives.
	ef_rk_dragonbreath_sound: [
		{
			wav: 'dragon_breath', // dragon_breath
			attachedEntity: true
		}
	],

	// Millennium Shield (RK_MILLENNIUMSHIELD): the use-packet sound, on the caster. See effect-port/rune-knight-skills.md.
	ef_rk_millenniumshield_sound: [
		{
			wav: 'effect/ef_soulstrike', // effect/ef_soulstrike
			attachedEntity: true
		}
	],

	// Crush Strike (RK_CRUSHSTRIKE): the sound as its damage arrives, on the target. See effect-port/rune-knight-skills.md.
	ef_rk_crushstrike_sound: [
		{
			wav: '_enemy_hit_wind2', // _enemy_hit_wind2
			attachedEntity: true
		}
	],

	// Refresh (RK_REFRESH): the use-packet sound, on the caster. The client also launches 538 (EF_GREENBODY,
	// not in roBrowser). See effect-port/rune-knight-skills.md.
	ef_rk_refresh_sound: [
		{
			wav: '_heal_effect', // _heal_effect
			attachedEntity: true
		}
	],

	// Storm Blast (RK_STORMBLAST): the use-packet sound, on the target. See effect-port/rune-knight-skills.md.
	ef_rk_stormblast_sound: [
		{
			wav: 'effect/mon_\xb8\xcd\xb7\xe6\xb0\xfa\xb0\xad', // effect/mon_맹룡과강
			attachedEntity: true
		}
	],

	// Abundance (RK_ABUNDANCE): the use-packet sound, on the caster. The client also launches 538 (EF_GREENBODY,
	// not in roBrowser). See effect-port/rune-knight-skills.md.
	ef_rk_abundance_sound: [
		{
			wav: 'effect/\xc8\xed\xb1\xe2', // effect/흡기
			attachedEntity: true
		}
	]
};
