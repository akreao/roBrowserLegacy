/**
 * @module DB/Effects/Table/ef_sj
 *
 * The effect table's named ef_sj_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Full Moon Kick (SJ_FULLMOONKICK): official effect 1230 (CEZ2STREffect), launched on the caster with 399
	// (EF_BASH3D3) and 1223 (CStormKickEffect, not ported) when the use packet has the result set
	// (skilleffectinfo). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sj_fullmoonkick: [
		{
			//EF_FULLMOON_KICK (1230)
			type: 'STR',
			file: 'fullmoon_kick/fullmoon_kick',
			texturePath: 'fullmoon_kick/',
			attachedEntity: true
		}
	],

	// New Moon Kick (SJ_NEWMOONKICK): official effect 1229 (CEZ2STREffect), launched on the caster when the
	// use packet has the result set (skilleffectinfo). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sj_newmoonkick: [
		{
			//EF_NEWMOON_KICK (1229)
			type: 'STR',
			file: 'newmoon_kick/newmoon_kick',
			texturePath: 'newmoon_kick/',
			attachedEntity: true
		}
	],

	// Flash Kick (SJ_FLASHKICK): official effect 1221 (CEZ2STREffect, in its "stays" list), kept on the actor
	// while EFST_FLASHKICK is on. See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sj_flashkick: [
		{
			//EF_FLASHKICK (1221)
			type: 'STR',
			file: 'flash_kick/flash_kick',
			texturePath: 'flash_kick/',
			repeat: true,
			attachedEntity: true
		}
	],

	// Falling Star attack (SJ_FALLINGSTAR_ATK): official effect 1220 (CEZ2STREffect) and wizard_sightrasher.wav,
	// on the target as each damage packet arrives (skilleffectinfo). See
	// effect-port/star-emperor-soul-reaper-skills.md.
	ef_sj_fallingstar: [
		{
			//EF_FALLING_STAR (1220)
			type: 'STR',
			file: 'falling_star/falling_star',
			texturePath: 'falling_star/',
			wav: 'effect/wizard_sightrasher',
			attachedEntity: true
		}
	],

	// Document of Sun, Moon and Star (SJ_DOCUMENT): official effect 1219 (CEZ2STREffect), on the caster when
	// the use packet has the result set (skilleffectinfo). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sj_document: [
		{
			//EF_SJ_DOCUMENT (1219)
			type: 'STR',
			file: 'sj_document/sj_document',
			texturePath: 'sj_document/',
			attachedEntity: true
		}
	],

	// Solar Burst (SJ_SOLARBURST): official effect 1218 (CEZ2STREffect) and g데모닉화이어.wav, on the caster
	// when the use packet has the result set (skilleffectinfo). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sj_solarburst: [
		{
			//EF_SOLARBURST (1218)
			type: 'STR',
			file: 'solar_burst/solar_burst',
			texturePath: 'solar_burst/',
			wav: 'effect/g\xb5\xa5\xb8\xf0\xb4\xd0\xc8\xad\xc0\xcc\xbe\xee', // g데모닉화이어
			attachedEntity: true
		}
	],

	// Prominence Kick (SJ_PROMINENCEKICK), from the client's own effect folders.
	ef_sj_prominencekick: [
		{
			type: 'STR',
			file: 'prominence_kick/prominence_kick',
			texturePath: 'prominence_kick/'
		}
	],

	// Light of the Moon / Stars / Sun (SJ_LIGHTOFMOON / SJ_LIGHTOFSTAR / SJ_LIGHTOFSUN): when the use packet
	// has the result set, the skilleffectinfo row plays t_피링.wav and launches the light sphere (1198 / 1199 /
	// 1197, CLightSphereEffect, LightSphereEffect.js) on the caster. See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sj_lightof_sound: [
		{
			wav: 'effect/t_\xc7\xc7\xb8\xb5', // t_피링
			attachedEntity: true
		}
	],

	// Book of Dimension (SJ_BOOKOFDIMENSION): official effect 1231 and so_elemental_shield.wav, on the caster
	// when the use packet has the result set (skilleffectinfo). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sj_bookofdimension: [
		{
			//EF_BOOK_OF_DIMENSION (1231): CSpriteEffect, 이팩트\book_of_dimension\book_of_dimension.spr, 4 ticks a frame, once
			type: 'SPR',
			file: 'book_of_dimension/book_of_dimension',
			delayFrame: 67, // 4 ticks
			// the client's sprite effects are separate objects: a second packet on the same actor
			// starts its own copy
			stackable: true,
			wav: 'effect/so_elemental_shield', // so_elemental_shield
			attachedEntity: true
		}
	]
};
