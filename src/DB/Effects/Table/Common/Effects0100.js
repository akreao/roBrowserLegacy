/**
 * @module DB/Effects/Table/Common/Effects0100
 *
 * Effects 0100 to 199 of the effect table that no single class's skills
 * use: shared rows, monsters, items, statuses. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import RainWeatherEffect from 'Renderer/Effects/RainWeather.js';
import SnowWeatherEffect from 'Renderer/Effects/SnowWeather.js';
import SakuraWeatherEffect from 'Renderer/Effects/SakuraWeatherEffect.js';
import Camera from 'Renderer/Camera.js';

export default {
	105: [
		{
			//EF_BLASTMINE	empty
			wav: 'effect/hun_anklesnare'
		}
	],

	109: [
		{
			//EF_BUBBLE	Bailaban Blue bubble Map Effect
			type: 'STR',
			file: 'bubble%d',
			rand: [1, 4],
			attachedEntity: false
		}
	],

	110: [
		{
			//EF_GASPUSH	Trap Used by Giearth
			type: 'STR',
			file: 'gaspush',
			//wav:  'se_gas_pushhh', // the anthell map already has the sounds placed, no need to add it to the effect as well
			attachedEntity: false
		}
	],

	131: [
		{
			//autocounter activate hit	//EF_AUTOCOUNTER	Auto-Counter Hit
			type: 'STR',
			file: 'autocounter',
			wav: 'effect/knight_autocounter',
			attachedEntity: true
		}
	],

	133: [
		{
			//EF_FREEZE	Ice Effect (Used by NPCs)
			type: 'STR',
			file: 'freeze',
			attachedEntity: true
		}
	],

	134: [
		{
			//EF_FREEZED	Ice Effect (Used by NPCs)
			type: 'STR',
			file: 'freezed',
			attachedEntity: true
		}
	],

	135: [
		{
			//EF_ICECRASH	Ice Effect (Used by NPCs)
			type: 'STR',
			file: 'icecrash',
			attachedEntity: true
		}
	],

	140: [
		{
			//EF_REVIVE	Ressurection Aura
			wav: 'effect/priest_resurrection',
			attachedEntity: true
		}
	],

	147: [
		{
			//EF_EARTHHIT	Pierce Hit
			type: 'STR',
			file: 'earthhit',
			attachedEntity: true
		}
	],

	152: [
		{
			//turn undead hit on targer	//EF_HOLYHIT	Turn Undead
			type: 'STR',
			file: 'holyhit',
			attachedEntity: true
		}
	],

	154: [
		{
			//EF_REFINEOK	Refine Success
			type: 'STR',
			file: 'bs_refinesuccess',
			wav: 'effect/bs_refinesuccess',
			attachedEntity: true
		}
	],

	155: [
		{
			//EF_REFINEFAIL	Refine Fail
			type: 'STR',
			file: 'bs_refinefailed',
			wav: 'effect/bs_refinefailed',
			attachedEntity: true
		}
	],

	//156: [{}],	//EF_JOBCHANGE	   jobchange.str not found error
	//157: [{}],	//EF_LVUP	   levelup.str not found error

	158: [
		{
			//EF_JOBLVUP	Job Level Up
			type: 'STR',
			file: 'joblvup',
			attachedEntity: true
		}
	],

	//159: [{}],	//EF_TOPRANK	   PvP circle
	//160: [{}],	//EF_PARTY	   PvP Party Circle
	161: [
		{
			//EF_RAIN	Rain weather
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				RainWeatherEffect.startOrRestart(Params);
			}
		}
	],
	162: [
		{
			//EF_SNOW	Snow weather
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				SnowWeatherEffect.startOrRestart(Params);
			}
		}
	],

	163: [
		{
			//EF_SAKURA	   White Sakura Leaves
			type: 'FUNC',
			attachedEntity: false,
			func: function (Params) {
				SakuraWeatherEffect.startOrRestart(Params);
			}
		}
	],

	//164: [{}],	//EF_STATUS_STATE	   (Nothing)

	165: [
		{
			//Comodo Fireworks Ball	//EF_BANJJAKII	Comodo Fireworks Ball
			type: 'SPR',
			file: '\xc5\xa9\xb8\xae\xbd\xba\xb8\xb6\xbd\xba',
			duration: 1000,
			attachedEntity: true
		}
	],

	//172: [{}],	//EF_CHANGEDARK	   Change Element (Dark)
	//173: [{}],	//EF_CHANGEFIRE	   Change Element (Fire)
	//174: [{}],	//EF_CHANGECOLD	   Change Element (Water)
	//175: [{}],	//EF_CHANGEWIND	   Change Element (Wind)
	//176: [{}],	//EF_CHANGEFLAME	   Change Element (Fire)
	//177: [{}],	//EF_CHANGEEARTH	   Change Element (Earth)
	//178: [{}],	//EF_CHAINGEHOLY	   Change Element (Holy)
	//179: [{}],	//EF_CHANGEPOISON	   Change Element (Poison)

	//180: [{}],	//EF_HITDARK	   Dark Elemental Hit

	181: [
		{
			//EF_MENTALBREAK	Mental Breaker
			type: 'STR',
			file: 'mentalbreak',
			attachedEntity: true
		}
	],

	182: [
		{
			//EF_MAGICALATTHIT	Magical Hit
			type: 'STR',
			file: 'magical',
			attachedEntity: true
		}
	],

	183: [
		{
			//EF_SUI_EXPLOSION	Self Destruction
			type: 'STR',
			file: 'sui_explosion',
			attachedEntity: true,
			wav: 'effect/ef_hit2'
		},
		{
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				const start = Params.Inst.startTick;
				const duration = 200;
				Camera.setQuake(start, duration);
			}
		}
	],

	//184: [{}],	//EF_DARKATTACK	   Dark Elemental Attack

	185: [
		{
			//EF_SUICIDE	(Nothing)
			type: 'STR',
			file: 'suicide',
			attachedEntity: true
		}
	],

	186: [
		{
			//EF_COMBOATTACK1	Combo Attack 1
			type: 'STR',
			file: 'yunta_1',
			attachedEntity: true
		}
	],

	187: [
		{
			//EF_COMBOATTACK2	Combo Attack 2
			type: 'STR',
			file: 'yunta_2',
			attachedEntity: true
		}
	],

	188: [
		{
			//EF_COMBOATTACK3	Combo Attack 3
			type: 'STR',
			file: 'yunta_3',
			attachedEntity: true
		}
	],

	189: [
		{
			//EF_COMBOATTACK4	Combo Attack 4
			type: 'STR',
			file: 'yunta_4',
			attachedEntity: true
		}
	],

	190: [
		{
			//EF_COMBOATTACK5	Combo Attack 5
			type: 'STR',
			file: 'yunta_5',
			attachedEntity: true
		}
	],

	191: [
		{
			//EF_GUIDEDATTACK	Guided Attack
			type: 'STR',
			file: 'homing',
			attachedEntity: true
		}
	],

	192: [
		{
			//EF_POISONATTACK	Poison Attack
			type: 'STR',
			file: 'poison',
			attachedEntity: true
		}
	],

	193: [
		{
			//EF_SILENCEATTACK	Silence Attack
			type: 'STR',
			file: 'silence',
			attachedEntity: true
		}
	],

	194: [
		{
			//EF_STUNATTACK	Stun Attack
			type: 'STR',
			file: 'stun',
			attachedEntity: true
		}
	],

	195: [
		{
			//EF_PETRIFYATTACK	Petrify Attack
			type: 'STR',
			file: 'stonecurse',
			attachedEntity: true
		}
	],

	//196: [{}],	//EF_CURSEATTACK	   Curse Attack

	197: [
		{
			//EF_SLEEPATTACK	Sleep Attack
			type: 'STR',
			file: 'sleep',
			attachedEntity: true
		}
	],

	//198: [{}],	//EF_TELEKHIT	   (Nothing)

	199: [
		{
			//EF_PONG	Small Popping Bubble Map Effect
			type: 'STR',
			file: 'pong%d',
			rand: [1, 3],
			attachedEntity: false
		}
	]
};
