/**
 * Renderer/Effects/Flasher.js
 *
 * Draws Flasher's flash (effect 99): a thunder_center.bmp square facing the
 * camera and 20 alpha_center.tga rays, added, through AuraBatch.js. The
 * client draws the rays in screen pixels; here they lie in the plane facing
 * the camera, a pixel being 1/35 of a cell as for sprites. The motion is in
 * FlasherSim.js.
 *
 * Effect table entry:
 *   { type: 'FUNC', func(Params) {
 *       this.add(new Flasher(Params.Inst.position, Params.Inst.startTick), Params);
 *   } }
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import AuraBatch, { QUAD_FAN, sharedTexture, freeSharedTextures } from 'Renderer/Effects/AuraBatch.js';
import { BLEND_ADD } from 'Renderer/Effects/AuraBlend.js';
import { PRIM_TICK_MS, UNITS_PER_CELL } from 'Renderer/Effects/EffectPrimSim.js';
import { FLASH, RAY, flashAlphas, createRay, stepRay, rayTriangle } from 'Renderer/Effects/FlasherSim.js';

const _batch = new AuraBatch({ fog: true, mergeAdditive: true });
const _textures = new Map();

const FLASH_TEXTURE = 'thunder_center.bmp';
const RAY_TEXTURE = 'alpha_center.tga';

/** A screen pixel, in cells, as sprites draw them (SpriteRenderer: size / 175 * 5). */
const PIXEL = 1 / 35;

/** Screen right and up, in GL world, from the view matrix of the frame. */
const _right = [1, 0, 0];
const _up = [0, 1, 0];

/** The ray triangle: point (0.5, 0), then the corners (1, 1) and (0, 1). */
const RAY_INDICES = new Uint16Array([0, 1, 2]);
const _rayVertices = new Float32Array([0, 0, 0, 0.5, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1]);

const ALPHAS = flashAlphas();

class Flasher {
	/**
	 * @param {Array} position the trap's cell [x, y, z]
	 * @param {number} startTick
	 * @param {function} [random] returns a number in [0, 1)
	 */
	constructor(position, startTick, random = Math.random) {
		this.position = position || [0, 0, 0];
		this.startTick = startTick || 0;
		this.rays = [];
		for (let i = 0; i < RAY.count; i++) {
			this.rays.push(createRay(random));
		}
		this.ticks = 0;
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
			FLASH_TEXTURE,
			texture => {
				this.flashTexture = texture;
				done();
			},
			done
		);
		sharedTexture(
			_textures,
			gl,
			RAY_TEXTURE,
			texture => {
				this.rayTexture = texture;
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
		// The client updates before it draws, so the first frame is one tick on.
		const ticks = Math.floor((tick - this.startTick) / PRIM_TICK_MS) + 1;
		while (this.ticks < ticks && this.ticks < RAY.life) {
			this.rays.forEach(stepRay);
			this.ticks++;
		}
		if (ticks > FLASH.life) {
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

		if (this.flashTexture) {
			const alpha = ALPHAS[this.ticks - 1] / 255;
			const half = FLASH.half / UNITS_PER_CELL;
			// The client's y runs down, as GL y does here (see LightSphere)
			const cy = oy - FLASH.height / UNITS_PER_CELL;
			const corners = [
				[-1, 1],
				[1, 1],
				[1, -1],
				[-1, -1]
			];
			for (let k = 0; k < 4; k++) {
				const sx = corners[k][0] * half;
				const sy = corners[k][1] * half;
				this.points[k][0] = ox + _right[0] * sx + _up[0] * sy;
				this.points[k][1] = cy + _right[1] * sx + _up[1] * sy;
				this.points[k][2] = oz + _right[2] * sx + _up[2] * sy;
			}
			_batch.quad(this.flashTexture, BLEND_ADD, this.points, QUAD_FAN, 1, 1, 1, alpha, 0);
		}

		if (this.rayTexture) {
			// The rays' point, RAY.up pixels above the trap on screen.
			const px = ox + _up[0] * RAY.up * PIXEL;
			const py = oy + _up[1] * RAY.up * PIXEL;
			const pz = oz + _up[2] * RAY.up * PIXEL;
			for (const ray of this.rays) {
				if (ray.alpha < 1) {
					continue;
				}
				const tri = rayTriangle(ray);
				for (let k = 0; k < 3; k++) {
					// Screen y runs down
					const sx = tri[k][0] * PIXEL;
					const sy = -tri[k][1] * PIXEL;
					_rayVertices[k * 5] = _right[0] * sx + _up[0] * sy;
					_rayVertices[k * 5 + 1] = _right[1] * sx + _up[1] * sy;
					_rayVertices[k * 5 + 2] = _right[2] * sx + _up[2] * sy;
				}
				_batch.mesh(
					this.rayTexture,
					BLEND_ADD,
					_rayVertices,
					3,
					RAY_INDICES,
					px,
					py,
					pz,
					1,
					1,
					1,
					ray.alpha / 255,
					0
				);
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

export default Flasher;
