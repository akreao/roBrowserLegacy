/**
 * @module DB/Effects/Table/Jobs/Novice/Novice
 *
 * The Novice line's Novice effects: the numbered rows only its skills use, and its
 * named ef_<skill prefix>_* rows. DB/Effects/EffectTable.js joins the parts; its header lists the
 * parameters a row takes. Keep numbered rows in ID order and a skill's named rows together.
 */

export default {
	309: [
		{
			//EF_FIRSTAID	   First Aid: official effect 309
			// One additive pikapika2 billboard, 4 cells across, 2.4 cells up, tinted (150, 150, 250),
			// random roll; alpha 0 -> 80/255 over 20 ticks, held to tick 100, 0 at tick 180 (3 s).
			// Size pulses +-5 % (one pulse every 2 s); it stays where the caster stood at launch.
			type: '2D',
			alphaMax: 80 / 255,
			blendMode: 2,
			file: 'effect/pikapika2.bmp',
			red: 150 / 255,
			green: 150 / 255,
			blue: 250 / 255,
			angleRand: [0, 359],
			fadeInMs: 20 * (1000 / 60),
			fadeOutStartMs: 100 * (1000 / 60),
			duration: 180 * (1000 / 60),
			size: 140,
			sizePulse: { amount: 0.05, degPerTick: 3 },
			posz: 2.4,
			wav: '_heal_effect'
		}
	],

	// Help Angel (NV_HELPANGEL), from the client's own effect folders.
	// The client plays effect\priest_sanctuary.wav, then effects 1367 and 1368 (the floor ring).
	ef_nv_helpangel: [
		{
			type: 'STR',
			file: 'help_angel/help_angel/help_angel',
			texturePath: 'help_angel/help_angel/',
			wav: 'effect/priest_sanctuary'
		},
		{
			type: 'STR',
			file: 'help_angel/help_angel_bottom/help_angel_bottom',
			texturePath: 'help_angel/help_angel_bottom/',
			renderBeforeEntities: true
		}
	]
};
