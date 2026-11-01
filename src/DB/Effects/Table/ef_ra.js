/**
 * @module DB/Effects/Table/ef_ra
 *
 * The effect table's named ef_ra_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

export default {
	// Arrow Storm (RA_ARROWSTORM): arrowstorm.wav, with 1293 as the damage arrives. See effect-port/ranger-skills.md.
	ef_ra_arrowstorm_sound: [
		{
			wav: 'arrowstorm',
			attachedEntity: true
		}
	],

	// Electric Shocker (RA_ELECTRICSHOCKER): hunter_shockwavetrap.wav, on the target as each damage packet arrives. See effect-port/ranger-skills.md.
	ef_ra_electricshocker_sound: [
		{
			wav: 'effect/hunter_shockwavetrap',
			attachedEntity: true
		}
	],

	// Cluster Bomb (RA_CLUSTERBOMB): hunter_landmine.wav, on the target as each damage packet arrives. See effect-port/ranger-skills.md.
	ef_ra_clusterbomb_sound: [
		{
			wav: 'effect/hunter_landmine',
			attachedEntity: true
		}
	],

	// Firing Trap (RA_FIRINGTRAP): 폭염룡.wav, on the target as each damage packet arrives. See effect-port/ranger-skills.md.
	ef_ra_firingtrap_sound: [
		{
			wav: 'effect/\xc6\xf8\xbf\xb0\xb7\xe6', // 폭염룡.wav
			attachedEntity: true
		}
	],

	// Icebound Trap (RA_ICEBOUNDTRAP): ef_frostdiver.wav, on the target as each damage packet arrives. See effect-port/ranger-skills.md.
	ef_ra_iceboundtrap_sound: [
		{
			wav: 'effect/ef_frostdiver',
			attachedEntity: true
		}
	],

	// Warg Mastery (RA_WUGMASTERY): wolf_attack.wav when the use packet succeeds. See effect-port/ranger-skills.md.
	ef_ra_wugmastery_sound: [
		{
			wav: 'wolf_attack',
			attachedEntity: true
		}
	],

	// Sensitive Keen (RA_SENSITIVEKEEN): were_wolf_attack.wav as each damage packet's damage arrives. See effect-port/ranger-skills.md.
	ef_ra_sensitivekeen_sound: [
		{
			wav: 'were_wolf_attack',
			attachedEntity: true
		}
	],

	// Unlimit (RA_UNLIMIT): the client's EZ2 rows unlimit and unlimit_bottom (PosY 12, the bottom one a floor
	// effect, ra_unlimit.wav on the top one), on the caster when the use packet succeeds. See effect-port/ranger-skills.md.
	ef_ra_unlimit: [
		{
			type: 'STR',
			file: 'ranger/unlimit/unlimit/unlimit',
			texturePath: 'ranger/unlimit/unlimit/',
			min: 'ranger/unlimit/unlimit/min_unlimit',
			wav: 'effect/ra_unlimit',
			yOffset: 12,
			attachedEntity: true
		},
		{
			type: 'STR',
			file: 'ranger/unlimit/unlimit_bottom/unlimit_bottom',
			texturePath: 'ranger/unlimit/unlimit_bottom/',
			min: 'ranger/unlimit/unlimit_bottom/min_unlimit_bottom',
			yOffset: 12,
			renderBeforeEntities: true,
			attachedEntity: true
		}
	]
};
