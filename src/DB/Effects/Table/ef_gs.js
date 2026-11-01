/**
 * @module DB/Effects/Table/ef_gs
 *
 * The effect table's named ef_gs_* rows. DB/Effects/EffectTable.js joins the parts;
 * its header lists the parameters a row takes. Keep a skill's rows together.
 */

import { increasingAccuracyEffect } from 'DB/Effects/AgilityEffect.js';

export default {
	// Increasing Accuracy (GS_INCREASING): the official client's effect 456, its sound and 50 faint rising
	// streaks (AgilityEffect.js). roBrowser's 456 row is monster Power Up's. See effect-port/gunslinger-skills.md.
	ef_gs_increasing_accuracy: increasingAccuracyEffect,

	// Cracker (GS_CRACKER): the official client's use-packet sound. See effect-port/gunslinger-skills.md.
	ef_gs_cracker: [
		{
			wav: 'effect/\xc5\xa9\xb7\xa1\xc4\xbf', // 크래커
			attachedEntity: true
		}
	],

	// Ground Drift (GS_GROUNDDRIFT): the official client's ground-packet sound, not positioned.
	ef_gs_ground_drift: [
		{
			wav: 'effect/\xb1\xd7\xb6\xf3\xbf\xee\xb5\xe5', // 그라운드
			attachedEntity: true
		}
	],

	// Increasing Accuracy (GS_INCREASING), from the client's own effect folders.
	ef_gs_increasing: [
		{
			type: 'STR',
			file: 'increasing_activity/increasing_activity/increasing_activity',
			texturePath: 'increasing_activity/increasing_activity/',
			min: 'increasing_activity/increasing_activity/min_increasing_activity'
		}
	],

	// Increasing Accuracy (GS_INCREASING), from the client's own effect folders.
	ef_gs_increasing_cast: [
		{
			type: 'STR',
			file: 'increasing_activity/increasing_activity_cast/increasing_activity_cast',
			texturePath: 'increasing_activity/increasing_activity_cast/',
			min: 'increasing_activity/increasing_activity_cast/min_increasing_activity_cast'
		},
		{
			type: 'STR',
			file: 'increasing_activity/increasing_activity_cast_bottom/increasing_activity_cast_bottom',
			texturePath: 'increasing_activity/increasing_activity_cast_bottom/',
			min: 'increasing_activity/increasing_activity_cast_bottom/min_increasing_activity_cast_bottom',
			renderBeforeEntities: true
		}
	]
};
