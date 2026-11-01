/**
 * @module DB/Effects/Table/ef_su
 *
 * The effect table's named ef_su_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

import Camera from 'Renderer/Camera.js';

export default {
	// Bite (SU_BITE), from the client's own effect folders.
	ef_su_bite: [
		{
			type: 'STR',
			file: 'su_bite/su_bite',
			texturePath: 'su_bite/'
		}
	],

	// Scratch (SU_SCRATCH), from the client's own effect folders.
	ef_su_scratch: [
		{
			type: 'STR',
			file: 'su_scratch/su_scratch',
			texturePath: 'su_scratch/',
			wav: 'effect/su_scratch'
		}
	],

	// Silvervine Stem Spear (SU_SV_STEMSPEAR): effect 1101, left where the caster
	// stands when the damage packet arrives, start sound su_stemspear.wav.
	ef_su_sv_stemspear: [
		{
			type: 'STR',
			file: 'su_sv_stemspear/su_sv_stemspear',
			texturePath: 'su_sv_stemspear/',
			wav: 'effect/su_stemspear'
		}
	],

	// Scar of Tarou (SU_SCAROFTAROU), from the client's own effect folders.
	ef_su_scaroftarou: [
		{
			type: 'STR',
			file: 'su_scaroftarou/su_scaroftarou',
			texturePath: 'su_scaroftarou/',
			wav: 'effect/su_scaroftarou'
		}
	],

	// Bite scar (status BITESCAR, from Scar of Tarou): effect 1119, bite_scar.str
	// once on the actor when the status starts, removed when it ends.
	ef_su_bitescar: [
		{
			type: 'STR',
			file: 'bite_scar/bite_scar',
			texturePath: 'bite_scar/',
			attachedEntity: true
		}
	],

	// Catnip Meteor (SU_CN_METEOR): effect 1106 at each meteor's cell, one ground
	// packet per meteor. The official client plays su_cn_meteor.spr once, 4 ticks a
	// frame, at alpha 100 of 255, and shakes the camera when it is 48 ticks old.
	ef_su_cn_meteor: [
		{
			type: 'SPR',
			file: 'su_cn_meteor/su_cn_meteor',
			delayFrame: (4 * 1000) / 60,
			opacity: 100 / 255
		},
		{
			type: 'FUNC',
			func: Params => {
				Camera.setQuake(Params.Inst.startTick + (48 * 1000) / 60);
			}
		}
	],

	// Catnip Meteor with the item (SU_CN_METEOR2): effect 1112, the same meteor at
	// full alpha.
	ef_su_cn_meteor2: [
		{
			type: 'SPR',
			file: 'su_cn_meteor/su_cn_meteor',
			delayFrame: (4 * 1000) / 60
		},
		{
			type: 'FUNC',
			func: Params => {
				Camera.setQuake(Params.Inst.startTick + (48 * 1000) / 60);
			}
		}
	],

	// Silvervine Root Twist (status SV_ROOTTWIST): effect 1110, the official client's
	// su_sv_roottwist.spr on the actor for as long as the status lasts, 3 units below
	// it, 8 ticks a frame, with su_roottwist.wav when it starts.
	ef_su_roottwist: [
		{
			type: 'SPR',
			file: 'su_sv_roottwist/su_sv_roottwist',
			wav: 'effect/su_roottwist',
			attachedEntity: true,
			repeat: true,
			delayFrame: (8 * 1000) / 60,
			yOffset: 3 * 7
		}
	],

	// Picky Peck (SU_PICKYPECK), from the client's own effect folders.
	ef_su_pickypeck: [
		{
			type: 'STR',
			file: 'su_pickypeck/su_pickypeck',
			texturePath: 'su_pickypeck/',
			wav: 'effect/su_pickypeck'
		}
	],

	// Arclouse Dash (SU_ARCLOUSEDASH), from the client's own effect folders.
	ef_su_arclousedash: [
		{
			type: 'STR',
			file: 'su_arclousedash/su_arclousedash',
			texturePath: 'su_arclousedash/'
		}
	],

	// Tuna Belly (SU_TUNABELLY): the official client plays su_tunabelly.str only
	// (effect 1102, start sound su_tunabelly.wav); the folder's su_scratch.str is unused.
	ef_su_tunabelly: [
		{
			type: 'STR',
			file: 'su_tunabelly/su_tunabelly',
			texturePath: 'su_tunabelly/',
			wav: 'effect/su_tunabelly'
		}
	],

	// Bunch of Shrimp (SU_BUNCHOFSHRIMP): effect 1116; the official client's start
	// sound is spelled su_brunchofshrimp.wav.
	ef_su_bunchofshrimp: [
		{
			type: 'STR',
			file: 'su_bunchofshrimp/su_bunchofshrimp',
			texturePath: 'su_bunchofshrimp/',
			wav: 'effect/su_brunchofshrimp'
		}
	],

	// Fresh Shrimp (SU_FRESHSHRIMP), from the client's own effect folders.
	ef_su_freshshrimp: [
		{
			type: 'STR',
			file: 'su_freshshrimp/su_freshshrimp',
			texturePath: 'su_freshshrimp/'
		}
	],

	// Tasty Shrimp Party (SU_SHRIMPARTY): the official client plays Fresh Shrimp's
	// STR (effect 1098) with su_shrimpparty.wav, from skilleffectinfo.
	ef_su_shrimparty: [
		{
			type: 'STR',
			file: 'su_freshshrimp/su_freshshrimp',
			texturePath: 'su_freshshrimp/',
			wav: 'effect/su_shrimpparty'
		}
	],

	// Power of Flock (SU_POWEROFFLOCK), from the client's own effect folders.
	ef_su_powerofflock: [
		{
			type: 'STR',
			file: 'su_powerofflock/su_powerofflock',
			texturePath: 'su_powerofflock/',
			wav: 'effect/su_powerofflock'
		}
	],

	// Spirit of Savage (SU_SVG_SPIRIT), from the client's own effect folders.
	ef_su_svg_spirit: [
		{
			type: 'STR',
			file: 'su_svg_spirit/su_svg_spirit',
			texturePath: 'su_svg_spirit/',
			wav: 'effect/su_svg_spirit'
		}
	],

	// Hiss (SU_HISS), from the client's own effect folders.
	ef_su_hiss: [
		{
			type: 'STR',
			file: 'su_hiss/su_hiss',
			texturePath: 'su_hiss/',
			wav: 'effect/su_hiss'
		}
	],

	// Grooming (SU_GROOMING), from the client's own effect folders.
	ef_su_grooming: [
		{
			type: 'STR',
			file: 'su_grooming/su_grooming',
			texturePath: 'su_grooming/',
			wav: 'effect/su_grooming'
		}
	],

	// Chattering (SU_CHATTERING), from the client's own effect folders.
	ef_su_chattering: [
		{
			type: 'STR',
			file: 'su_chattering/su_chattering',
			texturePath: 'su_chattering/',
			wav: 'effect/su_chattering'
		}
	]
};
