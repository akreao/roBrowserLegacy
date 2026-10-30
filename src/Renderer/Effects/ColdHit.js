/**
 * Renderer/Effects/ColdHit.js
 *
 * Draws the cold hit (effect 51): ice.tga shards flying out from the
 * target and two smoke.tga puffs drifting up, added, through AuraBatch.js.
 * The client draws both in screen pixels; here they lie in the plane facing
 * the camera, a pixel being 1/35 of a cell as for sprites, and follow the
 * target. The numbers are in ColdHitSim.js.
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, func(Params) {
 *       this.add(new ColdHit(Params.Inst.position, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import AuraBatch, { QUAD_FAN, sharedTexture, freeSharedTextures } from 'Renderer/Effects/AuraBatch.js';
import { BLEND_ADD } from 'Renderer/Effects/AuraBlend.js';
import { PRIM_TICK_MS } from 'Renderer/Effects/EffectPrimSim.js';
import {
	SHARD,
	PUFF,
	LAST_TICK,
	SHARD_ALPHAS,
	PUFF_ALPHAS,
	createShards,
	shardAt,
	shardTriangles,
	createPuff,
	puffAt
} from 'Renderer/Effects/ColdHitSim.js';

const _batch = new AuraBatch({ fog: true, mergeAdditive: true });
const _textures = new Map();

const SHARD_TEXTURE = 'ice.tga';
const PUFF_TEXTURE = 'smoke.tga';

/** A screen pixel, in cells, as sprites draw them (SpriteRenderer: size / 175 * 5). */
const PIXEL = 1 / 35;

/** Screen right and up, in GL world, from the view matrix of the frame. */
const _right = [1, 0, 0];
const _up = [0, 1, 0];

/** Puff corners in pixels (y down), textured (0,0) (1,0) (1,1) (0,1). */
const CORNERS = [
	[-1, -1],
	[1, -1],
	[1, 1],
	[-1, 1]
];

class ColdHit {
	/**
	 * @param {Array} position the target's position [x, y, z], followed
	 * @param {number} startTick
	 * @param {function} [random] returns a number in [0, 1)
	 */
	constructor(position, startTick, random = Math.random) {
		this.position = position || [0, 0, 0];
		this.startTick = startTick || 0;
		this.shards = createShards(random);
		this.puffs = PUFF.ticks.map(born => createPuff(born, random));
		this.points = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
		this.loaded = 0;
	}

	init(gl) {
		// Ready once both loads are over, loaded or not: it still runs out and is cleaned up.
		const done = () => {
			if (++this.loaded === 2) {
				this.ready = true;
			}
		};
		sharedTexture(
			_textures,
			gl,
			SHARD_TEXTURE,
			texture => {
				this.shardTexture = texture;
				done();
			},
			done
		);
		sharedTexture(
			_textures,
			gl,
			PUFF_TEXTURE,
			texture => {
				this.puffTexture = texture;
				done();
			},
			done
		);
	}

	free() {
		this.ready = false;
	}

	/** A point `px`, `py` screen pixels (y down) from (ox, oy, oz), into `out`. */
	static place(out, ox, oy, oz, px, py) {
		const sx = px * PIXEL;
		const sy = -py * PIXEL;
		out[0] = ox + _right[0] * sx + _up[0] * sy;
		out[1] = oy + _right[1] * sx + _up[1] * sy;
		out[2] = oz + _right[2] * sx + _up[2] * sy;
		return out;
	}

	render(gl, tick) {
		if (tick < this.startTick) {
			return;
		}
		// The client updates before it draws, so the first frame is one tick on.
		const t = Math.floor((tick - this.startTick) / PRIM_TICK_MS) + 1;
		if (t > LAST_TICK + 1) {
			this.needCleanUp = true;
			return;
		}
		if (!_batch.active) {
			return;
		}

		const pos = this.position;
		const ox = pos[0] + 0.5;
		const oy = -pos[2];
		const oz = pos[1] + 0.5;
		const point = this.points[0];

		if (this.puffTexture) {
			for (const puff of this.puffs) {
				const age = t - 1 - puff.born;
				if (age < 0 || age >= PUFF.life) {
					continue;
				}
				const at = puffAt(puff, age + 1);
				for (let k = 0; k < 4; k++) {
					ColdHit.place(
						this.points[k],
						ox,
						oy,
						oz,
						at.x + CORNERS[k][0] * at.size,
						at.y + CORNERS[k][1] * at.size
					);
				}
				_batch.quad(this.puffTexture, BLEND_ADD, this.points, QUAD_FAN, 1, 1, 1, PUFF_ALPHAS[age] / 255, 0);
			}
		}

		if (this.shardTexture && t - 1 < SHARD.life) {
			const alpha = SHARD_ALPHAS[t - 1] / 255;
			for (const shard of this.shards) {
				const [cx, cy] = shardAt(shard, t);
				for (const triangle of shardTriangles(shard)) {
					const base = _batch.reserve(this.shardTexture, BLEND_ADD, 3, 3);
					for (let k = 0; k < 3; k++) {
						const [px, py, u, v] = triangle[k];
						ColdHit.place(point, ox, oy, oz, cx + px, cy + py);
						// The tail (k 1) is the client's white, whatever the fade.
						_batch.vertex(point[0], point[1], point[2], u, v, 1, 1, 1, k === 1 ? 1 : alpha, 0);
						_batch.indices[_batch.indexCount++] = base + k;
					}
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
		// The rows of the view rotation are the screen's axes in the world.
		_right[0] = modelView[0];
		_right[1] = modelView[4];
		_right[2] = modelView[8];
		_up[0] = modelView[1];
		_up[1] = modelView[5];
		_up[2] = modelView[9];
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

export default ColdHit;
