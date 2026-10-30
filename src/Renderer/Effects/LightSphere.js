/**
 * Renderer/Effects/LightSphere.js
 *
 * Draws the rays of the Light of the Sun, Moon and Stars spheres
 * (CLightSphereEffect, effects 1197-1199): 640 tinted white02.bmp quads a
 * sphere, added, all spheres of a frame in a few draw calls (AuraBatch.js).
 * The motion is in LightSphereSim.js; the centre is a 3D row in
 * DB/Effects/LightSphereEffect.js.
 *
 * Effect table entry:
 *   { type: 'FUNC', attachedEntity: true, func(Params) {
 *       this.add(new LightSphere(1197, Params.Init.ownerEntity, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import AuraBatch, { QUAD_FAN, sharedTexture, freeSharedTextures } from 'Renderer/Effects/AuraBatch.js';
import { BLEND_ADD } from 'Renderer/Effects/AuraBlend.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { createSphere, stepSphere, sphereAlive, rayCorners } from 'Renderer/Effects/LightSphereSim.js';

/** Every sphere's rays, drawn together, and the texture they share. */
const _batch = new AuraBatch({ fog: true, mergeAdditive: true });
const _textures = new Map();

const RAY_TEXTURE = 'white02.bmp';

/** The client's corners are top-left, top-right, bottom-left, bottom-right; the batch's go round. */
const CORNER_ORDER = [0, 1, 3, 2];

class LightSphere {
	/**
	 * @param {number} effectId 1197, 1198 or 1199
	 * @param {Entity} owner the caster, followed
	 * @param {number} startTick
	 */
	constructor(effectId, owner, startTick) {
		this.owner = owner;
		this.position = owner ? owner.position : [0, 0, 0];
		this.startTick = startTick || 0;
		this.sphere = createSphere(effectId);
		this.points = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
	}

	init(gl) {
		// Ready either way: without the texture no ray is drawn, but the sphere still
		// runs out and the effect is cleaned up.
		sharedTexture(
			_textures,
			gl,
			RAY_TEXTURE,
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
		const ticks = Math.floor((tick - this.startTick) / PRIM_TICK_MS) + 1;
		while (this.sphere.ticks < ticks) {
			stepSphere(this.sphere);
		}
		if (!sphereAlive(this.sphere)) {
			this.needCleanUp = true;
			return;
		}
		if (!_batch.active || !this.texture) {
			return;
		}

		const pos = this.owner ? this.owner.position : this.position;
		const ox = pos[0] + 0.5;
		const oy = -pos[2];
		const oz = pos[1] + 0.5;
		const points = this.points;
		for (const ray of this.sphere.rays) {
			if (ray.alpha < 1) {
				continue;
			}
			const corners = rayCorners(ray);
			for (let k = 0; k < 4; k++) {
				const c = corners[CORNER_ORDER[k]];
				points[k][0] = ox + c[0] / UNITS_PER_CELL;
				points[k][1] = oy + c[1] / UNITS_PER_CELL;
				points[k][2] = oz + c[2] / UNITS_PER_CELL;
			}
			_batch.quad(
				this.texture,
				BLEND_ADD,
				points,
				QUAD_FAN,
				ray.color[0] / 255,
				ray.color[1] / 255,
				ray.color[2] / 255,
				ray.alpha / 255,
				0
			);
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
		// The rays are drawn only through the batch, whatever auraBatching says.
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

export default LightSphere;
