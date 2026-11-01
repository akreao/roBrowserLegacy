/**
 * Renderer/Effects/BurstPartsSim.js
 *
 * The official client's primitive 89 (kRO 2025-07-16): four thin blades of
 * light from one point, each in a random plane, growing and fading. Effects add
 * them in sets through the helper 0xbd91c0(texture, set, variant): True Sight
 * 386 (variant 3, 12 sets), Sacrifice 366 (variant 0, 5 sets), Head Crush 399
 * (variant 4, 6 sets), Joint Beat 400 (variant 5) and Dust 628.
 *
 * Helper 0xbd91c0, per blade j (0-3) of set i:
 * - angle in its plane i * 7 + j * 90 degrees (variant 3), else i * 22 + j * 90;
 * - plane turned by a random 0-359 degrees;
 * - 12 units up, length 2;
 * - counter 0 (variants 2, 3, 6), else -24: a blade shows once it is above 0.
 *
 * Update (0xb46b50, case 0x59), each tick once the counter is above 0:
 * - variants 2 and 6: alpha +10 up to counter 10, -3 from 12; length +3;
 * - variant 3: alpha +6 up to counter 10, -1 from 12; length +3;
 * - variants 0, 1, 4, 5: alpha +20 up to counter 10, -15 from 13; length x1.15.
 *
 * Draw (0xb69040): each blade is two quads from the centre to the tip, one
 * +-2 degrees wide (+-1 for variant 2) and one +-5 (+-2 for variant 2). For
 * variant 3 both are (250, 250, 250): the narrow one added, the wide one alpha
 * blended. Tips have v = 1, the centre v = 0.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Blades a set, as the client allocates them. */
export const BLADES_PER_SET = 4;

/** Height of the centre, in client units (up is negative). */
export const BURST_HEIGHT = -12;

/** Colour and blend of each quad, by variant: [narrow, wide]. Only variant 3 is used yet. */
export const BURST_LOOKS = {
	3: [
		{ color: [250, 250, 250], blend: 'add' },
		{ color: [250, 250, 250], blend: 'alpha' }
	]
};

const rad = deg => (deg * Math.PI) / 180;

/**
 * @param {number} variant
 * @return {boolean} whether the variant starts its counter at 0
 */
function startsAtZero(variant) {
	return variant === 2 || variant === 3 || variant === 6;
}

/**
 * The blades of `sets` calls to 0xbd91c0, set i passed as the second argument.
 *
 * @param {number} variant
 * @param {number} sets
 * @param {function} [random] 0 <= random() < 1
 * @return {object} burst state
 */
export function createBurst(variant, sets, random = Math.random) {
	const blades = [];
	const step = variant === 3 ? 7 : 22;
	for (let i = 0; i < sets; i++) {
		for (let j = 0; j < BLADES_PER_SET; j++) {
			blades.push({
				angle: i * step + j * 90,
				turn: Math.floor(random() * 360),
				counter: startsAtZero(variant) ? 0 : -24,
				alpha: 0,
				length: 2
			});
		}
	}
	return { variant, blades, ticks: 0 };
}

/**
 * One client tick (60 a second).
 *
 * @param {object} burst
 */
export function stepBurst(burst) {
	const v = burst.variant;
	for (const b of burst.blades) {
		b.counter++;
		if (b.counter <= 0) {
			continue;
		}
		if (v === 2 || v === 6) {
			if (b.counter < 11) {
				b.alpha += 10;
			} else if (b.counter > 11) {
				b.alpha = Math.max(b.alpha - 3, 0);
			}
			b.length += 3;
		} else if (v === 3) {
			if (b.counter < 11) {
				b.alpha += 6;
			} else if (b.counter > 11) {
				b.alpha = Math.max(b.alpha - 1, 0);
			}
			b.length += 3;
		} else {
			if (b.counter < 11) {
				b.alpha += 20;
			} else if (b.counter > 12) {
				b.alpha = Math.max(b.alpha - 15, 0);
			}
			b.length *= 1.15;
		}
	}
	burst.ticks++;
}

/**
 * @param {object} burst
 * @return {boolean} whether a blade can still show
 */
export function burstAlive(burst) {
	return burst.blades.some(b => b.counter <= 0 || b.alpha > 0);
}

/**
 * The four corners of one quad of a blade, in client units around the burst's
 * point: [tip -, tip +, centre, centre].
 *
 * @param {object} blade
 * @param {number} half the quad's half width, in degrees
 * @return {Array<Array<number>>}
 */
export function bladeCorners(blade, half) {
	const tip = deg => {
		const reach = blade.length * Math.cos(rad(deg));
		return [
			Math.cos(rad(blade.turn)) * reach,
			Math.sin(rad(blade.turn)) * reach + BURST_HEIGHT,
			blade.length * Math.sin(rad(deg))
		];
	};
	const centre = [0, BURST_HEIGHT, 0];
	return [tip(blade.angle - half), tip(blade.angle + half), centre, centre];
}

/**
 * Half widths of the two quads, in degrees: [narrow, wide].
 *
 * @param {number} variant
 * @return {Array<number>}
 */
export function bladeWidths(variant) {
	return variant === 2 ? [1, 2] : [2, 5];
}
