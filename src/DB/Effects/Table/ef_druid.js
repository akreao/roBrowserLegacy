/**
 * @module DB/Effects/Table/ef_druid
 *
 * The effect table's named ef_druid_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

import CastCircle from 'Renderer/Effects/CastCircle.js';
import StreakLines from 'Renderer/Effects/StreakLines.js';

export default {
	// Druid / Karnos / Alitea skill effects (kRO data/texture/effect/druid/)
	ef_druid_werewolf: [
		{
			type: 'STR',
			file: 'druid/dr_werewolf/werewolf/werewolf',
			texturePath: 'druid/dr_werewolf/werewolf/',
			min: 'druid/dr_werewolf/werewolf/min_werewolf',
			wav: 'effect/druid/dr_werewolf',
			yOffset: 10
		}
	],
	ef_druid_wereraptor: [
		{
			type: 'STR',
			file: 'druid/dr_wereraptor/wereraptor/wereraptor',
			texturePath: 'druid/dr_wereraptor/wereraptor/',
			min: 'druid/dr_wereraptor/wereraptor/min_wereraptor',
			wav: 'effect/druid/dr_wereraptor',
			yOffset: 10
		}
	],
	ef_druid_enrage_wolf: [
		{
			type: 'STR',
			file: 'druid/dr_enrage_wolf/enrage_wolf/enrage_wolf',
			texturePath: 'druid/dr_enrage_wolf/enrage_wolf/',
			min: 'druid/dr_enrage_wolf/enrage_wolf/min_enrage_wolf',
			wav: 'effect/druid/dr_enrage_wolf',
			yOffset: 10
		}
	],
	ef_druid_enrage_raptor: [
		{
			type: 'STR',
			file: 'druid/dr_enrage_raptor/enrage_raptor/enrage_raptor',
			texturePath: 'druid/dr_enrage_raptor/enrage_raptor/',
			min: 'druid/dr_enrage_raptor/enrage_raptor/min_enrage_raptor',
			wav: 'effect/druid/dr_enrage_raptor',
			yOffset: 13
		}
	],
	ef_druid_blood_howling: [
		{
			type: 'STR',
			file: 'druid/dr_blood_howling/blood_howling/blood_howling',
			texturePath: 'druid/dr_blood_howling/blood_howling/',
			min: 'druid/dr_blood_howling/blood_howling/min_blood_howling',
			wav: 'effect/druid/dr_blood_howling',
			yOffset: 12
		}
	],
	ef_druid_preening: [
		{
			type: 'STR',
			file: 'druid/dr_preening/preening/preening',
			texturePath: 'druid/dr_preening/preening/',
			min: 'druid/dr_preening/preening/min_preening',
			wav: 'effect/druid/dr_preening',
			yOffset: 15
		}
	],
	ef_druid_truth_of_ice: [
		{
			type: 'STR',
			file: 'druid/dr_truth_of_ice/truth_of_ice/truth_of_ice',
			texturePath: 'druid/dr_truth_of_ice/truth_of_ice/',
			min: 'druid/dr_truth_of_ice/truth_of_ice/min_truth_of_ice',
			wav: 'effect/druid/dr_truth_of_ice',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/dr_truth_of_ice/truth_of_ice_bottom/truth_of_ice_bottom',
			texturePath: 'druid/dr_truth_of_ice/truth_of_ice_bottom/',
			min: 'druid/dr_truth_of_ice/truth_of_ice_bottom/min_truth_of_ice_bottom',
			renderBeforeEntities: true,
			yOffset: 12
		}
	],
	ef_druid_truth_of_wind: [
		{
			type: 'STR',
			file: 'druid/dr_truth_of_wind/truth_of_wind/truth_of_wind',
			texturePath: 'druid/dr_truth_of_wind/truth_of_wind/',
			min: 'druid/dr_truth_of_wind/truth_of_wind/min_truth_of_wind',
			wav: 'effect/druid/dr_truth_of_wind',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/dr_truth_of_wind/truth_of_wind_bottom/truth_of_wind_bottom',
			texturePath: 'druid/dr_truth_of_wind/truth_of_wind_bottom/',
			min: 'druid/dr_truth_of_wind/truth_of_wind_bottom/min_truth_of_wind_bottom',
			renderBeforeEntities: true,
			yOffset: 12
		}
	],
	ef_druid_truth_of_earth: [
		{
			type: 'STR',
			file: 'druid/dr_truth_of_earth/truth_of_earth/truth_of_earth',
			texturePath: 'druid/dr_truth_of_earth/truth_of_earth/',
			min: 'druid/dr_truth_of_earth/truth_of_earth/min_truth_of_earth',
			wav: 'effect/druid/dr_truth_of_earth',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/dr_truth_of_earth/truth_of_earth_bottom/truth_of_earth_bottom',
			texturePath: 'druid/dr_truth_of_earth/truth_of_earth_bottom/',
			min: 'druid/dr_truth_of_earth/truth_of_earth_bottom/min_truth_of_earth_bottom',
			renderBeforeEntities: true,
			yOffset: 12
		}
	],
	ef_druid_nature_shield: [
		{
			type: 'STR',
			file: 'druid/dr_nature_shield/nature_shield/nature_shield',
			texturePath: 'druid/dr_nature_shield/nature_shield/',
			min: 'druid/dr_nature_shield/nature_shield/min_nature_shield',
			wav: 'effect/druid/dr_nature_shield',
			yOffset: 10
		}
	],
	ef_druid_nature_protection: [
		{
			type: 'STR',
			file: 'druid/dr_nature_protection/nature_protection/nature_protection',
			texturePath: 'druid/dr_nature_protection/nature_protection/',
			yOffset: 12
		}
	],
	ef_druid_hit_wolf: [
		{
			type: 'STR',
			file: 'druid/dr_hit/dr_hit_werewolf/dr_hit_werewolf',
			texturePath: 'druid/dr_hit/dr_hit_werewolf/',
			min: 'druid/dr_hit/dr_hit_werewolf/min_dr_hit_werewolf',
			yOffset: 5
		}
	],
	ef_druid_hit_raptor: [
		{
			type: 'STR',
			file: 'druid/dr_hit/dr_hit_wereraptor/dr_hit_wereraptor',
			texturePath: 'druid/dr_hit/dr_hit_wereraptor/',
			min: 'druid/dr_hit/dr_hit_wereraptor/min_dr_hit_wereraptor',
			yOffset: 5
		}
	],
	// Wereraptor attack hits (EZ2 attack_00 / _01 on the hit target, turned and
	// mirrored by DruidWindSim.raptorHit; attack_02 sprayed by gustSpray)
	ef_druid_raptor_attack_00: [
		{
			type: 'STR',
			file: 'druid/wereraptor_attack/attack_00/attack_00',
			texturePath: 'druid/wereraptor_attack/attack_00/',
			min: 'druid/wereraptor_attack/attack_00/min_attack_00',
			attachedEntity: true,
			yOffset: 2
		}
	],
	ef_druid_raptor_attack_01: [
		{
			type: 'STR',
			file: 'druid/wereraptor_attack/attack_01/attack_01',
			texturePath: 'druid/wereraptor_attack/attack_01/',
			min: 'druid/wereraptor_attack/attack_01/min_attack_01',
			attachedEntity: true,
			yOffset: 5
		}
	],
	ef_druid_raptor_attack_02: [
		{
			type: 'STR',
			file: 'druid/wereraptor_attack/attack_02/attack_02',
			texturePath: 'druid/wereraptor_attack/attack_02/',
			min: 'druid/wereraptor_attack/attack_02/min_attack_02',
			yOffset: 10
		}
	],
	ef_druid_ice_hit: [
		{
			type: 'STR',
			file: 'druid/dr_ice_hit/ice_hit/ice_hit',
			texturePath: 'druid/dr_ice_hit/ice_hit/',
			min: 'druid/dr_ice_hit/ice_hit/min_ice_hit',
			yOffset: 5
		}
	],
	ef_druid_ice_cast: [
		{
			type: 'STR',
			file: 'druid/ice_cast/ice_cast/ice_cast',
			texturePath: 'druid/ice_cast/ice_cast/',
			min: 'druid/ice_cast/ice_cast/min_ice_cast',
			wav: 'effect/druid/ice_cast',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/ice_cast/ice_cast_bottom/ice_cast_bottom',
			texturePath: 'druid/ice_cast/ice_cast_bottom/',
			min: 'druid/ice_cast/ice_cast_bottom/min_ice_cast_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_thunder_cast: [
		{
			type: 'STR',
			file: 'druid/thundering_cast/thundering_cast/thundering_cast',
			texturePath: 'druid/thundering_cast/thundering_cast/',
			min: 'druid/thundering_cast/thundering_cast/min_thundering_cast',
			wav: 'effect/druid/thundering_cast',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_thunder_hit_g: [
		{
			type: 'STR',
			file: 'druid/thundering_attack/thundering_attack_g/thundering_attack_g',
			texturePath: 'druid/thundering_attack/thundering_attack_g/',
			min: 'druid/thundering_attack/thundering_attack_g/min_thundering_attack_g',
			yOffset: 3
		}
	],
	ef_druid_thunder_hit_y: [
		{
			type: 'STR',
			file: 'druid/thundering_attack/thundering_attack_y/thundering_attack_y',
			texturePath: 'druid/thundering_attack/thundering_attack_y/',
			min: 'druid/thundering_attack/thundering_attack_y/min_thundering_attack_y',
			yOffset: 3
		}
	],
	ef_druid_nomercy_claw: [
		{
			type: 'STR',
			file: 'druid/dr_nomercy_claw/nomercy_claw/nomercy_claw',
			texturePath: 'druid/dr_nomercy_claw/nomercy_claw/',
			min: 'druid/dr_nomercy_claw/nomercy_claw/min_nomercy_claw',
			wav: 'effect/druid/dr_nomercy_claw',
			yOffset: 10
		}
	],
	ef_druid_cruel_bite: [
		{
			type: 'STR',
			file: 'druid/dr_cruel_bite/cruel_bite/cruel_bite',
			texturePath: 'druid/dr_cruel_bite/cruel_bite/',
			min: 'druid/dr_cruel_bite/cruel_bite/min_cruel_bite',
			wav: 'effect/druid/dr_cruel_bite',
			yOffset: 10
		}
	],
	ef_druid_hunger: [
		{
			type: 'STR',
			file: 'druid/dr_hunger/hunger/hunger',
			texturePath: 'druid/dr_hunger/hunger/',
			min: 'druid/dr_hunger/hunger/min_hunger',
			wav: 'effect/druid/dr_hunger',
			yOffset: 13.2
		}
	],
	ef_druid_hunger_target: [
		{
			type: 'STR',
			file: 'druid/dr_hunger/hunger_target/hunger_target',
			texturePath: 'druid/dr_hunger/hunger_target/',
			min: 'druid/dr_hunger/hunger_target/min_hunger_target',
			yOffset: 7
		}
	],
	ef_druid_shooting_feather: [
		{
			type: 'STR',
			file: 'druid/dr_shooting_feather/shooting_feather/shooting_feather',
			texturePath: 'druid/dr_shooting_feather/shooting_feather/',
			min: 'druid/dr_shooting_feather/shooting_feather/min_shooting_feather',
			wav: 'effect/druid/dr_shooting_feather',
			// Points right in the file: turned once toward the target (successEffectIdOnCasterAimed)
			yOffset: 10
		}
	],
	ef_druid_shooting_feather_hit: [
		{
			type: 'STR',
			file: 'druid/dr_shooting_feather/shooting_feather_attack/shooting_feather_attack',
			texturePath: 'druid/dr_shooting_feather/shooting_feather_attack/',
			min: 'druid/dr_shooting_feather/shooting_feather_attack/min_shooting_feather_attack',
			// The feathers land from the left, the caster's side, in the file
			rotateToTarget: true,
			facing: 180,
			yOffset: 0
		}
	],
	ef_druid_flicking_tonado: [
		{
			type: 'STR',
			file: 'druid/dr_flicking_tonado/flicking_tonado/flicking_tonado',
			texturePath: 'druid/dr_flicking_tonado/flicking_tonado/',
			min: 'druid/dr_flicking_tonado/flicking_tonado/min_flicking_tonado',
			wav: 'effect/druid/dr_flicking_tonado',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/dr_flicking_tonado/flicking_tonado_bottom/flicking_tonado_bottom',
			texturePath: 'druid/dr_flicking_tonado/flicking_tonado_bottom/',
			min: 'druid/dr_flicking_tonado/flicking_tonado_bottom/min_flicking_tonado_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_low_flight: [
		{
			type: 'STR',
			file: 'druid/dr_low_flight/low_flight_horizon/low_flight_horizon',
			texturePath: 'druid/dr_low_flight/low_flight_horizon/',
			min: 'druid/dr_low_flight/low_flight_horizon/min_low_flight_horizon',
			wav: 'effect/druid/dr_low_flight',
			// Sideways art, for a target left or right of the caster (DruidWindSim.lowFlight)
			attachedEntity: true,
			yOffset: 8
		}
	],
	ef_druid_low_flight_bottom: [
		{
			type: 'STR',
			file: 'druid/dr_low_flight/low_flight_bottom/low_flight_bottom',
			texturePath: 'druid/dr_low_flight/low_flight_bottom/',
			min: 'druid/dr_low_flight/low_flight_bottom/min_low_flight_bottom',
			renderBeforeEntities: true,
			attachedEntity: true,
			yOffset: 10
		}
	],
	ef_druid_low_flight_up: [
		{
			type: 'STR',
			file: 'druid/dr_low_flight/low_flight_vertical/low_flight_vertical',
			texturePath: 'druid/dr_low_flight/low_flight_vertical/',
			min: 'druid/dr_low_flight/low_flight_vertical/min_low_flight_vertical',
			// Up-down art, for a target below or above the caster (DruidWindSim.lowFlight)
			attachedEntity: true,
			yOffset: 0
		}
	],
	ef_druid_ice_totem: [
		{
			type: 'STR',
			file: 'druid/dr_ice_totem/ice_totem/ice_totem',
			texturePath: 'druid/dr_ice_totem/ice_totem/',
			min: 'druid/dr_ice_totem/ice_totem/min_ice_totem',
			wav: 'effect/druid/dr_ice_totem',
			yOffset: 10
		}
	],
	ef_druid_ice_cloud: [
		{
			type: 'STR',
			file: 'druid/dr_ice_cloud/ice_cloud/ice_cloud',
			texturePath: 'druid/dr_ice_cloud/ice_cloud/',
			min: 'druid/dr_ice_cloud/ice_cloud/min_ice_cloud',
			wav: 'effect/druid/dr_ice_cloud',
			yOffset: 10
		}
	],
	ef_druid_cutting_wind: [
		{
			type: 'STR',
			file: 'druid/dr_cutting_wind/cutting_wind/cutting_wind',
			texturePath: 'druid/dr_cutting_wind/cutting_wind/',
			min: 'druid/dr_cutting_wind/cutting_wind/min_cutting_wind',
			wav: 'effect/druid/dr_cutting_wind',
			// The blade flies left in the file: the client turns it by the angle from
			// the target to the caster, half a circle past the caster's aim
			turnOffset: 180,
			yOffset: 5
		}
	],
	ef_druid_cutting_wind_hit: [
		{
			type: 'STR',
			file: 'druid/dr_cutting_wind/cutting_wind_hit/cutting_wind_hit',
			texturePath: 'druid/dr_cutting_wind/cutting_wind_hit/',
			min: 'druid/dr_cutting_wind/cutting_wind_hit/min_cutting_wind_hit',
			yOffset: 5
		}
	],
	ef_druid_wind_bomb: [
		{
			type: 'STR',
			file: 'druid/dr_wind_bomb/wind_bomb_main/wind_bomb_main',
			texturePath: 'druid/dr_wind_bomb/wind_bomb_main/',
			min: 'druid/dr_wind_bomb/wind_bomb_main/min_wind_bomb_main',
			wav: 'effect/druid/dr_wind_bomb',
			// The client starts it 300 ms after the use (as 300 / 16 + 1 ticks)
			delayStart: 304,
			delayWav: 304,
			attachedEntity: true,
			yOffset: 5
		}
	],
	ef_druid_wind_bomb_throw: [
		{
			type: 'STR',
			file: 'druid/dr_wind_bomb/wind_bomb_tornado/wind_bomb_tornado',
			texturePath: 'druid/dr_wind_bomb/wind_bomb_tornado/',
			min: 'druid/dr_wind_bomb/wind_bomb_tornado/min_wind_bomb_tornado',
			// Thrown from the caster onto the target like Thundering Orb's orb (CWindBomb)
			xOffset: 0,
			yOffset: 0,
			arcThrow: true
		}
	],
	ef_druid_wind_bomb_hit: [
		{
			type: 'STR',
			file: 'druid/dr_wind_bomb/wind_bomb_hit/wind_bomb_hit',
			texturePath: 'druid/dr_wind_bomb/wind_bomb_hit/',
			min: 'druid/dr_wind_bomb/wind_bomb_hit/min_wind_bomb_hit',
			yOffset: 5
		}
	],
	ef_druid_earth_flower: [
		{
			type: 'STR',
			file: 'druid/dr_earth_flower/earth_flower/earth_flower',
			texturePath: 'druid/dr_earth_flower/earth_flower/',
			min: 'druid/dr_earth_flower/earth_flower/min_earth_flower',
			wav: 'effect/druid/dr_earth_flower',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/dr_earth_flower/earth_flower_bottom/earth_flower_bottom',
			texturePath: 'druid/dr_earth_flower/earth_flower_bottom/',
			min: 'druid/dr_earth_flower/earth_flower_bottom/min_earth_flower_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_around_flower: [
		{
			type: 'STR',
			file: 'druid/dr_around_flower/around_flower/around_flower',
			texturePath: 'druid/dr_around_flower/around_flower/',
			min: 'druid/dr_around_flower/around_flower/min_around_flower',
			wav: 'effect/druid/dr_around_flower',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/dr_around_flower/around_flower_bottom/around_flower_bottom',
			texturePath: 'druid/dr_around_flower/around_flower_bottom/',
			min: 'druid/dr_around_flower/around_flower_bottom/min_around_flower_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_nasty_slash: [
		{
			type: 'STR',
			file: 'druid/kr_nasty_slash/nasty_slash/nasty_slash',
			texturePath: 'druid/kr_nasty_slash/nasty_slash/',
			min: 'druid/kr_nasty_slash/nasty_slash/min_nasty_slash',
			wav: 'effect/druid/kr_nasty_slash',
			yOffset: 3
		}
	],
	ef_druid_double_slash: [
		{
			type: 'STR',
			file: 'druid/kr_double_slash/double_slash/double_slash',
			texturePath: 'druid/kr_double_slash/double_slash/',
			min: 'druid/kr_double_slash/double_slash/min_double_slash',
			wav: 'effect/druid/kr_double_slash',
			yOffset: 10
		}
	],
	ef_druid_claw_wave: [
		{
			type: 'STR',
			file: 'druid/kr_claw_wave/claw_wave/claw_wave',
			texturePath: 'druid/kr_claw_wave/claw_wave/',
			min: 'druid/kr_claw_wave/claw_wave/min_claw_wave',
			wav: 'effect/druid/kr_claw_wave',
			yOffset: 10
		}
	],
	ef_druid_chop_chop: [
		{
			type: 'STR',
			file: 'druid/kr_chop_chop/chop_chop/chop_chop',
			texturePath: 'druid/kr_chop_chop/chop_chop/',
			min: 'druid/kr_chop_chop/chop_chop/min_chop_chop',
			wav: 'effect/druid/kr_chop_chop',
			yOffset: 7
		}
	],
	ef_druid_chop_chop_hit: [
		{
			type: 'STR',
			file: 'druid/kr_chop_chop/chop_chop_sub/chop_chop_sub',
			texturePath: 'druid/kr_chop_chop/chop_chop_sub/',
			min: 'druid/kr_chop_chop/chop_chop_sub/min_chop_chop_sub',
			wav: 'effect/DRUID/KR_CHOP_CHOP',
			soundLoop: false,
			yOffset: 7
		}
	],
	ef_druid_iron_howling: [
		{
			type: 'STR',
			file: 'druid/kr_iron_howling/iron_howling/iron_howling',
			texturePath: 'druid/kr_iron_howling/iron_howling/',
			min: 'druid/kr_iron_howling/iron_howling/min_iron_howling',
			wav: 'effect/druid/kr_iron_howling',
			yOffset: 12
		}
	],
	ef_druid_sharpen_gust: [
		{
			type: 'STR',
			file: 'druid/kr_sharpen_gust/sharpen_gust/sharpen_gust',
			texturePath: 'druid/kr_sharpen_gust/sharpen_gust/',
			min: 'druid/kr_sharpen_gust/sharpen_gust/min_sharpen_gust',
			wav: 'effect/druid/kr_sharpen_gust',
			// Points right in the file: turned once toward the target, then tilted
			// back 30 degrees about the screen's x axis, as the client does
			tilt: 30,
			yOffset: 5
		},
		{
			type: 'STR',
			file: 'druid/kr_sharpen_gust/sharpen_gust_bottom/sharpen_gust_bottom',
			texturePath: 'druid/kr_sharpen_gust/sharpen_gust_bottom/',
			min: 'druid/kr_sharpen_gust/sharpen_gust_bottom/min_sharpen_gust_bottom',
			renderBeforeEntities: true,
			tilt: 30,
			yOffset: 2
		}
	],
	ef_druid_sharpen_hail: [
		{
			type: 'STR',
			file: 'druid/kr_sharpen_hail/sharpen_hail/sharpen_hail',
			texturePath: 'druid/kr_sharpen_hail/sharpen_hail/',
			min: 'druid/kr_sharpen_hail/sharpen_hail/min_sharpen_hail',
			wav: 'effect/druid/kr_sharpen_hail',
			yOffset: 15
		},
		{
			type: 'STR',
			file: 'druid/kr_sharpen_hail/sharpen_hail_bottom/sharpen_hail_bottom',
			texturePath: 'druid/kr_sharpen_hail/sharpen_hail_bottom/',
			min: 'druid/kr_sharpen_hail/sharpen_hail_bottom/min_sharpen_hail_bottom',
			renderBeforeEntities: true,
			yOffset: 15
		}
	],
	ef_druid_sharpen_hail_shot: [
		{
			type: 'STR',
			file: 'druid/kr_sharpen_hail/sharpen_hail_shot/sharpen_hail_shot',
			texturePath: 'druid/kr_sharpen_hail/sharpen_hail_shot/',
			min: 'druid/kr_sharpen_hail/sharpen_hail_shot/min_sharpen_hail_shot',
			wav: 'effect/DRUID/KR_SHARPEN_HAIL',
			soundLoop: false,
			yOffset: 15
		},
		{
			type: 'STR',
			file: 'druid/kr_sharpen_hail/sharpen_hail_shot_bottom/sharpen_hail_shot_bottom',
			texturePath: 'druid/kr_sharpen_hail/sharpen_hail_shot_bottom/',
			min: 'druid/kr_sharpen_hail/sharpen_hail_shot_bottom/min_sharpen_hail_shot_bottom',
			renderBeforeEntities: true,
			yOffset: 15
		}
	],
	// Typhoon Wing: the official client plays one size at the cell, by level (SkillEffect groundEffectIdByLevel)
	ef_druid_typhoon_wing_5x5: [
		{
			type: 'STR',
			file: 'druid/kr_typhoon_wing/typhoon_wing_5x5/typhoon_wing_5x5',
			texturePath: 'druid/kr_typhoon_wing/typhoon_wing_5x5/',
			min: 'druid/kr_typhoon_wing/typhoon_wing_5x5/min_typhoon_wing_5x5',
			wav: 'effect/druid/kr_typhoon_wing',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/kr_typhoon_wing/typhoon_wing_5x5_bottom/typhoon_wing_5x5_bottom',
			texturePath: 'druid/kr_typhoon_wing/typhoon_wing_5x5_bottom/',
			min: 'druid/kr_typhoon_wing/typhoon_wing_5x5_bottom/min_typhoon_wing_5x5_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_typhoon_wing_7x7: [
		{
			type: 'STR',
			file: 'druid/kr_typhoon_wing/typhoon_wing_7x7/typhoon_wing_7x7',
			texturePath: 'druid/kr_typhoon_wing/typhoon_wing_7x7/',
			min: 'druid/kr_typhoon_wing/typhoon_wing_7x7/min_typhoon_wing_7x7',
			wav: 'effect/druid/kr_typhoon_wing',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/kr_typhoon_wing/typhoon_wing_7x7_bottom/typhoon_wing_7x7_bottom',
			texturePath: 'druid/kr_typhoon_wing/typhoon_wing_7x7_bottom/',
			min: 'druid/kr_typhoon_wing/typhoon_wing_7x7_bottom/min_typhoon_wing_7x7_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	// Druid cast circles: the official client gives skills 6525-6606 no element
	// aura; their cast slot plays one of its cast circles for the cast time instead
	// (effect-port/druid-cast-aura.md). Effect 56: untinted, magic_green.tga
	ef_druid_cast_circle_green: [
		{
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCircle(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'magic_green.tga'
					),
					Params
				);
			}
		}
	],
	// Effect 54: tinted circle, ring_blue.tga, mode 2 (bluish, normal blending)
	ef_druid_cast_circle_blue: [
		{
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCircle(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_blue.tga',
						2
					),
					Params
				);
			}
		}
	],
	// Effect 57: tinted circle, ring_yellow.tga, mode 0 (white, normal blending)
	ef_druid_cast_circle_yellow: [
		{
			type: 'FUNC',
			attachedEntity: true,
			castLoop: true,
			wav: 'effect/ef_beginspell',
			func: function (Params) {
				this.add(
					new CastCircle(
						Params.Init.ownerEntity.position,
						Params.Inst.startTick,
						Params.Init.duration,
						'ring_yellow.tga',
						0
					),
					Params
				);
			}
		}
	],
	ef_druid_feather_sprinkle: [
		{
			type: 'STR',
			file: 'druid/kr_feather_sprinkle/feather_sprinkle/feather_sprinkle',
			texturePath: 'druid/kr_feather_sprinkle/feather_sprinkle/',
			min: 'druid/kr_feather_sprinkle/feather_sprinkle/min_feather_sprinkle',
			wav: 'effect/druid/kr_feather_sprinkle',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/kr_feather_sprinkle/feather_sprinkle_bottom/feather_sprinkle_bottom',
			texturePath: 'druid/kr_feather_sprinkle/feather_sprinkle_bottom/',
			min: 'druid/kr_feather_sprinkle/feather_sprinkle_bottom/min_feather_sprinkle_bottom',
			yOffset: 10
		}
	],
	ef_druid_wind_veil: [
		{
			type: 'STR',
			file: 'druid/kr_wind_veil/wild_veil/wild_veil',
			texturePath: 'druid/kr_wind_veil/wild_veil/',
			min: 'druid/kr_wind_veil/wild_veil/min_wild_veil',
			wav: 'effect/druid/kr_wind_veil',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/kr_wind_veil/wild_veil_bottom/wild_veil_bottom',
			texturePath: 'druid/kr_wind_veil/wild_veil_bottom/',
			min: 'druid/kr_wind_veil/wild_veil_bottom/min_wild_veil_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_ice_pillar_start: [
		{
			type: 'STR',
			file: 'druid/kr_ice_pillar/ice_pillar_start/ice_pillar_start',
			texturePath: 'druid/kr_ice_pillar/ice_pillar_start/',
			min: 'druid/kr_ice_pillar/ice_pillar_start/min_ice_pillar_start',
			wav: 'effect/druid/kr_ice_pillar_start',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/kr_ice_pillar/ice_pillar_start_bottom/ice_pillar_start_bottom',
			texturePath: 'druid/kr_ice_pillar/ice_pillar_start_bottom/',
			min: 'druid/kr_ice_pillar/ice_pillar_start_bottom/min_ice_pillar_start_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_ice_pillar_loop: [
		{
			type: 'STR',
			file: 'druid/kr_ice_pillar/ice_pillar_loop/ice_pillar_loop',
			texturePath: 'druid/kr_ice_pillar/ice_pillar_loop/',
			min: 'druid/kr_ice_pillar/ice_pillar_loop/min_ice_pillar_loop',
			wav: 'effect/DRUID/KR_ICE_PILLAR_LOOP',
			soundLoop: false,
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/kr_ice_pillar/ice_pillar_loop_bottom/ice_pillar_loop_bottom',
			texturePath: 'druid/kr_ice_pillar/ice_pillar_loop_bottom/',
			min: 'druid/kr_ice_pillar/ice_pillar_loop_bottom/min_ice_pillar_loop_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_ice_splash: [
		{
			type: 'STR',
			file: 'druid/kr_ice_splash/ice_splash/ice_splash',
			texturePath: 'druid/kr_ice_splash/ice_splash/',
			min: 'druid/kr_ice_splash/ice_splash/min_ice_splash',
			wav: 'effect/druid/kr_ice_splash',
			yOffset: 12
		}
	],
	ef_druid_thundering_focus_g: [
		{
			type: 'STR',
			file: 'druid/kr_thundering_focus/thundering_focus_g/thundering_focus_g',
			texturePath: 'druid/kr_thundering_focus/thundering_focus_g/',
			min: 'druid/kr_thundering_focus/thundering_focus_g/min_thundering_focus_g',
			wav: 'effect/druid/kr_thundering_focus_g',
			yOffset: 10,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],
	ef_druid_thundering_focus_y: [
		{
			type: 'STR',
			file: 'druid/kr_thundering_focus/thundering_focus_y/thundering_focus_y',
			texturePath: 'druid/kr_thundering_focus/thundering_focus_y/',
			min: 'druid/kr_thundering_focus/thundering_focus_y/min_thundering_focus_y',
			wav: 'effect/druid/kr_thundering_focus_y',
			yOffset: 10,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],
	// Thundering Orb (KR_THUNDERING_ORB green, _S yellow): from the ground packet
	// the client throws the orb from above the caster onto the cell
	// (Renderer/Effects/BezierArcThrow.js), the same orb for both skills, and
	// plays the burst there 300 ms later (19 ticks). EZ2 rows of the same name
	// (PosY 10). See SkillEffect.js.
	ef_druid_thundering_orb_throw: [
		{
			type: 'STR',
			file: 'druid/kr_thundering_orb/thundering_orb_orb/thundering_orb_small',
			texturePath: 'druid/kr_thundering_orb/thundering_orb_orb/',
			min: 'druid/kr_thundering_orb/thundering_orb_orb/min_thundering_orb_small',
			// Art centre on the orb, as the client draws it
			xOffset: 0,
			yOffset: 0,
			arcThrow: true
		}
	],
	ef_druid_thundering_orb_g: [
		{
			type: 'STR',
			file: 'druid/kr_thundering_orb/thundering_orb_g/thundering_orb_g',
			texturePath: 'druid/kr_thundering_orb/thundering_orb_g/',
			min: 'druid/kr_thundering_orb/thundering_orb_g/min_thundering_orb_g',
			wav: 'effect/druid/kr_thundering_orb_g',
			delayWav: (19 * 1000) / 60,
			xOffset: 0,
			yOffset: 10,
			delayStart: (19 * 1000) / 60
		},
		{
			type: 'STR',
			file: 'druid/kr_thundering_orb/thundering_orb_g_bottom/thundering_orb_g_bottom',
			texturePath: 'druid/kr_thundering_orb/thundering_orb_g_bottom/',
			min: 'druid/kr_thundering_orb/thundering_orb_g_bottom/min_thundering_orb_g_bottom',
			xOffset: 0,
			yOffset: 10,
			delayStart: (19 * 1000) / 60,
			renderBeforeEntities: true
		}
	],
	ef_druid_thundering_orb_y: [
		{
			type: 'STR',
			file: 'druid/kr_thundering_orb/thundering_orb_y/thundering_orb_y',
			texturePath: 'druid/kr_thundering_orb/thundering_orb_y/',
			min: 'druid/kr_thundering_orb/thundering_orb_y/min_thundering_orb_y',
			wav: 'effect/druid/kr_thundering_orb_y',
			delayWav: (19 * 1000) / 60,
			xOffset: 0,
			yOffset: 10,
			delayStart: (19 * 1000) / 60
		},
		{
			type: 'STR',
			file: 'druid/kr_thundering_orb/thundering_orb_y_bottom/thundering_orb_y_bottom',
			texturePath: 'druid/kr_thundering_orb/thundering_orb_y_bottom/',
			min: 'druid/kr_thundering_orb/thundering_orb_y_bottom/min_thundering_orb_y_bottom',
			xOffset: 0,
			yOffset: 10,
			delayStart: (19 * 1000) / 60,
			renderBeforeEntities: true
		}
	],
	// Thundering Call (KR_THUNDERING_CALL green, _S yellow): the client plays one
	// size on the target, 3x3 below level 7 and 5x5 from 7. EZ2 rows of the same
	// name (PosY 10). See SkillEffect.js.
	ef_druid_thundering_call_g_3x3: [
		{
			type: 'STR',
			file: 'druid/kr_thundering_call/thundering_call_g_3x3/thundering_call_g_3x3',
			texturePath: 'druid/kr_thundering_call/thundering_call_g_3x3/',
			min: 'druid/kr_thundering_call/thundering_call_g_3x3/min_thundering_call_g_3x3',
			wav: 'effect/druid/kr_thundering_call_g',
			yOffset: 10,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'druid/kr_thundering_call/thundering_call_g_3x3_bottom/thundering_call_g_3x3_bottom',
			texturePath: 'druid/kr_thundering_call/thundering_call_g_3x3_bottom/',
			min: 'druid/kr_thundering_call/thundering_call_g_3x3_bottom/min_thundering_call_g_3x3_bottom',
			yOffset: 10,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],
	ef_druid_thundering_call_g_5x5: [
		{
			type: 'STR',
			file: 'druid/kr_thundering_call/thundering_call_g_5x5/thundering_call_g_5x5',
			texturePath: 'druid/kr_thundering_call/thundering_call_g_5x5/',
			min: 'druid/kr_thundering_call/thundering_call_g_5x5/min_thundering_call_g_5x5',
			wav: 'effect/druid/kr_thundering_call_g',
			yOffset: 10,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'druid/kr_thundering_call/thundering_call_g_5x5_bottom/thundering_call_g_5x5_bottom',
			texturePath: 'druid/kr_thundering_call/thundering_call_g_5x5_bottom/',
			min: 'druid/kr_thundering_call/thundering_call_g_5x5_bottom/min_thundering_call_g_5x5_bottom',
			yOffset: 10,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],
	ef_druid_thundering_call_y_3x3: [
		{
			type: 'STR',
			file: 'druid/kr_thundering_call/thundering_call_y_3x3/thundering_call_y_3x3',
			texturePath: 'druid/kr_thundering_call/thundering_call_y_3x3/',
			min: 'druid/kr_thundering_call/thundering_call_y_3x3/min_thundering_call_y_3x3',
			wav: 'effect/druid/kr_thundering_call_y',
			yOffset: 10,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'druid/kr_thundering_call/thundering_call_y_3x3_bottom/thundering_call_y_3x3_bottom',
			texturePath: 'druid/kr_thundering_call/thundering_call_y_3x3_bottom/',
			min: 'druid/kr_thundering_call/thundering_call_y_3x3_bottom/min_thundering_call_y_3x3_bottom',
			yOffset: 10,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],
	ef_druid_thundering_call_y_5x5: [
		{
			type: 'STR',
			file: 'druid/kr_thundering_call/thundering_call_y_5x5/thundering_call_y_5x5',
			texturePath: 'druid/kr_thundering_call/thundering_call_y_5x5/',
			min: 'druid/kr_thundering_call/thundering_call_y_5x5/min_thundering_call_y_5x5',
			wav: 'effect/druid/kr_thundering_call_y',
			yOffset: 10,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'druid/kr_thundering_call/thundering_call_y_5x5_bottom/thundering_call_y_5x5_bottom',
			texturePath: 'druid/kr_thundering_call/thundering_call_y_5x5_bottom/',
			min: 'druid/kr_thundering_call/thundering_call_y_5x5_bottom/min_thundering_call_y_5x5_bottom',
			yOffset: 10,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],
	ef_druid_earth_drill: [
		{
			type: 'STR',
			file: 'druid/kr_earth_drill/earth_drill/earth_drill',
			texturePath: 'druid/kr_earth_drill/earth_drill/',
			min: 'druid/kr_earth_drill/earth_drill/min_earth_drill',
			wav: 'effect/druid/kr_earth_drill',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/kr_earth_drill/earth_drill_bottom/earth_drill_bottom',
			texturePath: 'druid/kr_earth_drill/earth_drill_bottom/',
			min: 'druid/kr_earth_drill/earth_drill_bottom/min_earth_drill_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_earth_stamp: [
		{
			type: 'STR',
			file: 'druid/kr_earth_stamp/earth_stamp/earth_stamp',
			texturePath: 'druid/kr_earth_stamp/earth_stamp/',
			min: 'druid/kr_earth_stamp/earth_stamp/min_earth_stamp',
			wav: 'effect/druid/kr_earth_stamp',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/kr_earth_stamp/earth_stamp_bottom/earth_stamp_bottom',
			texturePath: 'druid/kr_earth_stamp/earth_stamp_bottom/',
			min: 'druid/kr_earth_stamp/earth_stamp_bottom/min_earth_stamp_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_ground_bloom: [
		{
			type: 'STR',
			file: 'druid/kr_ground_bloom/ground_bloom/ground_bloom',
			texturePath: 'druid/kr_ground_bloom/ground_bloom/',
			min: 'druid/kr_ground_bloom/ground_bloom/min_ground_bloom',
			wav: 'effect/druid/kr_ground_bloom',
			yOffset: 11.5
		},
		{
			type: 'STR',
			file: 'druid/kr_ground_bloom/ground_bloom_bottom/ground_bloom_bottom',
			texturePath: 'druid/kr_ground_bloom/ground_bloom_bottom/',
			min: 'druid/kr_ground_bloom/ground_bloom_bottom/min_ground_bloom_bottom',
			renderBeforeEntities: true,
			yOffset: 11.5
		}
	],
	ef_druid_pulse_of_madness: [
		{
			type: 'STR',
			file: 'druid/at_pulse_of_madness/pulse_of_madness/pulse_of_madness',
			texturePath: 'druid/at_pulse_of_madness/pulse_of_madness/',
			min: 'druid/at_pulse_of_madness/pulse_of_madness/min_pulse_of_madness',
			wav: 'effect/druid/at_pulse_of_madness',
			yOffset: 16
		}
	],
	ef_druid_alpha_phase: [
		{
			type: 'STR',
			file: 'druid/at_alpha_phase/alpha_phase/alpha_phase',
			texturePath: 'druid/at_alpha_phase/alpha_phase/',
			min: 'druid/at_alpha_phase/alpha_phase/min_alpha_phase',
			wav: 'effect/druid/at_alpha_phase',
			yOffset: 15
		}
	],
	ef_druid_apex_phase: [
		{
			type: 'STR',
			file: 'druid/at_apex_phase/apex_phase/apex_phase',
			texturePath: 'druid/at_apex_phase/apex_phase/',
			min: 'druid/at_apex_phase/apex_phase/min_apex_phase',
			wav: 'effect/druid/at_apex_phase',
			yOffset: 13
		}
	],
	ef_druid_flip_flap: [
		{
			type: 'STR',
			file: 'druid/at_flip_flap/flip_flap/flip_flap',
			texturePath: 'druid/at_flip_flap/flip_flap/',
			min: 'druid/at_flip_flap/flip_flap/min_flip_flap',
			wav: 'effect/druid/at_flip_flap',
			yOffset: 10
		}
	],
	ef_druid_nature_harmony: [
		{
			type: 'STR',
			file: 'druid/at_nature_harmony/nature_harmony/nature_harmony',
			texturePath: 'druid/at_nature_harmony/nature_harmony/',
			min: 'druid/at_nature_harmony/nature_harmony/min_nature_harmony',
			wav: 'effect/druid/at_nature_harmony',
			yOffset: 10
		}
	],
	ef_druid_primal_claw: [
		{
			type: 'STR',
			file: 'druid/at_primal_claw/primal_claw/primal_claw',
			texturePath: 'druid/at_primal_claw/primal_claw/',
			min: 'druid/at_primal_claw/primal_claw/min_primal_claw',
			wav: 'effect/druid/at_primal_claw',
			yOffset: 10
		}
	],
	ef_druid_feral_claw: [
		{
			type: 'STR',
			file: 'druid/at_feral_claw/feral_claw/feral_claw',
			texturePath: 'druid/at_feral_claw/feral_claw/',
			min: 'druid/at_feral_claw/feral_claw/min_feral_claw',
			wav: 'effect/druid/at_feral_claw',
			yOffset: 10
		}
	],
	ef_druid_alpha_claw: [
		{
			type: 'STR',
			file: 'druid/at_alpha_claw/alpha_claw/alpha_claw',
			texturePath: 'druid/at_alpha_claw/alpha_claw/',
			min: 'druid/at_alpha_claw/alpha_claw/min_alpha_claw',
			wav: 'effect/druid/at_alpha_claw',
			yOffset: 10
		}
	],
	ef_druid_savage_lunge: [
		{
			type: 'STR',
			file: 'druid/at_savage_lunge/savage_lunge/savage_lunge',
			texturePath: 'druid/at_savage_lunge/savage_lunge/',
			min: 'druid/at_savage_lunge/savage_lunge/min_savage_lunge',
			wav: 'effect/druid/at_savage_lunge',
			yOffset: 12
		},
		{
			type: 'STR',
			file: 'druid/at_savage_lunge/savage_lunge_bottom/savage_lunge_bottom',
			texturePath: 'druid/at_savage_lunge/savage_lunge_bottom/',
			min: 'druid/at_savage_lunge/savage_lunge_bottom/min_savage_lunge_bottom',
			renderBeforeEntities: true,
			yOffset: 12
		}
	],
	ef_druid_frenzy_fang: [
		{
			type: 'STR',
			file: 'druid/at_frenzy_fang/frenzy_fang/frenzy_fang',
			texturePath: 'druid/at_frenzy_fang/frenzy_fang/',
			min: 'druid/at_frenzy_fang/frenzy_fang/min_frenzy_fang',
			wav: 'effect/druid/at_frenzy_fang',
			yOffset: 10
		}
	],
	ef_druid_pinion_shot: [
		{
			type: 'STR',
			file: 'druid/at_pinion_shot/pinion_shot/pinion_shot',
			texturePath: 'druid/at_pinion_shot/pinion_shot/',
			min: 'druid/at_pinion_shot/pinion_shot/min_pinion_shot',
			wav: 'effect/druid/at_pinion_shot',
			// Points right in the file: turned once toward the target (successEffectIdOnCasterAimed)
			yOffset: 10
		}
	],
	// EZ2 row quill_spear_3x7. The spear flies to the right in the file; the
	// caller turns it toward the target on screen (screenTurn).
	ef_druid_quill_spear_3x7: [
		{
			type: 'STR',
			file: 'druid/at_quill_spear/quill_spear_3x7/quill_spear_3x7',
			texturePath: 'druid/at_quill_spear/quill_spear_3x7/',
			min: 'druid/at_quill_spear/quill_spear_3x7/min_quill_spear_3x7',
			wav: 'effect/druid/at_quill_spear',
			yOffset: 5,
			attachedEntity: true
		}
	],
	// EZ2 row quill_spear_5x7. The spear flies to the right in the file; the
	// caller turns it toward the target on screen (screenTurn).
	ef_druid_quill_spear_5x7: [
		{
			type: 'STR',
			file: 'druid/at_quill_spear/quill_spear_5x7/quill_spear_5x7',
			texturePath: 'druid/at_quill_spear/quill_spear_5x7/',
			min: 'druid/at_quill_spear/quill_spear_5x7/min_quill_spear_5x7',
			wav: 'effect/druid/at_quill_spear',
			yOffset: 5,
			attachedEntity: true
		}
	],
	// Quill Spear's second part (official effect 2442): eight sets of streak
	// lines (prim type 56, StreakLinesSim.js) laid along the caster-to-target
	// line once, at the caster's spot, for 300 ticks. Nothing without a target.
	ef_druid_quill_spear_line: [
		{
			type: 'FUNC',
			func: function (Params) {
				const caster = Params.Init.ownerEntity;
				const target = Params.Init.otherEntity;
				if (!caster || !target || target === caster) {
					return;
				}
				this.add(
					new StreakLines(caster.position, target.position, Params.Inst.startTick, {
						black: 'druid/at_quill_spear/quill_spear_line/line_black.tga',
						color: 'druid/at_quill_spear/quill_spear_line/line_color.tga'
					}),
					Params
				);
			}
		}
	],
	ef_druid_tempest_flap: [
		{
			type: 'STR',
			file: 'druid/at_tempest_flap/tempest_flap/tempest_flap',
			texturePath: 'druid/at_tempest_flap/tempest_flap/',
			min: 'druid/at_tempest_flap/tempest_flap/min_tempest_flap',
			wav: 'effect/druid/at_tempest_flap',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_tempest_flap/tempest_flap_bottom/tempest_flap_bottom',
			texturePath: 'druid/at_tempest_flap/tempest_flap_bottom/',
			min: 'druid/at_tempest_flap/tempest_flap_bottom/min_tempest_flap_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_tempest_flap_cast: [
		{
			type: 'STR',
			file: 'druid/at_tempest_flap/tempest_flap_cast/tempest_flap_cast',
			texturePath: 'druid/at_tempest_flap/tempest_flap_cast/',
			min: 'druid/at_tempest_flap/tempest_flap_cast/min_tempest_flap_cast',
			yOffset: 10
		}
	],
	ef_druid_aero_sync: [
		{
			type: 'STR',
			file: 'druid/at_aero_sync/aero_sync_main/aero_sync_main',
			texturePath: 'druid/at_aero_sync/aero_sync_main/',
			min: 'druid/at_aero_sync/aero_sync_main/min_aero_sync_main',
			wav: 'effect/druid/at_aero_sync',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_aero_sync/aero_sync_main_bottom/aero_sync_main_bottom',
			texturePath: 'druid/at_aero_sync/aero_sync_main_bottom/',
			min: 'druid/at_aero_sync/aero_sync_main_bottom/min_aero_sync_main_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_aero_sync_self: [
		{
			type: 'STR',
			file: 'druid/at_aero_sync/aero_sync_sync/aero_sync_sync',
			texturePath: 'druid/at_aero_sync/aero_sync_sync/',
			min: 'druid/at_aero_sync/aero_sync_sync/min_aero_sync_sync',
			wav: 'effect/DRUID/AT_AERO_SYNC',
			soundLoop: false,
			yOffset: 15
		}
	],
	ef_druid_zephyr_link: [
		{
			type: 'STR',
			file: 'druid/at_zephyr_link/zephyr_link/zephyr_link',
			texturePath: 'druid/at_zephyr_link/zephyr_link/',
			min: 'druid/at_zephyr_link/zephyr_link/min_zephyr_link',
			wav: 'effect/druid/at_zephyr_link',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_zephyr_link/zephyr_link_bottom/zephyr_link_bottom',
			texturePath: 'druid/at_zephyr_link/zephyr_link_bottom/',
			min: 'druid/at_zephyr_link/zephyr_link_bottom/min_zephyr_link_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_glacier_monolith_start: [
		{
			type: 'STR',
			file: 'druid/at_glacier_monolith/glacier_monolith_start/glacier_monolith_start',
			texturePath: 'druid/at_glacier_monolith/glacier_monolith_start/',
			min: 'druid/at_glacier_monolith/glacier_monolith_start/min_glacier_monolith_start',
			wav: 'effect/druid/at_glacier_monolith_start',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_glacier_monolith/glacier_monolith_start_bottom/glacier_monolith_start_bottom',
			texturePath: 'druid/at_glacier_monolith/glacier_monolith_start_bottom/',
			min: 'druid/at_glacier_monolith/glacier_monolith_start_bottom/min_glacier_monolith_start_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_glacier_monolith_loop: [
		{
			type: 'STR',
			file: 'druid/at_glacier_monolith/glacier_monolith_loop/glacier_monolith_loop',
			texturePath: 'druid/at_glacier_monolith/glacier_monolith_loop/',
			min: 'druid/at_glacier_monolith/glacier_monolith_loop/min_glacier_monolith_loop',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_glacier_monolith/glacier_monolith_loop_bottom/glacier_monolith_loop_bottom',
			texturePath: 'druid/at_glacier_monolith/glacier_monolith_loop_bottom/',
			min: 'druid/at_glacier_monolith/glacier_monolith_loop_bottom/min_glacier_monolith_loop_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_glacier_nova: [
		{
			type: 'STR',
			file: 'druid/at_glacier_nova/glacier_nova/glacier_nova',
			texturePath: 'druid/at_glacier_nova/glacier_nova/',
			min: 'druid/at_glacier_nova/glacier_nova/min_glacier_nova',
			wav: 'effect/druid/at_glacier_nova',
			yOffset: 10
		}
	],
	ef_druid_glacier_shard: [
		{
			type: 'STR',
			file: 'druid/at_glacier_shard/glacier_shard/glacier_shard',
			texturePath: 'druid/at_glacier_shard/glacier_shard/',
			min: 'druid/at_glacier_shard/glacier_shard/min_glacier_shard',
			wav: 'effect/druid/at_glacier_shard',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_glacier_shard/glacier_shard_target/glacier_shard_target',
			texturePath: 'druid/at_glacier_shard/glacier_shard_target/',
			min: 'druid/at_glacier_shard/glacier_shard_target/min_glacier_shard_target',
			yOffset: 10
		}
	],
	ef_druid_glacier_stomp: [
		{
			type: 'STR',
			file: 'druid/at_glacier_stomp/glacier_stomp/glacier_stomp',
			texturePath: 'druid/at_glacier_stomp/glacier_stomp/',
			min: 'druid/at_glacier_stomp/glacier_stomp/min_glacier_stomp',
			yOffset: 10
		}
	],
	ef_druid_chilling_blast: [
		{
			type: 'STR',
			file: 'druid/at_chilling_blast/chilling_blast/chilling_blast',
			texturePath: 'druid/at_chilling_blast/chilling_blast/',
			min: 'druid/at_chilling_blast/chilling_blast/min_chilling_blast',
			wav: 'effect/druid/at_chilling_blast',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_chilling_blast/chilling_blast_bottom/chilling_blast_bottom',
			texturePath: 'druid/at_chilling_blast/chilling_blast_bottom/',
			min: 'druid/at_chilling_blast/chilling_blast_bottom/min_chilling_blast_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_roaring_piercer_g: [
		{
			type: 'STR',
			file: 'druid/at_roaring_piercer/roaring_piercer_g/roaring_piercer_g',
			texturePath: 'druid/at_roaring_piercer/roaring_piercer_g/',
			min: 'druid/at_roaring_piercer/roaring_piercer_g/min_roaring_piercer_g',
			wav: 'effect/druid/at_roaring_piercer_g',
			// The spear flies to the left of the caster in the file
			rotateToTarget: true,
			facing: 180,
			yOffset: 5
		}
	],
	ef_druid_roaring_piercer_y: [
		{
			type: 'STR',
			file: 'druid/at_roaring_piercer/roaring_piercer_y/roaring_piercer_y',
			texturePath: 'druid/at_roaring_piercer/roaring_piercer_y/',
			min: 'druid/at_roaring_piercer/roaring_piercer_y/min_roaring_piercer_y',
			wav: 'effect/druid/at_roaring_piercer_y',
			// The spear flies to the left of the caster in the file
			rotateToTarget: true,
			facing: 180,
			yOffset: 5
		}
	],
	ef_druid_roaring_charge: [
		{
			type: 'STR',
			file: 'druid/at_roaring_charge/roaring_charge/roaring_charge',
			texturePath: 'druid/at_roaring_charge/roaring_charge/',
			min: 'druid/at_roaring_charge/roaring_charge/min_roaring_charge',
			wav: 'effect/druid/at_roaring_charge_g',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_roaring_charge/roaring_charge_bottom/roaring_charge_bottom',
			texturePath: 'druid/at_roaring_charge/roaring_charge_bottom/',
			min: 'druid/at_roaring_charge/roaring_charge_bottom/min_roaring_charge_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_roaring_charge_s: [
		{
			type: 'STR',
			file: 'druid/at_roaring_charge/roaring_charge_s/roaring_charge_s',
			texturePath: 'druid/at_roaring_charge/roaring_charge_s/',
			min: 'druid/at_roaring_charge/roaring_charge_s/min_roaring_charge_s',
			wav: 'effect/druid/at_roaring_charge_y',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_roaring_charge/roaring_charge_s_bottom/roaring_charge_s_bottom',
			texturePath: 'druid/at_roaring_charge/roaring_charge_s_bottom/',
			min: 'druid/at_roaring_charge/roaring_charge_s_bottom/min_roaring_charge_s_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_furios_storm: [
		{
			type: 'STR',
			file: 'druid/at_furios_storm/furios_storm_a/furios_storm_a',
			texturePath: 'druid/at_furios_storm/furios_storm_a/',
			min: 'druid/at_furios_storm/furios_storm_a/min_furios_storm_a',
			wav: 'effect/druid/at_furios_storm',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_furios_storm/furios_storm_a_bottom/furios_storm_a_bottom',
			texturePath: 'druid/at_furios_storm/furios_storm_a_bottom/',
			min: 'druid/at_furios_storm/furios_storm_a_bottom/min_furios_storm_a_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_terra_wave: [
		{
			type: 'STR',
			file: 'druid/at_terra_wave/terra_wave/terra_wave',
			texturePath: 'druid/at_terra_wave/terra_wave/',
			min: 'druid/at_terra_wave/terra_wave/min_terra_wave',
			wav: 'effect/druid/at_terra_wave',
			yOffset: 0
		},
		{
			type: 'STR',
			file: 'druid/at_terra_wave/terra_wave_bottom/terra_wave_bottom',
			texturePath: 'druid/at_terra_wave/terra_wave_bottom/',
			min: 'druid/at_terra_wave/terra_wave_bottom/min_terra_wave_bottom',
			renderBeforeEntities: true,
			yOffset: 0
		}
	],
	ef_druid_terra_harvest: [
		{
			type: 'STR',
			file: 'druid/at_terra_harvest/terra_harvest_yellow/terra_harvest_yellow',
			texturePath: 'druid/at_terra_harvest/terra_harvest_yellow/',
			min: 'druid/at_terra_harvest/terra_harvest_yellow/min_terra_harvest_yellow',
			wav: 'effect/druid/at_terra_harvest',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_terra_harvest/terra_harvest_yellow_bottom/terra_harvest_yellow_bottom',
			texturePath: 'druid/at_terra_harvest/terra_harvest_yellow_bottom/',
			min: 'druid/at_terra_harvest/terra_harvest_yellow_bottom/min_terra_harvest_yellow_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_solid_stomp: [
		{
			type: 'STR',
			file: 'druid/at_solid_stomp/solid_stomp/solid_stomp',
			texturePath: 'druid/at_solid_stomp/solid_stomp/',
			min: 'druid/at_solid_stomp/solid_stomp/min_solid_stomp',
			wav: 'effect/druid/at_solid_stomp',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_solid_stomp/solid_stomp_bottom/solid_stomp_bottom',
			texturePath: 'druid/at_solid_stomp/solid_stomp_bottom/',
			min: 'druid/at_solid_stomp/solid_stomp_bottom/min_solid_stomp_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],
	ef_druid_gravity_hole: [
		{
			type: 'STR',
			file: 'druid/at_gravity_hole/gravity_hole/gravity_hole',
			texturePath: 'druid/at_gravity_hole/gravity_hole/',
			min: 'druid/at_gravity_hole/gravity_hole/min_gravity_hole',
			wav: 'effect/druid/at_gravity_hole',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'druid/at_gravity_hole/gravity_hole_bottom/gravity_hole_bottom',
			texturePath: 'druid/at_gravity_hole/gravity_hole_bottom/',
			min: 'druid/at_gravity_hole/gravity_hole_bottom/min_gravity_hole_bottom',
			renderBeforeEntities: true,
			yOffset: 10
		}
	]
};
