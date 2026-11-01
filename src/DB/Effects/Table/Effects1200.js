/**
 * @module DB/Effects/Table/Effects1200
 *
 * Effects 1200 to 1299 of the effect table. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep rows in effect ID order.
 */

import StarEmperorStatusEffects from 'DB/Effects/StarEmperorStatusEffects.js';
import { smaBlackEffect } from 'DB/Effects/SmaBlackEffect.js';
import { energyDrainEffect } from 'DB/Effects/EnergyDrainEffect.js';
import { startBlinkBody } from 'Renderer/Effects/BlinkBody.js';
import SoulCollect from 'Renderer/Effects/SoulCollect.js';
import UnityLink from 'Renderer/Effects/UnityLink.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';

export default {
	1204: smaBlackEffect,

	1207: energyDrainEffect(1207),

	1208: energyDrainEffect(1208),

	1209: [
		{
			//EF_BLINK_BODY	The actor blinks pale blue and dark for 60 ticks (BlinkBody.js, kRO 2025 0xbc070d)
			type: 'FUNC',
			attachedEntity: true,
			func: Params => {
				startBlinkBody(Params.Init.ownerEntity);
			}
		}
	],

	1210: [
		{
			// Soul Unity's link: yellow and blue cloud tubes from the target to the caster (UnityLink.js, kRO 2025 0xbf1af0)
			type: 'FUNC',
			attachedEntity: true,
			// 200 ticks: also lets the manager drop it while it is culled and not drawn
			duration: Math.ceil(200 * PRIM_TICK_MS),
			func: function (Params) {
				this.add(
					new UnityLink(Params.Init.ownerEntity, Params.Init.otherEntity, Params.Inst.startTick),
					Params
				);
			}
		}
	],

	1225: [
		{
			// Soul energy orbs (Soul Reaper, Soul Ascetic), one per soul from ZC_SOULENERGY, newest five shown
			type: 'FUNC',
			attachedEntity: true,
			func: function (Params) {
				this.add(new SoulCollect(Params.Init.ownerEntity, Params.Init.spiritNum, Params.Inst.startTick), Params);
			}
		}
	],

	1240: [
		{
			//EF_DIGITAL_SPACE - Hat effect example (SPR)
			type: 'SPR',
			file: 'digital_space/digital_space',
			texturePath: 'digital_space/',
			attachedEntity: true,
			repeat: true,
			renderBeforeEntities: true
		}
	],

	// Crimson Rock (WL_CRIMSONROCK), with 1275: on the target when the damage arrives. See effect-port/warlock-skills.md.
	1274: [
		{
			//(1274): CEZ2STREffect, new_crimsonrock\\new_crimsonrock\\new_crimsonrock.str
			type: 'STR',
			file: 'new_crimsonrock/new_crimsonrock/new_crimsonrock',
			texturePath: 'new_crimsonrock/new_crimsonrock/',
			attachedEntity: true
		}
	],

	// Crimson Rock (WL_CRIMSONROCK) floor, with 1274. See effect-port/warlock-skills.md.
	1275: [
		{
			//(1275): CEZ2STREffect, new_crimsonrock\\new_crimsonrock_bottom\\new_crimsonrock_bottom.str
			type: 'STR',
			file: 'new_crimsonrock/new_crimsonrock_bottom/new_crimsonrock_bottom',
			texturePath: 'new_crimsonrock/new_crimsonrock_bottom/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Crimson Rock (WL_CRIMSONROCK) sub explosion: on the target with each hit after the first (none under /mineffect).
	// See effect-port/warlock-skills.md.
	1298: [
		{
			//(1298): CEZ2STREffect, new_crimsonrock\\new_crimsonrock_sub_explosion\\new_crimsonrock_sub_explosion.str
			type: 'STR',
			file: 'new_crimsonrock/new_crimsonrock_sub_explosion/new_crimsonrock_sub_explosion',
			texturePath: 'new_crimsonrock/new_crimsonrock_sub_explosion/',
			minSkip: true,
			attachedEntity: true
		}
	],

	// Tetra Vortex (WL_TETRAVORTEX) cast floor, with 1261: on the caster for the cast time. See effect-port/warlock-skills.md.
	1277: [
		{
			//(1277): CEZ2STREffect, tetravortex\\tetra_ball_00_core_ground\\tetra_ball_00_core_grd.str
			type: 'STR',
			file: 'tetravortex/tetra_ball_00_core_ground/tetra_ball_00_core_grd',
			texturePath: 'tetravortex/tetra_ball_00_core_ground/',
			renderBeforeEntities: true,
			castLoop: true,
			attachedEntity: true
		}
	],

	// Tetra Vortex (WL_TETRAVORTEX) cast, with 1277. See effect-port/warlock-skills.md.
	1261: [
		{
			//(1261): CEZ2STREffect, tetravortex\\tetra_ball_00_core\\tetra_ball_00_core.str
			type: 'STR',
			file: 'tetravortex/tetra_ball_00_core/tetra_ball_00_core',
			texturePath: 'tetravortex/tetra_ball_00_core/',
			castLoop: true,
			attachedEntity: true
		}
	],

	1278: [
		{
			//(1278): CEZ2STREffect, tetravortex\\tetra_01_fire_sub_explosion\\tetra_01_fire_sub_expn.str
			type: 'STR',
			file: 'tetravortex/tetra_01_fire_sub_explosion/tetra_01_fire_sub_expn',
			texturePath: 'tetravortex/tetra_01_fire_sub_explosion/',
			attachedEntity: false
		}
	],

	1279: [
		{
			//(1279): CEZ2STREffect, tetravortex\\tetra_04_water_sub_explosion\\tetra_04_water_sub_expn.str
			type: 'STR',
			file: 'tetravortex/tetra_04_water_sub_explosion/tetra_04_water_sub_expn',
			texturePath: 'tetravortex/tetra_04_water_sub_explosion/',
			attachedEntity: false
		}
	],

	1280: [
		{
			//(1280): CEZ2STREffect, tetravortex\\tetra_02_wind_sub_explosion\\tetra_02_wind_sub_expn.str
			type: 'STR',
			file: 'tetravortex/tetra_02_wind_sub_explosion/tetra_02_wind_sub_expn',
			texturePath: 'tetravortex/tetra_02_wind_sub_explosion/',
			attachedEntity: false
		}
	],

	1281: [
		{
			//(1281): CEZ2STREffect, tetravortex\\tetra_03_earth_sub_explosion\\tetra_03_earth_sub_expn.str
			type: 'STR',
			file: 'tetravortex/tetra_03_earth_sub_explosion/tetra_03_earth_sub_expn',
			texturePath: 'tetravortex/tetra_03_earth_sub_explosion/',
			attachedEntity: false
		}
	],

	// Tetra Vortex Fire (WL_TETRAVORTEX_FIRE) floor, with 1266: on the target on success. See effect-port/warlock-skills.md.
	1270: [
		{
			//(1270): CEZ2STREffect, tetravortex\\tetra_01_fire_ground\\tetra_01_fire_grd.str
			type: 'STR',
			file: 'tetravortex/tetra_01_fire_ground/tetra_01_fire_grd',
			texturePath: 'tetravortex/tetra_01_fire_ground/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Tetra Vortex Fire (WL_TETRAVORTEX_FIRE) explosion, with 1270. See effect-port/warlock-skills.md.
	1266: [
		{
			//(1266): CEZ2STREffect, tetravortex\\tetra_01_fire_explosion\\tetra_01_fire_expn.str
			type: 'STR',
			file: 'tetravortex/tetra_01_fire_explosion/tetra_01_fire_expn',
			texturePath: 'tetravortex/tetra_01_fire_explosion/',
			attachedEntity: true
		}
	],

	// Tetra Vortex Water (WL_TETRAVORTEX_WATER) floor, with 1267: on the target on success. See effect-port/warlock-skills.md.
	1271: [
		{
			//(1271): CEZ2STREffect, tetravortex\\tetra_04_water_ground\\tetra_04_water_grd.str
			type: 'STR',
			file: 'tetravortex/tetra_04_water_ground/tetra_04_water_grd',
			texturePath: 'tetravortex/tetra_04_water_ground/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Tetra Vortex Water (WL_TETRAVORTEX_WATER) explosion, with 1271. See effect-port/warlock-skills.md.
	1267: [
		{
			//(1267): CEZ2STREffect, tetravortex\\tetra_04_water_explosion\\tetra_04_water_expn.str
			type: 'STR',
			file: 'tetravortex/tetra_04_water_explosion/tetra_04_water_expn',
			texturePath: 'tetravortex/tetra_04_water_explosion/',
			attachedEntity: true
		}
	],

	// Tetra Vortex Wind (WL_TETRAVORTEX_WIND) floor, with 1268: on the target on success. See effect-port/warlock-skills.md.
	1272: [
		{
			//(1272): CEZ2STREffect, tetravortex\\tetra_02_wind_ground\\tetra_02_wind_grd.str
			type: 'STR',
			file: 'tetravortex/tetra_02_wind_ground/tetra_02_wind_grd',
			texturePath: 'tetravortex/tetra_02_wind_ground/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Tetra Vortex Wind (WL_TETRAVORTEX_WIND) explosion, with 1272. See effect-port/warlock-skills.md.
	1268: [
		{
			//(1268): CEZ2STREffect, tetravortex\\tetra_02_wind_explosion\\tetra_02_wind_expn.str
			type: 'STR',
			file: 'tetravortex/tetra_02_wind_explosion/tetra_02_wind_expn',
			texturePath: 'tetravortex/tetra_02_wind_explosion/',
			attachedEntity: true
		}
	],

	// Tetra Vortex Earth (WL_TETRAVORTEX_GROUND) floor, with 1269: on the target on success. See effect-port/warlock-skills.md.
	1273: [
		{
			//(1273): CEZ2STREffect, tetravortex\\tetra_03_earth_ground\\tetra_03_earth_grd.str
			type: 'STR',
			file: 'tetravortex/tetra_03_earth_ground/tetra_03_earth_grd',
			texturePath: 'tetravortex/tetra_03_earth_ground/',
			renderBeforeEntities: true,
			attachedEntity: true
		}
	],

	// Tetra Vortex Earth (WL_TETRAVORTEX_GROUND) explosion, with 1273. See effect-port/warlock-skills.md.
	1269: [
		{
			//(1269): CEZ2STREffect, tetravortex\\tetra_03_earth_explosion\\tetra_03_earth_expn.str
			type: 'STR',
			file: 'tetravortex/tetra_03_earth_explosion/tetra_03_earth_expn',
			texturePath: 'tetravortex/tetra_03_earth_explosion/',
			attachedEntity: true
		}
	],

	// Summon Fire Ball / Lightning Ball / Water Ball / Stone (WL_SUMMONFB ... WL_SUMMONSTONE) cast aura: on the
	// caster for the cast time. See effect-port/warlock-skills.md.
	1260: [
		{
			//(1260): CEZ2STREffect, tetravortex\\tetra_cast\\tetra_cast.str
			type: 'STR',
			file: 'tetravortex/tetra_cast/tetra_cast',
			texturePath: 'tetravortex/tetra_cast/',
			castLoop: true,
			attachedEntity: true
		}
	],

	// Arrow Storm (RA_ARROWSTORM) rain, on each target as the damage arrives. See effect-port/ranger-skills.md.
	1293: [
		{
			//(1293): CEZ2STREffect, new_arrowstorm\\new_arrowstorm_00\\new_arrowstorm_00.str
			type: 'STR',
			file: 'new_arrowstorm/new_arrowstorm_00/new_arrowstorm_00',
			texturePath: 'new_arrowstorm/new_arrowstorm_00/',
			min: 'mineffect/new_arrowstorm/new_arrowstorm_00/new_arrowstorm_00',
			minTexturePath: 'mineffect/new_arrowstorm/new_arrowstorm_00/',
			attachedEntity: true
		}
	],

	// Arrow Storm (RA_ARROWSTORM) second rain: the client launches it three times with start delays 600, 800 and 1000 ms. See effect-port/ranger-skills.md.
	1294: [
		{
			//(1294): CEZ2STREffect, new_arrowstorm\\new_arrowstorm_01\\new_arrowstorm_01.str
			type: 'STR',
			file: 'new_arrowstorm/new_arrowstorm_01/new_arrowstorm_01',
			texturePath: 'new_arrowstorm/new_arrowstorm_01/',
			min: 'mineffect/new_arrowstorm/new_arrowstorm_01/new_arrowstorm_01',
			minTexturePath: 'mineffect/new_arrowstorm/new_arrowstorm_01/',
			duplicate: 3,
			timeBetweenDupli: 200,
			delayStart: 600,
			attachedEntity: true
		}
	],

	// Star Emperor / Soul Reaper status looks (stances 1214-1217, Gravity Control 1201, Soul Unity 1222): StarEmperorStatusEffects.js.
	...StarEmperorStatusEffects
};
