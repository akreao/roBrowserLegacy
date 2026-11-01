/**
 * Renderer/Effects/HitLine.js
 *
 * Draws the kick hit lines (effects 429, 430 and 431; 429 has 16 thin arcs of
 * white02.bmp sweeping out from the target), each a grey core and a blue glow,
 * added, through AuraBatch.js. The numbers are in HitLineSim.js.
 *
 * Effect table entry:
 *   { type: 'FUNC', func(Params) {
 *       this.add(new HitLine(Params.Init.ownerEntity, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import AuraBatch, { sharedTexture, freeSharedTextures } from 'Renderer/Effects/AuraBatch.js';
import { BLEND_ADD } from 'Renderer/Effects/AuraBlend.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import {
	HITLINE,
	hitLineLastTick,
	tableHeading,
	planHitLines,
	sweptTicks,
	trailAngles,
	lineAlpha,
	arcPoint,
	coreColor
} from 'Renderer/Effects/HitLineSim.js';

const _batch = new AuraBatch({ fog: true, mergeAdditive: true });
const _textures = new Map();

const TEXTURE = 'white02.bmp';

const SIDES = HITLINE.sides;
const TUBE_VERTICES = SIDES * 4;
const TUBE_INDICES = new Uint16Array(SIDES * 6);
for (let k = 0; k < SIDES; k++) {
	const v = k * 4;
	TUBE_INDICES.set([v, v + 1, v + 2, v, v + 2, v + 3], k * 6);
}

const BLUE = [0, 0, 1];

/**
 * The vertices of one segment's tube, relative to the target, in cells and GL
 * axes (the client's, y down): `sides` quads round the segment from a to b,
 * `HITLINE.up` units above it.
 *
 * @param {Array} a start [x, y, z], client units
 * @param {Array} b end [x, y, z], client units
 * @param {number} heading degrees, the line's
 * @param {number} radius units
 * @param {Float32Array} [out]
 * @return {Float32Array} x, y, z, u, v each
 */
export function segmentVertices(a, b, heading, radius, out = new Float32Array(TUBE_VERTICES * 5)) {
	const rad = Math.PI / 180;
	// Across the line, level: the heading turned 90 degrees.
	const px = -Math.sin(heading * rad);
	const pz = Math.cos(heading * rad);
	const ring = [];
	for (let k = 0; k <= SIDES; k++) {
		const t = (k * 360 * rad) / SIDES;
		const side = radius * Math.cos(t);
		ring.push([px * side, radius * Math.sin(t) - HITLINE.up, pz * side]);
	}
	let o = 0;
	const put = (p, off, u, v) => {
		out[o++] = (p[0] + off[0]) / UNITS_PER_CELL;
		out[o++] = (p[1] + off[1]) / UNITS_PER_CELL;
		out[o++] = (p[2] + off[2]) / UNITS_PER_CELL;
		out[o++] = u;
		out[o++] = v;
	};
	for (let k = 1; k <= SIDES; k++) {
		put(a, ring[k - 1], 0, 1);
		put(a, ring[k], 1, 1);
		put(b, ring[k], 1, 0);
		put(b, ring[k - 1], 0, 0);
	}
	return out;
}

class HitLine {
	/**
	 * @param {object} owner the entity hit; the lines follow it
	 * @param {number} startTick
	 * @param {function} [random] returns a number in [0, 1)
	 * @param {object} [kind] from HITLINE_KINDS (429 by default)
	 * @param {Array} [source] the caster's position, for 430's aimed lines
	 */
	constructor(owner, startTick, random = Math.random, kind = HITLINE, source = null) {
		this.owner = owner;
		this.startTick = startTick || 0;
		this.kind = kind;
		this.lastTick = hitLineLastTick(kind);
		this.position = owner && owner.position ? [owner.position[0], owner.position[1], owner.position[2]] : [0, 0, 0];
		const aim = source ? tableHeading(this.position[0] - source[0], this.position[1] - source[1]) : 0;
		this.lines = planHitLines(random, kind, aim);
		this.core = new Float32Array(TUBE_VERTICES * 5);
		this.glow = new Float32Array(TUBE_VERTICES * 5);
	}

	init(gl) {
		// Ready whether it loads or not: it still runs out and is cleaned up.
		const done = () => {
			this.ready = true;
		};
		sharedTexture(
			_textures,
			gl,
			TEXTURE,
			texture => {
				this.texture = texture;
				done();
			},
			done
		);
	}

	free() {
		this.ready = false;
	}

	render(gl, tick) {
		if (tick < this.startTick) {
			return;
		}
		const t = Math.floor((tick - this.startTick) / PRIM_TICK_MS);
		if (t > this.lastTick) {
			this.needCleanUp = true;
			return;
		}
		if (!_batch.active || !this.texture) {
			return;
		}

		const at = this.owner && this.owner.position;
		if (at) {
			this.position[0] = at[0];
			this.position[1] = at[1];
			this.position[2] = at[2];
		}
		const pos = this.position;
		const x = pos[0] + 0.5;
		const y = -pos[2];
		const z = pos[1] + 0.5;

		for (const line of this.lines) {
			const c = sweptTicks(line, t);
			const alpha = lineAlpha(line, c);
			if (alpha <= 0) {
				continue;
			}
			const kind = this.kind;
			const angles = trailAngles(c, kind.segments);
			for (let i = 0; i < kind.segments; i++) {
				const a = alpha - HITLINE.segmentFade * i;
				if (a <= 0 || angles[i] === angles[i + 1]) {
					continue;
				}
				const from = arcPoint(line, angles[i]);
				const to = arcPoint(line, angles[i + 1]);
				const [cr, cg, cb] = coreColor(i);
				segmentVertices(from, to, line.heading, kind.core, this.core);
				_batch.mesh(
					this.texture,
					BLEND_ADD,
					this.core,
					TUBE_VERTICES,
					TUBE_INDICES,
					x,
					y,
					z,
					cr / 255,
					cg / 255,
					cb / 255,
					a / 255,
					0
				);
				const glow = Math.trunc(a * 0.5);
				if (glow > 0) {
					segmentVertices(from, to, line.heading, kind.core * kind.glow, this.glow);
					_batch.mesh(
						this.texture,
						BLEND_ADD,
						this.glow,
						TUBE_VERTICES,
						TUBE_INDICES,
						x,
						y,
						z,
						BLUE[0],
						BLUE[1],
						BLUE[2],
						glow / 255,
						0
					);
				}
			}
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

export default HitLine;
