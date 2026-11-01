/**
 * @module DB/Effects/Table/Jobs/Swordman/Knight
 *
 * The Swordman line's Knight effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	70: [
		{
			//EF_BRANDISHSPEAR	Brandish Spear
			attachedEntity: false,
			file: 'brandish',
			type: 'STR',
			wav: 'effect/knight_brandish_spear'
		}
	],

	80: [
		{
			//spear boomerang hit on target	//EF_SPEARBMR	Spear Boomerang
			//type: 'FUNC',
			wav: 'effect/ef_fireball',
			attachedEntity: true
		}
	],

	130: [
		{
			//EF_TWOHANDQUICKEN	Two-Hand Quicken
			type: 'STR',
			file: 'twohand',
			wav: 'effect/knight_twohandquicken',
			head: true,
			attachedEntity: true
		}
	],

	144: [
		{
			//EF_BRANDISH2	Brandish Spear Pre-Hit Effect
			type: 'STR',
			file: 'brandish2',
			wav: 'effect/knight_brandish_spear',
			attachedEntity: true
		}
	],

	148: [
		{
			//EF_PIERCESELF	Pierce Cast Animation
			type: 'STR',
			file: 'pierce',
			attachedEntity: true
			// attach animation at middle of body
		}
	],

	149: [
		{
			//EF_BOWLINGSELF	Bowling Bash
			type: 'STR',
			file: 'bowling',
			wav: '_enemy_hit_normal1', //'effect/knight_bowling_bash', fake
			head: true,
			attachedEntity: true
		}
	],

	150: [
		{
			//EF_SPEARSTABSELF	Pierce Cast Animation
			type: 'STR',
			file: 'spearstab',
			wav: '_enemy_hit_normal1',
			attachedEntity: true
			// attach animation at middle of body
		}
	],

	151: [
		{
			//spear boomerang caster	//EF_SPEARBMRSELF	Spear Boomerang Cast
			type: 'STR',
			file: 'spearboomerang',
			wav: 'effect/knight_spear_boomerang',
			head: true,
			attachedEntity: true
		}
	],

	ef_spear_projectile: [
		{
			type: '3D',
			alphaMax: 1,
			angle: 180,
			attachedEntity: true,
			duration: 140,
			fadeIn: true,
			fadeOut: true,
			spriteName: '\xc3\xa2',
			playSprite: true,
			toSrc: true,
			rotateToTarget: true,
			rotateWithCamera: true,
			size: 100,
			zOffset: 1,
			zIndex: 1
		}
	]
};
