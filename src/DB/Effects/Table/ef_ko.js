/**
 * @module DB/Effects/Table/ef_ko
 *
 * The effect table's named ef_ko_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

import RotateLine from 'Renderer/Effects/RotateLine.js';

export default {
	// Cross Slash (KO_JYUMONJIKIRI): official effect 996, launched on the target as each damage packet
	// arrives (skilleffectinfo targetEffectID). See effect-port/kagerou-oboro-skills.md.
	ef_ko_jyumonjikiri: [
		{
			//EF_KO_JYUMONJIKIRI (996)
			type: 'STR',
			file: 'jyumonjikiri',
			texturePath: '',
			attachedEntity: true
		}
	],

	// Cross Slash (KO_JYUMONJIKIRI): the skilleffectinfo row's sound, on the caster when the use packet
	// has the result set.
	ef_ko_jyumonjikiri_sound: [
		{
			wav: 'effect/cru_holy cross',
			attachedEntity: true
		}
	],

	// KO_JYUMONJIKIRI status (the Cross Slash mark): the official client keeps 998 (red_cross.str, which
	// plays until removed) on the actor while the status is on.
	ef_ko_red_cross: [
		{
			//EF_RED_CROSS (998)
			type: 'STR',
			file: 'red_cross',
			texturePath: '',
			repeat: true,
			attachedEntity: true
		}
	],

	// Soul Cutter (KO_SETSUDAN): the skilleffectinfo row plays T_전기.wav and launches 997 on the target
	// as each damage packet arrives. See effect-port/kagerou-oboro-skills.md.
	ef_ko_setsudan: [
		{
			//EF_KO_SETSUDAN (997)
			type: 'STR',
			file: 'setsudan',
			texturePath: '',
			wav: 'effect/t_\xc0\xfc\xb1\xe2', // t_전기
			attachedEntity: true
		}
	],

	// Kunai Explosion (KO_BAKURETSU): the skilleffectinfo row's sound, on the caster when the use packet
	// has the result set. The client also throws a kunai (983, CThrowItemEffect) at the target; not ported.
	// Rapid Throw (KO_MUCHANAGE) plays the same sound from its ground packet, Release Ninja Spell
	// (KO_KAIHOU) from its use packet. See effect-port/kagerou-oboro-skills.md.
	ef_ko_bakuretsu_sound: [
		{
			wav: 'effect/\xb4\xd1\xc0\xda_\xb4\xf8\xc1\xf6\xb1\xe2', // 닌자_던지기
			attachedEntity: true
		}
	],

	// Kunai Explosion (KO_BAKURETSU): the skilleffectinfo row plays 폭염룡.wav and launches 990 on the
	// target as each damage packet arrives. 990 is a CSpriteEffect: m_ef03 at 1.5 times its size, read as
	// 4 ticks a frame.
	ef_ko_ground_explosion: [
		{
			//EF_GROUND_EXPLOSION (990)
			type: 'SPR',
			file: 'm_ef03',
			scale: 1.5,
			delayFrame: 67, // 4 ticks
			// the client's sprite effects are separate objects: a second packet on the same actor
			// starts its own burst
			stackable: true,
			wav: 'effect/\xc6\xf8\xbf\xb0\xb7\xe6', // 폭염룡
			attachedEntity: true
		}
	],

	// Kunai Splash (KO_HAPPOKUNAI): when the use packet has the result set, the skilleffectinfo row plays
	// T_회오리차기.wav and launches 981 (eight kunai around the caster, CThrowItemEffect; not ported) and
	// 986 (the gray rotate-line ribbons) on the caster. Launched this way the ribbons have faded out by
	// about tick 113, so they are drawn for 120 ticks. See effect-port/kagerou-oboro-skills.md.
	ef_ko_happokunai: [
		{
			wav: 'effect/t_\xc8\xb8\xbf\xc0\xb8\xae\xc2\xf7\xb1\xe2', // t_회오리차기
			attachedEntity: true
		},
		{
			//EF_ROTATE_LINE_GRAY (986)
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				// RotateLine takes a cast time in ms and draws castTime / 16 ticks
				this.add(
					new RotateLine(Params.Init.ownerEntity.position, Params.Inst.startTick, 120 * 16, 986),
					Params
				);
			}
		}
	],

	// Swirling Petal (KO_HUUMARANKA): the skilleffectinfo row plays T_회오리차기.wav and launches 984 (the
	// spinning huuma, CRotateItemEffect), 1000 (the blue rotate-line ribbons) and 1002 (CScatterEffect) at
	// the ground packet's cell, with no owner. 984 and 1002 are not ported. The ribbons fade out by about
	// tick 113 and are drawn for 120 ticks. See effect-port/kagerou-oboro-skills.md.
	ef_ko_huumaranka: [
		{
			wav: 'effect/t_\xc8\xb8\xbf\xc0\xb8\xae\xc2\xf7\xb1\xe2', // t_회오리차기
			attachedEntity: false
		},
		{
			//EF_ROTATE_LINE_BLUE (1000)
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				// RotateLine takes a cast time in ms and draws castTime / 16 ticks
				this.add(new RotateLine(Params.Inst.position, Params.Inst.startTick, 120 * 16, 1000), Params);
			}
		}
	],

	// Release Ninja Spell (KO_KAIHOU): the skilleffectinfo row launches 1008 (술식해방.str) on the target
	// as each damage packet arrives. (Its use packet throws a charm orb, 989, at the target; not ported.)
	// See effect-port/kagerou-oboro-skills.md.
	ef_ko_kaihou: [
		{
			//EF_KAIHOU1 (1008)
			type: 'STR',
			file: '\xbc\xfa\xbd\xc4\xc7\xd8\xb9\xe6', // 술식해방
			texturePath: '',
			attachedEntity: true
		}
	],

	// 16th Night (KO_IZAYOI): when the use packet has the result set, the skilleffectinfo row plays
	// ab_renovatio.wav and launches 999 (ez_cure.str) on the caster. See effect-port/kagerou-oboro-skills.md.
	ef_ko_izayoi: [
		{
			//EF_KO_IZAYOI (999)
			type: 'STR',
			file: 'ez_cure',
			texturePath: '',
			wav: 'effect/ab_renovatio',
			attachedEntity: true
		}
	]
};
