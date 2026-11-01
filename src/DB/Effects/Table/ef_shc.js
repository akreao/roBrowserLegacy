/**
 * @module DB/Effects/Table/ef_shc
 *
 * The effect table's named ef_shc_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Shadow Exceed (SHC_SHADOW_EXCEED), from the client's own effect folders.
	ef_shc_shadow_exceed_cast: [
		{
			type: 'STR',
			file: 'shadow_cross/shc_shadow_exceed/shadow_exceed_cast/shadow_exceed_cast',
			texturePath: 'shadow_cross/shc_shadow_exceed/shadow_exceed_cast/',
			min: 'shadow_cross/shc_shadow_exceed/shadow_exceed_cast/min_shadow_exceed_cast',
			fallback: ['shadow_exceed/shadow_exceed_cast/shadow_exceed_cast'],
			wav: 'effect/shc_shadow_exceed',
			yOffset: 11
		}
	],

	// Dancing Knife (SHC_DANCING_KNIFE), from the client's own effect folders.
	ef_shc_dancing_knife_cast: [
		{
			type: 'STR',
			file: 'shadow_cross/shc_dancing_knife/dancing_knife_cast/dancing_knife_cast',
			texturePath: 'shadow_cross/shc_dancing_knife/dancing_knife_cast/',
			fallback: ['dancing_knife/dancing_knife_cast/dancing_knife_cast'],
			wav: 'effect/shc_dancing_knife',
			yOffset: 7
		},
		{
			type: 'STR',
			file: 'shadow_cross/shc_dancing_knife/dancing_knife_cast_bottom/dancing_knife_cast_bottom',
			texturePath: 'shadow_cross/shc_dancing_knife/dancing_knife_cast_bottom/',
			fallback: ['dancing_knife/dancing_knife_cast_bottom/dancing_knife_cast_bottom'],
			renderBeforeEntities: true,
			yOffset: 7
		}
	],

	// Savage Impact (SHC_SAVAGE_IMPACT), from the client's own effect folders.
	ef_shc_savage_impact: [
		{
			type: 'STR',
			file: 'savage_impact/savage_impact/savage_impact',
			texturePath: 'savage_impact/savage_impact/',
			min: 'savage_impact/savage_impact/min_savage_impact',
			wav: 'effect/shc_savage_impact'
		}
	],

	// Savage Impact (SHC_SAVAGE_IMPACT), from the client's own effect folders.
	ef_shc_savage_impact_hit: [
		{
			type: 'STR',
			file: 'savage_impact/savage_impact_hit/savage_impact_hit',
			texturePath: 'savage_impact/savage_impact_hit/',
			min: 'savage_impact/savage_impact_hit/min_savage_impact_hit'
		}
	],

	// Eternal Slash (SHC_ETERNAL_SLASH), from the client's own effect folders.
	ef_shc_eternal_slash: [
		{
			type: 'STR',
			file: 'eternal_slash/eternal_slash/eternal_slash',
			texturePath: 'eternal_slash/eternal_slash/',
			min: 'eternal_slash/eternal_slash/min_eternal_slash',
			wav: 'effect/shc_eternal_slash'
		},
		{
			type: 'STR',
			file: 'eternal_slash/eternal_slash_bottom/eternal_slash_bottom',
			texturePath: 'eternal_slash/eternal_slash_bottom/',
			min: 'eternal_slash/eternal_slash_bottom/min_eternal_slash_bottom',
			renderBeforeEntities: true
		}
	],

	// Eternal Slash (SHC_ETERNAL_SLASH), from the client's own effect folders.
	ef_shc_eternal_slash_hit: [
		{
			type: 'STR',
			file: 'eternal_slash/eternal_slash_hit/eternal_slash_hit',
			texturePath: 'eternal_slash/eternal_slash_hit/',
			min: 'eternal_slash/eternal_slash_hit/min_eternal_slash_hit'
		}
	],

	// Potent Venom (SHC_POTENT_VENOM), from the client's own effect folders.
	ef_shc_potent_venom: [
		{
			type: 'STR',
			file: 'new_potent_venom/new_potent_venom',
			texturePath: 'new_potent_venom/',
			min: 'new_potent_venom/min_new_potent_venom',
			wav: 'effect/shc_potent_venom'
		}
	],

	// Shadow Stab (SHC_SHADOW_STAB), as the official client plays it: the stab
	// on the caster, turned on screen towards the target (EZ2 shadow_stab,
	// PosY 4), then shadow_stab_hit1 on the target for each hit (PosY 5, no
	// sound). The client never plays shadow_stab_hit2.
	ef_shc_shadow_stab: [
		{
			type: 'STR',
			file: 'shadow_cross/shc_shadow_stab/shadow_stab/shadow_stab',
			texturePath: 'shadow_cross/shc_shadow_stab/shadow_stab/',
			fallback: ['shadow_stab/shadow_stab/shadow_stab'],
			wav: 'effect/shc_shadow_stab',
			xOffset: 0,
			yOffset: 4,
			// The stab runs to the right of the caster in the file
			rotateToTarget: true,
			facing: 0
		}
	],
	ef_shc_shadow_stab_hit: [
		{
			type: 'STR',
			file: 'shadow_cross/shc_shadow_stab/shadow_stab_hit1/shadow_stab_hit1',
			texturePath: 'shadow_cross/shc_shadow_stab/shadow_stab_hit1/',
			min: 'shadow_cross/shc_shadow_stab/shadow_stab_hit1/min_shadow_stab_hit1',
			fallback: ['shadow_stab/shadow_stab_hit1/shadow_stab_hit1'],
			xOffset: 0,
			yOffset: 5
		}
	],

	// Impact Crater (SHC_IMPACT_CRATER), from the client's own effect folders.
	ef_shc_impact_crater: [
		{
			type: 'STR',
			file: 'shadow_cross/shc_impact_crater/impact_crater/impact_crater',
			texturePath: 'shadow_cross/shc_impact_crater/impact_crater/',
			min: 'shadow_cross/shc_impact_crater/impact_crater/min_impact_crater',
			fallback: ['impact_crater/impact_crater/impact_crater'],
			wav: 'effect/shc_impact_crater',
			yOffset: 11
		},
		{
			type: 'STR',
			file: 'shadow_cross/shc_impact_crater/impact_crater_bottom/impact_crater_bottom',
			texturePath: 'shadow_cross/shc_impact_crater/impact_crater_bottom/',
			min: 'shadow_cross/shc_impact_crater/impact_crater_bottom/min_impact_crater_bottom',
			fallback: ['impact_crater/impact_crater_bottom/impact_crater_bottom'],
			renderBeforeEntities: true,
			yOffset: 11
		}
	],

	// Impact Crater (SHC_IMPACT_CRATER), from the client's own effect folders.
	ef_shc_impact_crater_hit: [
		{
			type: 'STR',
			file: 'shadow_cross/shc_impact_crater/impact_crater_hit/impact_crater_hit',
			texturePath: 'shadow_cross/shc_impact_crater/impact_crater_hit/',
			min: 'shadow_cross/shc_impact_crater/impact_crater_hit/min_impact_crater_hit',
			wav: 'effect/SHC_IMPACT_CRATER',
			soundLoop: false,
			fallback: ['impact_crater/impact_crater_hit/impact_crater_hit'],
			renderBeforeEntities: true,
			yOffset: 5
		}
	],

	// Enchanting Shadow (SHC_ENCHANTING_SHADOW), from the client's own effect folders.
	ef_shc_enchanting_shadow: [
		{
			type: 'STR',
			file: 'shadow_cross/shc_enchanting_shadow/enchanting_shadow/enchanting_shadow',
			texturePath: 'shadow_cross/shc_enchanting_shadow/enchanting_shadow/',
			min: 'shadow_cross/shc_enchanting_shadow/enchanting_shadow/min_enchanting_shadow',
			wav: 'effect/EF_BeginSpell',
			soundLoop: false,
			fallback: ['enchanting_shadow/enchanting_shadow/new_enchanting_shadow'],
			yOffset: 10
		},
		{
			type: 'STR',
			file: 'shadow_cross/shc_enchanting_shadow/enchanting_shadow_bottom/enchanting_shadow_bottom',
			texturePath: 'shadow_cross/shc_enchanting_shadow/enchanting_shadow_bottom/',
			min: 'shadow_cross/shc_enchanting_shadow/enchanting_shadow_bottom/min_enchanting_shadow_bottom',
			fallback: ['enchanting_shadow/enchanting_shadow_bottom/new_enchanting_shadow_bottom'],
			renderBeforeEntities: true,
			yOffset: 10
		}
	],

	// Fatal Shadow Crow (SHC_FATAL_SHADOW_CROW), from the client's own effect folders.
	ef_shc_fatal_shadow_crow: [
		{
			type: 'STR',
			file: 'fatal_shadow_crow/fatal_shadow_crow/fatal_shadow_crow',
			texturePath: 'fatal_shadow_crow/fatal_shadow_crow/',
			min: 'fatal_shadow_crow/fatal_shadow_crow/min_fatal_shadow_crow',
			wav: 'effect/shc_fatal_shadow_crow'
		},
		{
			type: 'STR',
			file: 'fatal_shadow_crow/fatal_shadow_crow_bottom/fatal_shadow_crow_bottom',
			texturePath: 'fatal_shadow_crow/fatal_shadow_crow_bottom/',
			min: 'fatal_shadow_crow/fatal_shadow_crow_bottom/min_fatal_shadow_crow_bottom',
			renderBeforeEntities: true
		}
	],

	// Fatal Shadow Crow (SHC_FATAL_SHADOW_CROW), from the client's own effect folders.
	ef_shc_fatal_shadow_crow_hit: [
		{
			type: 'STR',
			file: 'fatal_shadow_crow/fatal_shadow_crow_hit/fatal_shadow_crow_hit',
			texturePath: 'fatal_shadow_crow/fatal_shadow_crow_hit/',
			min: 'fatal_shadow_crow/fatal_shadow_crow_hit/min_fatal_shadow_crow_hit'
		}
	],

	// Cross Slash (SHC_CROSS_SLASH), from the client's own effect folders.
	ef_shc_cross_slash: [
		{
			type: 'STR',
			file: 'shadow_cross/shc_cross_slash/cross_slash/cross_slash',
			texturePath: 'shadow_cross/shc_cross_slash/cross_slash/',
			min: 'shadow_cross/shc_cross_slash/cross_slash/min_cross_slash',
			wav: 'effect/shc_cross_slash',
			yOffset: 11
		}
	]
};
