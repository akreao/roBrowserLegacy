/**
 * @module DB/Effects/Table/ef_sp
 *
 * The effect table's named ef_sp_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Golem's Soul (SP_SOULGOLEM): official effect 1228 (CEZ2STREffect), spawned on the target by the use case
	// after 503 and 424. See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_soulgolem: [
		{
			//EF_SOUL_GOLEM (1228)
			type: 'STR',
			file: 'soul_golem/soul_golem',
			texturePath: 'soul_golem/',
			attachedEntity: true
		}
	],

	// Soul Curse (SP_SOULCURSE): official effect 1238 (CEZ2STREffect), spawned on the target by the use case
	// (result set). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_soulcurse: [
		{
			//EF_SOUL_CURSE (1238)
			type: 'STR',
			file: 'soul_curse/soul_curse',
			texturePath: 'soul_curse/',
			attachedEntity: true
		}
	],

	// Soul Revolution (SP_SOULREVOLVE): official effect 1243 (CEZ2STREffect) and t_방어형.wav, on the target
	// from the use case (result set). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_soulrevolve: [
		{
			//EF_SOUL_REVOLVE (1243)
			type: 'STR',
			file: 'soul_revolve/soul_revolve',
			texturePath: 'soul_revolve/',
			wav: 'effect/t_\xb9\xe6\xbe\xee\xc7\xfc', // t_방어형
			attachedEntity: true
		}
	],

	// Shadow's Soul (SP_SOULSHADOW): official effect 1235, spawned on the target by the use case after 503 and
	// 424. See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_soulshadow: [
		{
			//EF_SOUL_SHADOW (1235): CSpriteEffect, 이팩트\soul_shadow\soul_shadow.spr, 4 ticks a frame, once
			type: 'SPR',
			file: 'soul_shadow/soul_shadow',
			delayFrame: 67, // 4 ticks
			// the client's sprite effects are separate objects: a second packet on the same actor
			// starts its own copy
			stackable: true,
			attachedEntity: true
		}
	],

	// Falcon's Soul (SP_SOULFALCON): official effect 1237, spawned on the target by the use case after 503 and
	// 424. See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_soulfalcon: [
		{
			//EF_SOUL_FALCON (1237): CSpriteEffect, 이팩트\soul_falcon\soul_falcon.spr, 4 ticks a frame, once
			type: 'SPR',
			file: 'soul_falcon/soul_falcon',
			delayFrame: 67, // 4 ticks
			// the client's sprite effects are separate objects: a second packet on the same actor
			// starts its own copy
			stackable: true,
			attachedEntity: true
		}
	],

	// Fairy's Soul (SP_SOULFAIRY): official effect 1236, spawned on the target by the use case after 503 and
	// 424. See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_soulfairy: [
		{
			//EF_SOUL_FAIRY (1236): CSpriteEffect, 이팩트\soul_fairy\soul_fairy.spr, 4 ticks a frame, once
			type: 'SPR',
			file: 'soul_fairy/soul_fairy',
			delayFrame: 67, // 4 ticks
			// the client's sprite effects are separate objects: a second packet on the same actor
			// starts its own copy
			stackable: true,
			attachedEntity: true
		}
	],

	// Curse Explosion (SP_CURSEEXPLOSION): official effect 1233, on the target as each damage packet arrives
	// (skilleffectinfo). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_curseexplosion: [
		{
			//EF_CURSE_EXPLOSION (1233): CSpriteEffect, 이팩트\curse_explosion\curse_explosion.spr, 4 ticks a frame, once
			type: 'SPR',
			file: 'curse_explosion/curse_explosion',
			delayFrame: 67, // 4 ticks
			// the client's sprite effects are separate objects: a second packet on the same actor
			// starts its own copy
			stackable: true,
			attachedEntity: true
		}
	],

	// Soul Curse status (EFST_SOULCURSE 1125): official effect 1362 (CEZ2STREffect, in its "stays" list),
	// spawned with s포이즌버스터.wav when the status starts and removed when it ends. See
	// effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_soulcurse_mark: [
		{
			//1362
			type: 'STR',
			file: 'efst_qscaraba/qscaraba',
			texturePath: 'efst_qscaraba/',
			repeat: true,
			attachedEntity: true
		},
		{
			wav: 'effect/s\xc6\xf7\xc0\xcc\xc1\xf0\xb9\xf6\xbd\xba\xc5\xcd', // s포이즌버스터
			attachedEntity: true
		}
	],

	// Espa (SP_SPA): the skilleffectinfo row's sound, on the caster when the use packet has the result set
	// (its 1204, EF_SMA_BLACK, is SmaBlackEffect.js). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_spa_sound: [
		{
			wav: 'effect/t_\xbf\xa1\xb3\xca\xc1\xf6\xb9\xe6\xc3\xe2', // t_에너지방출
			attachedEntity: true
		}
	],

	// Soul Division (SP_SOULDIVISION): the skilleffectinfo row's sound, on the target as each damage packet
	// arrives (with its 1209, EF_BLINK_BODY: BlinkBody.js). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_souldivision_sound: [
		{
			wav: 'effect/t_\xc4\xa1\xc0\xd7', // t_치잉
			attachedEntity: true
		}
	],

	// Soul Reaper (SP_SOULREAPER): official effect 1234 and ef_signum.wav, on the caster when the use packet
	// has the result set (skilleffectinfo). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_soulreaper: [
		{
			//EF_SOUL_REAPER (1234): CSpriteEffect, 이팩트\soul_reaper\soul_reaper.spr, 4 ticks a frame, once
			type: 'SPR',
			file: 'soul_reaper/soul_reaper',
			delayFrame: 67, // 4 ticks
			// the client's sprite effects are separate objects: a second packet on the same actor
			// starts its own copy
			stackable: true,
			wav: 'effect/ef_signum', // ef_signum
			attachedEntity: true
		}
	],

	// Soul Explosion (SP_SOULEXPLOSION): official effect 1242 and hunter_landmine.wav, on the target as each
	// damage packet arrives (skilleffectinfo; its 1208, EF_ENERGYDRAIN_BLACK, is EnergyDrainEffect.js). See
	// effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_soulexplosion: [
		{
			//EF_SOUL_EXPLOSION (1242): CSpriteEffect, 이팩트\soul_explosion\soul_explosion.spr, 4 ticks a frame, once
			type: 'SPR',
			file: 'soul_explosion/soul_explosion',
			delayFrame: 67, // 4 ticks
			// the client's sprite effects are separate objects: a second packet on the same actor
			// starts its own copy
			stackable: true,
			wav: 'effect/hunter_landmine', // hunter_landmine
			attachedEntity: true
		}
	],

	// Kaute (SP_KAUTE): the use case's sound, at the target when the use packet has the result set (with 1207
	// on the target and 1208 on the caster, EnergyDrainEffect.js). See effect-port/star-emperor-soul-reaper-skills.md.
	ef_sp_kaute_sound: [
		{
			wav: 'effect/\xc8\xed\xb1\xe2', // 흡기
			attachedEntity: true
		}
	]
};
