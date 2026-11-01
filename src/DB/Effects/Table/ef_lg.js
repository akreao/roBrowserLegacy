/**
 * @module DB/Effects/Table/ef_lg
 *
 * The effect table's named ef_lg_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Cannon Spear (LG_CANNONSPEAR), from the client's own effect folders.
	ef_lg_cannonspear: [
		{
			type: 'STR',
			file: 'new_cannon_spear/new_cannon_spear_bottom/new_cannon_spear_bottom',
			texturePath: 'new_cannon_spear/new_cannon_spear_bottom/',
			renderBeforeEntities: true,
			wav: 'effect/lg_cannonspear'
		}
	],

	// Banishing Point (LG_BANISHINGPOINT), from the client's own effect folders.
	ef_lg_banishingpoint_cast: [
		{
			type: 'STR',
			file: 'new_banishingpoint/new_banishingpoint_cast/new_banishingpoint_cast',
			texturePath: 'new_banishingpoint/new_banishingpoint_cast/',
			wav: 'effect/lg_banishingpoint'
		},
		{
			type: 'STR',
			file: 'new_banishingpoint/new_banishingpoint_cast_bottom/new_banishingpoint_cast_bottom',
			texturePath: 'new_banishingpoint/new_banishingpoint_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Over Brand (LG_OVERBRAND), from the client's own effect folders.
	ef_lg_overbrand_cast: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast/new_overbrand_cast',
			texturePath: 'new_overbrand/new_overbrand_cast/',
			wav: 'effect/lg_overbrand'
		},
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast_bottom/new_overbrand_cast_bottom',
			texturePath: 'new_overbrand/new_overbrand_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Over Brand (LG_OVERBRAND), from the client's own effect folders.
	ef_lg_overbrand_hit: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_hit/new_overbrand_hit',
			texturePath: 'new_overbrand/new_overbrand_hit/'
		}
	],

	// Ray of Genesis (LG_RAYOFGENESIS), from the client's own effect folders.
	ef_lg_rayofgenesis: [
		{
			type: 'STR',
			file: 'new_rayofgenesis/new_rayofgenesis/new_rayofgenesis',
			texturePath: 'new_rayofgenesis/new_rayofgenesis/',
			wav: 'effect/lg_rayofgenesis'
		}
	],

	// Ray of Genesis (LG_RAYOFGENESIS), from the client's own effect folders.
	ef_lg_rayofgenesis_cast: [
		{
			type: 'STR',
			file: 'new_rayofgenesis/new_rayofgenesis_cast/new_rayofgenesis_cast',
			texturePath: 'new_rayofgenesis/new_rayofgenesis_cast/'
		},
		{
			type: 'STR',
			file: 'new_rayofgenesis/new_rayofgenesis_cast_bottom/new_rayofgenesis_cast_bottom',
			texturePath: 'new_rayofgenesis/new_rayofgenesis_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Ray of Genesis (LG_RAYOFGENESIS), from the client's own effect folders.
	ef_lg_rayofgenesis_hit: [
		{
			type: 'STR',
			file: 'new_rayofgenesis/new_rayofgenesis_hit/new_rayofgenesis_hit',
			texturePath: 'new_rayofgenesis/new_rayofgenesis_hit/'
		}
	],

	// Earth Drive (LG_EARTHDRIVE), from the client's own effect folders.
	ef_lg_earthdrive: [
		{
			type: 'STR',
			file: 'new_earthdrive/new_earthdrive/new_earthdrive',
			texturePath: 'new_earthdrive/new_earthdrive/',
			wav: 'effect/lg_earthdrive'
		},
		{
			type: 'STR',
			file: 'new_earthdrive/new_earthdrive_bottom/new_earthdrive_bottom',
			texturePath: 'new_earthdrive/new_earthdrive_bottom/',
			renderBeforeEntities: true
		}
	],

	// Overbrand Brandish (LG_OVERBRAND_BRANDISH), from the client's own effect folders.
	ef_lg_overbrand_brandish_cast: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast/new_overbrand_cast',
			texturePath: 'new_overbrand/new_overbrand_cast/'
		},
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast_bottom/new_overbrand_cast_bottom',
			texturePath: 'new_overbrand/new_overbrand_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Overbrand Brandish (LG_OVERBRAND_BRANDISH), from the client's own effect folders.
	ef_lg_overbrand_brandish_hit: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_hit/new_overbrand_hit',
			texturePath: 'new_overbrand/new_overbrand_hit/'
		}
	],

	// Overbrand Plus Attack (LG_OVERBRAND_PLUSATK), from the client's own effect folders.
	ef_lg_overbrand_plusatk_cast: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast/new_overbrand_cast',
			texturePath: 'new_overbrand/new_overbrand_cast/'
		},
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_cast_bottom/new_overbrand_cast_bottom',
			texturePath: 'new_overbrand/new_overbrand_cast_bottom/',
			renderBeforeEntities: true
		}
	],

	// Overbrand Plus Attack (LG_OVERBRAND_PLUSATK), from the client's own effect folders.
	ef_lg_overbrand_plusatk_hit: [
		{
			type: 'STR',
			file: 'new_overbrand/new_overbrand_hit/new_overbrand_hit',
			texturePath: 'new_overbrand/new_overbrand_hit/'
		}
	]
};
