import { describe, expect, it, vi } from 'vitest';

// An animated model re-wrote every node of every instance on each step of its
// animation, the ones that never move as well. A node that is static, under
// parents that are static too, is now written once; this checks the buffer
// still holds what writing everything every time gave.
vi.mock('Utils/WebGL.js', () => ({ default: { createShaderProgram: () => ({}), texture: () => {} } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: () => {} } }));
vi.mock('Preferences/Graphics.js', () => ({ default: { performanceMode: false } }));
vi.mock('Renderer/Map/OccluderFade.js', () => ({
	default: { injectShader: s => s, renderOpaque: (gl, u, fn) => fn(), renderQuery: () => {}, QUERY: { ANIMATED: 1 } }
}));

const { default: AnimatedModels } = await import('Renderer/Map/AnimatedModels.js');

function fakeGL() {
	const buffers = [];
	let bound = null;
	const gl = new Proxy(
		{
			createBuffer: () => {
				const buffer = { data: null, uploaded: 0 };
				buffers.push(buffer);
				return buffer;
			},
			bindBuffer: (target, buffer) => (bound = buffer),
			bufferData: (target, size) => (bound.data = new Float32Array(size / 4)),
			bufferSubData: (target, dstByte, src, srcOffset = 0, length = src.length - srcOffset) => {
				bound.data.set(src.subarray(srcOffset, srcOffset + length), dstByte / 4);
				bound.uploaded += length;
			}
		},
		{ get: (target, key) => (key in target ? target[key] : () => ({})) }
	);
	return { gl, buffers };
}

const ROT = 0.3;
const AXIS = [0, 1, 0];

function node(name, parentname, extra = {}) {
	return {
		name,
		parentname,
		is_only: false,
		textures: [0],
		vertices: [
			[0, 0, 0],
			[1, 0, 0],
			[0, 1, 1]
		],
		tvertices: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
		faces: [{ vertidx: [0, 1, 2], tvertidx: [0, 1, 2], texid: 0 }],
		pos: [1, 2, 3],
		rotangle: ROT,
		rotaxis: AXIS,
		scale: [1, 2, 1],
		offset: [0.5, 0, 0],
		mat3: [1, 0, 0, 0, 1, 0, 0, 0, 1],
		...extra
	};
}

function model(rootKeyframes) {
	const root = rootKeyframes
		? node('root', '', {
				// The same transform as the static root, as keyframes: never frozen
				posKeyframes: [{ frame: 0, px: 1, py: 2, pz: 3 }],
				rotKeyframes: [{ frame: 0, q: [0, Math.sin(ROT / 2), 0, Math.cos(ROT / 2)] }],
				scaleKeyFrames: [{ Frame: 0, Scale: [1, 2, 1] }]
			})
		: node('root', '');
	return {
		filename: 'test.rsm2',
		frameRatePerSecond: 30,
		alpha: 1,
		textures: ['a.bmp'],
		instances: [Array.from({ length: 16 }, (_, i) => (i % 5 === 0 ? 1 : 0)), [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 5, 0, 1, 1]],
		box: { center: [0, 0, 0], max: [0, 1, 0], min: [0, 0, 0], offset: [0, 0, 0], range: [1, 1, 1] },
		nodes: [
			root,
			node('arm', 'root', {
				rotKeyframes: [
					{ frame: 0, q: [0, 0, 0, 1] },
					{ frame: 2000, q: [0, 0, Math.sin(0.5), Math.cos(0.5)] }
				]
			}),
			node('leaf', 'arm'),
			node('base', 'root')
		]
	};
}

describe('AnimatedModels static nodes', () => {
	it('keeps the buffer equal to rewriting every node, while uploading less', () => {
		const { gl, buffers } = fakeGL();
		AnimatedModels.add(gl, model(false));
		AnimatedModels.add(gl, model(true));
		const [frozen, full] = buffers.filter(b => b.data);

		for (const tick of [500, 1000, 1500, 2600]) {
			frozen.uploaded = 0;
			full.uploaded = 0;
			AnimatedModels.render(gl, null, null, null, { color: [0, 0, 0] }, { direction: [0, 0, 0], ambient: [], diffuse: [], env: [] }, tick);

			expect(frozen.data.length).toBe(full.data.length);
			for (let i = 0; i < full.data.length; i++) {
				expect(frozen.data[i]).toBeCloseTo(full.data[i], 4);
			}
			// root and base never move: two of the four nodes are not uploaded again
			expect(full.uploaded).toBeGreaterThan(0);
			expect(frozen.uploaded).toBe(full.uploaded / 2);
		}

		AnimatedModels.free(gl);
	});
});
