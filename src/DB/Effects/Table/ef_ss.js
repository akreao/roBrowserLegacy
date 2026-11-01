/**
 * @module DB/Effects/Table/ef_ss
 *
 * The effect table's named ef_ss_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Melt Away (SS_TOKEDASU), from the client's own effect folders.
	ef_ss_tokedasu: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_tokedasu/tokedasu/tokedasu',
			texturePath: 'shinkiro_shiranui/ss_tokedasu/tokedasu/',
			min: 'shinkiro_shiranui/ss_tokedasu/tokedasu/min_tokedasu',
			wav: 'effect/shinkiro_shiranui/ss_tokedasu',
			yOffset: 10
		}
	],

	// Infiltrate (SS_SHIMIRU), from the client's own effect folders.
	ef_ss_shimiru: [
		{
			wav: 'effect/shinkiro_shiranui/ss_shimiru',
			attachedEntity: true
		}
	],

	// Nightmare Erasion (SS_AKUMUKESU), from the client's own effect folders.
	ef_ss_akumukesu: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_akumukesu/akumukesu',
			texturePath: 'shinkiro_shiranui/ss_akumukesu/',
			min: 'shinkiro_shiranui/ss_akumukesu/min_akumukesu',
			wav: 'effect/shinkiro_shiranui/ss_akumukesu',
			yOffset: 10
		}
	],

	// Shadow Hunting (SS_KAGEGARI), from the client's own effect folders.
	ef_ss_kagegari: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kagegari/kagegari',
			texturePath: 'shinkiro_shiranui/ss_kagegari/',
			min: 'shinkiro_shiranui/ss_kagegari/min_kagegari',
			wav: 'effect/shinkiro_shiranui/ss_kagegari',
			yOffset: 7
		}
	],

	// Shadow Dance (SS_KAGENOMAI), from the client's own effect folders.
	ef_ss_kagenomai: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kagenomai/kagenomai',
			texturePath: 'shinkiro_shiranui/ss_kagenomai/',
			min: 'shinkiro_shiranui/ss_kagenomai/min_kagenomai',
			wav: 'effect/SHINKIRO_SHIRANUI/SS_KAGEGNOMAI',
			soundLoop: false,
			yOffset: 7
		}
	],

	// Shadow Flash (SS_KAGEGISSEN), from the client's own effect folders.
	ef_ss_kagegissen: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kagegissen/kagegissen',
			texturePath: 'shinkiro_shiranui/ss_kagegissen/',
			min: 'shinkiro_shiranui/ss_kagegissen/min_kagegissen',
			wav: 'effect/shinkiro_shiranui/ss_kagegissen',
			yOffset: 7
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kagegissen/new_kagegissen/new_kagegissen',
			texturePath: 'shinkiro_shiranui/ss_kagegissen/new_kagegissen/',
			wav: 'effect/SHINKIRO_SHIRANUI/new_ss_kagegissen_ready',
			soundLoop: false,
			yOffset: 11
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kagegissen/new_kagegissen_bottom/new_kagegissen_bottom',
			texturePath: 'shinkiro_shiranui/ss_kagegissen/new_kagegissen_bottom/',
			renderBeforeEntities: true,
			yOffset: 11
		}
	],

	// Shadow Flash (SS_KAGEGISSEN), from the client's own effect folders.
	ef_ss_kagegissen_hit: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kagegissen/new_kagegissen_hit/new_kagegissen_hit',
			texturePath: 'shinkiro_shiranui/ss_kagegissen/new_kagegissen_hit/',
			yOffset: 7
		}
	],

	// Huuma Shuriken - Grasp (SS_FUUMASHOUAKU), from the client's own effect folders.
	ef_ss_fuumashouaku: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_fuumashouaku/fuumashouaku/fuumashouaku',
			texturePath: 'shinkiro_shiranui/ss_fuumashouaku/fuumashouaku/',
			min: 'shinkiro_shiranui/ss_fuumashouaku/fuumashouaku/min_fuumashouaku',
			wav: 'effect/shinkiro_shiranui/ss_fuumashouaku'
		}
	],

	// Huuma Shuriken - Construct (SS_FUUMAKOUCHIKU), from the client's own effect folders.
	ef_ss_fuumakouchiku: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_fuumakouchiku/fuumakouchiku/fuumakouchiku',
			texturePath: 'shinkiro_shiranui/ss_fuumakouchiku/fuumakouchiku/',
			min: 'shinkiro_shiranui/ss_fuumakouchiku/fuumakouchiku/min_fuumakouchiku',
			wav: 'effect/shinkiro_shiranui/ss_fuumakouchiku',
			yOffset: 7
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_fuumakouchiku/new_fuumakouchiku/new_fuumakouchiku',
			texturePath: 'shinkiro_shiranui/ss_fuumakouchiku/new_fuumakouchiku/',
			min: 'shinkiro_shiranui/ss_fuumakouchiku/new_fuumakouchiku/min_new_fuumakouchiku',
			yOffset: 7
		}
	],

	// Kunai - Distortion (SS_KUNAIWAIKYOKU), from the client's own effect folders.
	ef_ss_kunaiwaikyoku: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kunaiwaikyoku/kunaiwaikyoku',
			texturePath: 'shinkiro_shiranui/ss_kunaiwaikyoku/',
			min: 'shinkiro_shiranui/ss_kunaiwaikyoku/min_kunaiwaikyoku',
			wav: 'effect/shinkiro_shiranui/ss_kunaiwaikyoku',
			yOffset: 5
		}
	],

	// Kunai - Rotation (SS_KUNAIKAITEN), as the official client plays it on a
	// successful use: the EZ2 rows kunaikaiten_bottom, _00, _01 and _02 (_02 is
	// _00's file again), PosY 10, left where the caster stood, four times 480 ms
	// apart. The client's round delay replaces _02's own 320 ms start delay.
	ef_ss_kunaikaiten: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_bottom/kunaikaiten_bottom',
			texturePath: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_bottom/',
			min: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_bottom/min_kunaikaiten_bottom',
			wav: 'effect/shinkiro_shiranui/ss_kagegissen',
			renderBeforeEntities: true,
			yOffset: 10,
			duplicate: 4,
			timeBetweenDupli: 480
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_00/kunaikaiten_00',
			texturePath: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_00/',
			min: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_00/min_kunaikaiten_00',
			yOffset: 10,
			duplicate: 4,
			timeBetweenDupli: 480
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_01/kunaikaiten_01',
			texturePath: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_01/',
			min: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_01/min_kunaikaiten_01',
			yOffset: 10,
			duplicate: 4,
			timeBetweenDupli: 480
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_00/kunaikaiten_00',
			texturePath: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_00/',
			min: 'shinkiro_shiranui/ss_kunaikaiten/kunaikaiten_00/min_kunaikaiten_00',
			yOffset: 10,
			duplicate: 4,
			timeBetweenDupli: 480
		}
	],

	// Kunai - Refraction (SS_KUNAIKUSSETSU), from the client's own effect folders.
	ef_ss_kunaikussetsu: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kunaikussetsu/kunaikussetsu/kunaikussetsu',
			texturePath: 'shinkiro_shiranui/ss_kunaikussetsu/kunaikussetsu/',
			min: 'shinkiro_shiranui/ss_kunaikussetsu/kunaikussetsu/min_kunaikussetsu',
			wav: 'effect/shinkiro_shiranui/ss_kunaikussetsu',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kunaikussetsu/kunaikussetsu_bottom/kunaikussetsu_bottom',
			texturePath: 'shinkiro_shiranui/ss_kunaikussetsu/kunaikussetsu_bottom/',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],

	// Red Flame Cannon (SS_SEKIENHOU), from the client's own effect folders.
	ef_ss_sekienhou: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_sekienhou/sekienhou',
			texturePath: 'shinkiro_shiranui/ss_sekienhou/',
			min: 'shinkiro_shiranui/ss_sekienhou/min_sekienhou',
			wav: 'effect/shinkiro_shiranui/ss_sekienhou',
			yOffset: 5
		}
	],

	// Cold Blooded Cannon (SS_REIKETSUHOU), from the client's own effect folders.
	ef_ss_reiketsuhou: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_reiketsuhou/reiketsuhou/reiketsuhou',
			texturePath: 'shinkiro_shiranui/ss_reiketsuhou/reiketsuhou/',
			min: 'shinkiro_shiranui/ss_reiketsuhou/reiketsuhou/min_reiketsuhou',
			wav: 'effect/shinkiro_shiranui/ss_reiketsuhou',
			yOffset: 5
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_reiketsuhou/reiketsuhou_bottom/reiketsuhou_bottom',
			texturePath: 'shinkiro_shiranui/ss_reiketsuhou/reiketsuhou_bottom/',
			min: 'shinkiro_shiranui/ss_reiketsuhou/reiketsuhou_bottom/min_reiketsuhou_bottom',
			renderBeforeEntities: true,
			yOffset: 5
		}
	],

	// Thundering Cannon (SS_RAIDENPOU), from the client's own effect folders.
	ef_ss_raidenpou: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou/new_raidenpou',
			texturePath: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou/',
			min: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou/min_new_raidenpou',
			wav: 'effect/shinkiro_shiranui/ss_raidenpou',
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_raidenpou/raidenpou',
			texturePath: 'shinkiro_shiranui/ss_raidenpou/',
			min: 'shinkiro_shiranui/ss_raidenpou/min_raidenpou',
			yOffset: 5
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_bottom/new_raidenpou_bottom',
			texturePath: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_bottom/',
			renderBeforeEntities: true,
			yOffset: 10
		}
	],

	// Thundering Cannon (SS_RAIDENPOU), from the client's own effect folders.
	ef_ss_raidenpou_cast: [
		{
			type: 'STR',
			castLoop: true,
			attachedEntity: true,
			file: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_cast/new_raidenpou_cast',
			texturePath: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_cast/',
			min: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_cast/min_new_raidenpou_cast',
			wav: 'effect/ef_beginspell',
			soundLoop: false,
			yOffset: 8
		}
	],

	// Thundering Cannon (SS_RAIDENPOU), from the client's own effect folders.
	ef_ss_raidenpou_hit: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_hit/new_raidenpou_hit',
			texturePath: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_hit/',
			min: 'shinkiro_shiranui/ss_raidenpou/new_raidenpou_hit/min_new_raidenpou_hit',
			yOffset: 10
		}
	],

	// Golden Dragon Cannon (SS_KINRYUUHOU), from the client's own effect folders.
	ef_ss_kinryuuhou: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kinryuuhou/kinryuuhou/kinryuuhou',
			texturePath: 'shinkiro_shiranui/ss_kinryuuhou/kinryuuhou/',
			min: 'shinkiro_shiranui/ss_kinryuuhou/kinryuuhou/min_kinryuuhou',
			wav: 'effect/shinkiro_shiranui/ss_kinryuuhou',
			yOffset: 5
		}
	],

	// Golden Dragon Cannon (SS_KINRYUUHOU), from the client's own effect folders.
	ef_ss_kinryuuhou_hit: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kinryuuhou/kinryuuhou_hit/kinryuuhou_hit',
			texturePath: 'shinkiro_shiranui/ss_kinryuuhou/kinryuuhou_hit/',
			min: 'shinkiro_shiranui/ss_kinryuuhou/kinryuuhou_hit/min_kinryuuhou_hit',
			yOffset: 5
		}
	],

	// Darkening Cannon (SS_ANTENPOU), from the client's own effect folders.
	ef_ss_antenpou: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_antenpou/antenpou',
			texturePath: 'shinkiro_shiranui/ss_antenpou/',
			min: 'shinkiro_shiranui/ss_antenpou/min_antenpou',
			wav: 'effect/shinkiro_shiranui/ss_antenpou',
			renderBeforeEntities: true,
			yOffset: 5
		}
	],

	// Shadow - Nightmare (SS_KAGEAKUMU), from the client's own effect folders.
	ef_ss_kageakumu: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_kageakumu/kageakumu',
			texturePath: 'shinkiro_shiranui/ss_kageakumu/',
			min: 'shinkiro_shiranui/ss_kageakumu/min_kageakumu',
			yOffset: 10
		}
	],

	// Kunai - Nightmare (SS_HITOUAKUMU): EZ2 rows, placed on the ground where the
	// caster stands (not following), PosY 0. The burst is a floor row.
	ef_ss_hitouakumu: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu/hitouakumu',
			texturePath: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu/',
			min: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu/min_hitouakumu',
			wav: 'effect/shinkiro_shiranui/ss_hitouakumu',
			renderBeforeEntities: true,
			yOffset: 0
		}
	],
	ef_ss_hitouakumu_00: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu_00/hitouakumu_00',
			texturePath: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu_00/',
			min: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu_00/min_hitouakumu_00',
			yOffset: 0
		}
	],
	ef_ss_hitouakumu_01: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu_01/hitouakumu_01',
			texturePath: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu_01/',
			min: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu_01/min_hitouakumu_01',
			yOffset: 0
		}
	],
	ef_ss_hitouakumu_02: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu_02/hitouakumu_02',
			texturePath: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu_02/',
			min: 'shinkiro_shiranui/ss_hitouakumu/hitouakumu_02/min_hitouakumu_02',
			yOffset: 0
		}
	],

	// Dark Dragon - Nightmare (SS_ANKOKURYUUAKUMU), from the client's own effect folders.
	ef_ss_ankokuryuuakumu: [
		{
			wav: 'effect/shinkiro_shiranui/ss_ankokuryuuakumu',
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_ankokuryuuakumu/ankokuryuuakumu_00/ankokuryuuakumu_00',
			texturePath: 'shinkiro_shiranui/ss_ankokuryuuakumu/ankokuryuuakumu_00/',
			min: 'shinkiro_shiranui/ss_ankokuryuuakumu/ankokuryuuakumu_00/min_ankokuryuuakumu_00',
			attachedEntity: true,
			renderBeforeEntities: true,
			yOffset: 5
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_ankokuryuuakumu/ankokuryuuakumu_01/ankokuryuuakumu_01',
			texturePath: 'shinkiro_shiranui/ss_ankokuryuuakumu/ankokuryuuakumu_01/',
			min: 'shinkiro_shiranui/ss_ankokuryuuakumu/ankokuryuuakumu_01/min_ankokuryuuakumu_01',
			wav: 'effect/SHINKIRO_SHIRANUI/SS_ANKOKURYUUAKUMU_1',
			soundLoop: false,
			attachedEntity: true,
			yOffset: 5
		}
	],

	// Four Colors Charm (SS_FOUR_CHARM), one look per charm element (EZ2 rows
	// four_charm_<element>_bottom then four_charm_<element>). SkillEffect picks one
	// from the caster's charm type.
	ef_ss_four_charm_water: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_four_charm/four_charm_ice_bottom/four_charm_ice_bottom',
			texturePath: 'shinkiro_shiranui/ss_four_charm/four_charm_ice_bottom/',
			min: 'shinkiro_shiranui/ss_four_charm/four_charm_ice_bottom/min_four_charm_ice_bottom',
			wav: 'effect/shinkiro_shiranui/ss_four_charm_water',
			xOffset: 0,
			yOffset: 11,
			renderBeforeEntities: true,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_four_charm/four_charm_ice/four_charm_ice',
			texturePath: 'shinkiro_shiranui/ss_four_charm/four_charm_ice/',
			min: 'shinkiro_shiranui/ss_four_charm/four_charm_ice/min_four_charm_ice',
			wav: 'effect/shinkiro_shiranui/ss_four_charm',
			xOffset: 0,
			yOffset: 11,
			attachedEntity: true
		}
	],

	ef_ss_four_charm_earth: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_four_charm/four_charm_earth_bottom/four_charm_earth_bottom',
			texturePath: 'shinkiro_shiranui/ss_four_charm/four_charm_earth_bottom/',
			min: 'shinkiro_shiranui/ss_four_charm/four_charm_earth_bottom/min_four_charm_earth_bottom',
			wav: 'effect/shinkiro_shiranui/ss_four_charm_earth',
			xOffset: 0,
			yOffset: 11,
			renderBeforeEntities: true,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_four_charm/four_charm_earth/four_charm_earth',
			texturePath: 'shinkiro_shiranui/ss_four_charm/four_charm_earth/',
			min: 'shinkiro_shiranui/ss_four_charm/four_charm_earth/min_four_charm_earth',
			wav: 'effect/shinkiro_shiranui/ss_four_charm',
			xOffset: 0,
			yOffset: 11,
			attachedEntity: true
		}
	],

	ef_ss_four_charm_fire: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_four_charm/four_charm_fire_bottom/four_charm_fire_bottom',
			texturePath: 'shinkiro_shiranui/ss_four_charm/four_charm_fire_bottom/',
			min: 'shinkiro_shiranui/ss_four_charm/four_charm_fire_bottom/min_four_charm_fire_bottom',
			wav: 'effect/shinkiro_shiranui/ss_four_charm_fire',
			xOffset: 0,
			yOffset: 11,
			renderBeforeEntities: true,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_four_charm/four_charm_fire/four_charm_fire',
			texturePath: 'shinkiro_shiranui/ss_four_charm/four_charm_fire/',
			min: 'shinkiro_shiranui/ss_four_charm/four_charm_fire/min_four_charm_fire',
			wav: 'effect/shinkiro_shiranui/ss_four_charm',
			xOffset: 0,
			yOffset: 11,
			attachedEntity: true
		}
	],

	ef_ss_four_charm_wind: [
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_four_charm/four_charm_wind_bottom/four_charm_wind_bottom',
			texturePath: 'shinkiro_shiranui/ss_four_charm/four_charm_wind_bottom/',
			min: 'shinkiro_shiranui/ss_four_charm/four_charm_wind_bottom/min_four_charm_wind_bottom',
			wav: 'effect/shinkiro_shiranui/ss_four_charm_wind',
			xOffset: 0,
			yOffset: 11,
			renderBeforeEntities: true,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'shinkiro_shiranui/ss_four_charm/four_charm_wind/four_charm_wind',
			texturePath: 'shinkiro_shiranui/ss_four_charm/four_charm_wind/',
			min: 'shinkiro_shiranui/ss_four_charm/four_charm_wind/min_four_charm_wind',
			wav: 'effect/shinkiro_shiranui/ss_four_charm',
			xOffset: 0,
			yOffset: 11,
			attachedEntity: true
		}
	]
};
