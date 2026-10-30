/**
 * Renderer/Effects/UnityLink.js
 *
 * Draws Soul Unity's link (effect 1210): two cloud11.tga tubes, yellow
 * inside and blue outside, added, from the target to the caster, through
 * AuraBatch.js. It follows both. The numbers are in UnityLinkSim.js.
 *
 * Effect table entry:
 *   { type: 'FUNC', func(Params) {
 *       this.add(new UnityLink(Params.Init.ownerEntity, Params.Init.otherEntity, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import AuraBatch, { sharedTexture, freeSharedTextures } from 'Renderer/Effects/AuraBatch.js';
import { BLEND_ADD } from 'Renderer/Effects/AuraBlend.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { LINK, linkAlpha, linkWidth, linkReach, linkRing } from 'Renderer/Effects/UnityLinkSim.js';

const _batch = new AuraBatch({ fog: true, mergeAdditive: true });
const _textures = new Map();

const TEXTURE = 'cloud11.tga';

const SIDES = LINK.sides;
const VERTICES = SIDES * 4;
const INDICES = new Uint16Array(SIDES * 6);
for (let k = 0; k < SIDES; k++) {
	const v = k * 4;
	INDICES.set([v, v + 1, v + 2, v, v + 2, v + 3], k * 6);
}

/**
 * The vertices of a tube from (0, 0, 0) to `end`, in cells and GL axes: a quad
 * a side, u around, v from the start (1) to the end (0).
 *
 * @param {Array} end [x, y, z] in cells
 * @param {Array} dir unit direction on the map, [x, z]
 * @param {number} radius units
 * @param {Float32Array} [out]
 * @return {Float32Array}
 */
export function linkTubeVertices(end, dir, radius, out = new Float32Array(VERTICES * 5)) {
	const ring = linkRing(dir, radius);
	let o = 0;
	const put = (p, x, y, z, u, v) => {
		out[o++] = p[0] / UNITS_PER_CELL + x;
		out[o++] = p[1] / UNITS_PER_CELL + y;
		out[o++] = p[2] / UNITS_PER_CELL + z;
		out[o++] = u;
		out[o++] = v;
	};
	for (let k = 1; k <= SIDES; k++) {
		put(ring[k - 1], 0, 0, 0, 0, 1);
		put(ring[k], 0, 0, 0, 1, 1);
		put(ring[k], end[0], end[1], end[2], 1, 0);
		put(ring[k - 1], end[0], end[1], end[2], 0, 0);
	}
	return out;
}

class UnityLink {
	/**
	 * @param {Entity} from the target
	 * @param {Entity} to the caster
	 * @param {number} startTick
	 */
	constructor(from, to, startTick) {
		this.from = from;
		this.to = to;
		this.startTick = startTick || 0;
		this.vertices = new Float32Array(VERTICES * 5);
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
		if (n > LINK.life || !this.from || !this.to) {
			this.needCleanUp = true;
			return;
		}
		if (!_batch.active || !this.texture) {
			return;
		}
		const a = this.from.position;
		const b = this.to.position;
		const dx = b[0] - a[0];
		const dz = b[1] - a[1];
		const length = Math.hypot(dx, dz);
		const dir = length ? [dx / length, dz / length] : [1, 0];
		const reach = linkReach(n);
		// From the target, 8 units up (GL y runs as the client's, down), to the caster.
		const x = a[0] + 0.5;
		const y = -a[2] - LINK.up / UNITS_PER_CELL;
		const z = a[1] + 0.5;
		const end = [dx * reach, (a[2] - b[2]) * reach, dz * reach];
		const width = linkWidth(n);
		const alpha = linkAlpha(n) / 255;

		const inner = LINK.inner;
		linkTubeVertices(end, dir, width, this.vertices);
		_batch.mesh(
			this.texture,
			BLEND_ADD,
			this.vertices,
			VERTICES,
			INDICES,
			x,
			y,
			z,
			inner[0] / 255,
			inner[1] / 255,
			inner[2] / 255,
			alpha,
			0
		);
		const outer = LINK.outer;
		linkTubeVertices(end, dir, width * 2, this.vertices);
		_batch.mesh(
			this.texture,
			BLEND_ADD,
			this.vertices,
			VERTICES,
			INDICES,
			x,
			y,
			z,
			outer[0] / 255,
			outer[1] / 255,
			outer[2] / 255,
			Math.min(1, alpha * 2),
			0
		);
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

export default UnityLink;
