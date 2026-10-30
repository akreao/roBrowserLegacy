/**
 * Renderer/Effects/SmaSwirl.js
 *
 * Draws one of Espa's dark swirls (effect 1205): three spinning ring_blue.tga
 * bands opening like petals around a point, blended dark grey, through
 * AuraBatch.js. The numbers are in SmaSwirlSim.js. Effect 1204 launches them
 * along its way from the caster to the target.
 *
 * Effect table entry (1204):
 *   { type: 'FUNC', func(Params) {
 *       planSwirls().forEach(swirl => this.add(new SmaSwirl(...), Params));
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import AuraBatch, { sharedTexture, freeSharedTextures } from 'Renderer/Effects/AuraBatch.js';
import { BLEND_ALPHA } from 'Renderer/Effects/AuraBlend.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { SWIRL, bandAlpha, bandPoints } from 'Renderer/Effects/SmaSwirlSim.js';

const _batch = new AuraBatch({ fog: true, mergeAdditive: true });
const _textures = new Map();

const TEXTURE = 'ring_blue.tga';

const R = SWIRL.color[0] / 255;
const G = SWIRL.color[1] / 255;
const B = SWIRL.color[2] / 255;

const QUADS = SWIRL.points - 1;
const INDICES = new Uint16Array(QUADS * 6);
for (let q = 0; q < QUADS; q++) {
	const v = q * 4;
	INDICES.set([v, v + 1, v + 2, v, v + 2, v + 3], q * 6);
}

/**
 * A band's quads, in cells and GL axes around its centre: for each, the
 * previous inner point, this inner point, this outer point and the previous
 * outer one. u runs along the arc in twentieths, v from inner (1) to outer (0).
 *
 * @param {Array} points from bandPoints
 * @param {Float32Array} [out]
 * @return {Float32Array} x, y, z, u, v each
 */
export function bandVertices(points, out = new Float32Array(QUADS * 4 * 5)) {
	let o = 0;
	const put = (p, u, v) => {
		out[o++] = p[0] / UNITS_PER_CELL;
		out[o++] = p[1] / UNITS_PER_CELL;
		out[o++] = p[2] / UNITS_PER_CELL;
		out[o++] = u;
		out[o++] = v;
	};
	for (let i = 1; i < SWIRL.points; i++) {
		const j = Math.min(i, SWIRL.heights - 1);
		const u0 = (j - 1) / (SWIRL.heights - 1);
		const u1 = j / (SWIRL.heights - 1);
		put(points[i - 1].inner, u0, 1);
		put(points[i].inner, u1, 1);
		put(points[i].outer, u1, 0);
		put(points[i - 1].outer, u0, 0);
	}
	return out;
}

class SmaSwirl {
	/**
	 * @param {Array} position the swirl's point, cells [x, y, z]
	 * @param {number} up units above that point
	 * @param {number} startTick
	 */
	constructor(position, up, startTick) {
		this.position = [position[0], position[1], position[2]];
		this.up = up || 0;
		this.startTick = startTick || 0;
		this.vertices = new Float32Array(QUADS * 4 * 5);
	}

	init(gl) {
		// Ready whether it loads or not: it still runs out and is cleaned up.
		sharedTexture(
			_textures,
			gl,
			TEXTURE,
			texture => {
				this.texture = texture;
				this.ready = true;
			},
			() => {
				this.ready = true;
			}
		);
	}

	free() {
		this.ready = false;
	}

	render(gl, tick) {
		if (tick < this.startTick) {
			return;
		}
		// The client updates before it draws, so the first frame is one tick on.
		const n = Math.floor((tick - this.startTick) / PRIM_TICK_MS) + 1;
		if (n > SWIRL.life) {
			this.needCleanUp = true;
			return;
		}
		if (!_batch.active || !this.texture) {
			return;
		}
		const alpha = bandAlpha(n) / 255;
		if (alpha <= 0) {
			return;
		}
		const pos = this.position;
		const x = pos[0] + 0.5;
		// The client's y runs down, as GL y does here.
		const y = -pos[2] - this.up / UNITS_PER_CELL;
		const z = pos[1] + 0.5;
		for (let k = 0; k < SWIRL.bands; k++) {
			bandVertices(bandPoints(k, n), this.vertices);
			_batch.mesh(this.texture, BLEND_ALPHA, this.vertices, QUADS * 4, INDICES, x, y, z, R, G, B, alpha, 0);
		}
	}

	static init() {
		this.ready = true;
		this.renderBeforeEntities = false;
	}

	static free(gl) {
		_batch.free(gl);
		freeSharedTextures(_textures, gl);
		this.ready = false;
	}

	static beforeRender(gl, modelView, projection, fog) {
		_batch.begin(gl, modelView, projection, fog);
		// Drawn only through the batch, whatever auraBatching says.
		if (!_batch.active && typeof gl.createVertexArray === 'function') {
			_batch.active = true;
			_batch.modelView.set(modelView);
			_batch.projection.set(projection);
			_batch.fog.use = !!(fog.use && fog.exist);
			_batch.fog.near = fog.near;
			_batch.fog.far = fog.far;
			_batch.fog.color.set(fog.color);
		}
	}

	static afterRender(gl) {
		_batch.flush(gl);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
}

export default SmaSwirl;
