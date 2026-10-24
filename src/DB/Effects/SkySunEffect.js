/**
 * DB/Effects/SkySunEffect.js
 *
 * The six small sun bursts of Sky Sun (SKE_SKY_SUN), played like the
 * official client: each one at a random spot around the cast position, the
 * next one two 60 Hz ticks after the last.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** How many bursts one cast spawns. */
export const BURST_COUNT = 6;

/** Official world units in one roBrowser cell. */
const UNITS_PER_CELL = 5;

/** Official start delay between two bursts: 32 ms, counted down 16 per 60 Hz tick, so 2 ticks. */
export const BURST_GAP_MS = (2 * 1000) / 60;

/** One burst: the small sunset art, with Sky Sun's own sound. */
export const SKY_SUN_BURST = {
	type: 'STR',
	file: 'sky_emperor/ske_sunset_blast/sunset_blast_small',
	texturePath: 'sky_emperor/ske_sunset_blast/',
	min: 'sky_emperor/ske_sunset_blast/min_sunset_blast_small',
	wav: 'effect/sky_emperor/ske_sky_sun_1',
	ez2PosY: 10,
	attachedEntity: false
};

/**
 * Where and when each burst plays.
 *
 * Each ground axis gets 15 - (a random integer from 0 to 29) official units,
 * so -14 to +15 units, up to 3 cells either way.
 *
 * @param {function} random returns a number in [0, 1)
 * @return {Array<{x: number, y: number, delay: number}>} offsets in cells, delay in ms
 */
export function skySunBursts(random = Math.random) {
	const bursts = [];
	for (let k = 0; k < BURST_COUNT; ++k) {
		const x = (15 - Math.floor(random() * 30)) / UNITS_PER_CELL;
		const y = (15 - Math.floor(random() * 30)) / UNITS_PER_CELL;
		bursts.push({ x, y, delay: (k * 2 * 1000) / 60 });
	}
	return bursts;
}

/**
 * FUNC layer: spawn the bursts around the cast position. Called with the
 * effect manager as `this`.
 *
 * @param {object} Params effect params of the FUNC layer
 */
export function spawnSkySunBursts(Params) {
	const base = Params.Inst.position;
	if (!base) {
		return;
	}
	skySunBursts().forEach((burst, k) => {
		this.spamEffect({
			effect: SKY_SUN_BURST,
			Inst: {
				effectID: Params.Inst.effectID,
				duplicateID: k,
				startTick: Params.Inst.startTick + burst.delay
			},
			Init: Object.assign({}, Params.Init, {
				position: [base[0] + burst.x, base[1] + burst.y, base[2]]
			})
		});
	});
}

export default { BURST_COUNT, BURST_GAP_MS, SKY_SUN_BURST, skySunBursts, spawnSkySunBursts };
