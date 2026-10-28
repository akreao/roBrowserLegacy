/**
 * Renderer/Effects/EffectPrimSim.js
 *
 * Motion and geometry of the official client's effect primitives, without
 * any WebGL, so it can be tested on its own.
 *
 * The official client moves effects on a fixed clock of 60 ticks a second,
 * in its own world units (5 units are one roBrowser cell). Values here keep
 * those units: sizes are units, speeds are units per tick, angles are degrees.
 *
 * Supported primitives:
 *  - 'ring':   a flat textured band (an outer and an inner circle), growing outwards.
 *  - 'sphere': a textured sphere, growing and spinning around the vertical axis.
 *  - 'quad':   a flat textured square lying level, centred on the position (official type 15).
 *  - 'cone':   a textured band between two circles on one axis (official type 13), tilted and
 *              turned, drifting along its axis.
 *
 * Effect description keys (all optional except prim and texture):
 *  - prim {string}          'ring', 'sphere' or 'quad'
 *  - frames {number}        lifetime in ticks (default 100)
 *  - radius {number}        start radius (default 0)
 *  - radiusSpeed {number}   radius change per tick (default 0)
 *  - radiusAccel {number}   change of radiusSpeed per tick (default 0)
 *  - width {number}         ring band width (default 0)
 *  - segments {number}      segments around (default 10)
 *  - bands {number}         sphere latitude bands (default 5)
 *  - uStep {number}         ring texture U advance per segment (default 0.25)
 *  - yaw {number}           start rotation around the vertical axis (default 0)
 *  - spin {number}          yaw change per tick (default 0)
 *  - alpha {number}         start alpha, 0..254 (default 254)
 *  - alphaSpeed {number}    alpha change per tick (default 0)
 *  - alphaMax {number}      alpha ceiling (default 254)
 *  - fadeOutFrame {number}  tick on which the fade to 0 starts (default none)
 *  - color {Array}          tint, [r, g, b] out of 255 (default white)
 *  - size {number}          quad half side, the square spans -size..+size (default 0)
 *  - sizeSpeed {number}     size change per tick (default 0)
 *  - sizeAccel {number}     change of sizeSpeed per tick (default 0)
 *  - sizeChangeFrame {number}  tick on which sizeSpeed and sizeAccel are replaced (default none)
 *  - sizeChangeSpeed {number}  sizeSpeed from that tick
 *  - sizeChangeAccel {number}  sizeAccel from that tick
 *  - height {number}        quad or cone height above the ground (default 0)
 *  - radiusChangeFrame {number}  tick on which the ring's radiusSpeed and radiusAccel are replaced
 *  - radiusChangeSpeed {number}  radiusSpeed from that tick
 *  - radiusChangeAccel {number}  radiusAccel from that tick
 *
 * Cone keys (the band runs from the base circle to the top circle):
 *  - baseRadius, baseSpeed, baseAccel {number}   base circle radius and its growth
 *  - topRadius, topSpeed, topAccel {number}      top circle radius and its growth
 *  - coneHeight, coneHeightSpeed, coneHeightAccel {number}  distance between the circles and
 *                           its growth, never over coneHeightMax (default 100)
 *  - pitch {number}         tilt in degrees: 0 keeps the axis upright (top above base),
 *                           -90 lays it level
 *  - yaw {number}           turn in degrees around the vertical
 *  - facing {boolean}       yaw is 180 minus the owner's facing angle (with pitch -90 the band
 *                           opens the way the owner faces); yaw is then added on top
 *  - drift, driftAccel {number}  speed along the axis, toward the top circle, and its change
 *  - driftStart {number}    distance already drifted along the axis on the first tick (default 0)
 *  - offsetX, offsetY {number}  shift from the position along the map's x and y, in units (default 0)
 */

/**
 * @var {number} length of one tick of the official effect clock, in ms
 */
export const PRIM_TICK_MS = 1000 / 60;

/**
 * @var {number} official world units per roBrowser cell
 */
export const UNITS_PER_CELL = 5;

/**
 * Read a numeric option
 *
 * @param {number} value
 * @param {number} fallback
 * @return {number}
 */
function num(value, fallback) {
	return typeof value === 'number' && !isNaN(value) ? value : fallback;
}

/**
 * Starting state of a primitive
 *
 * @param {object} effect description
 * @return {object} state
 */
export function createPrimState(effect) {
	return {
		frame: 0,
		frames: num(effect.frames, 100),
		radius: num(effect.radius, 0),
		radiusSpeed: num(effect.radiusSpeed, 0),
		radiusAccel: num(effect.radiusAccel, 0),
		yaw: num(effect.yaw, 0),
		spin: num(effect.spin, 0),
		alpha: num(effect.alpha, 254),
		alphaSpeed: num(effect.alphaSpeed, 0),
		alphaMax: num(effect.alphaMax, 254),
		fadeOutFrame: num(effect.fadeOutFrame, -1),
		size: num(effect.size, 0),
		sizeSpeed: num(effect.sizeSpeed, 0),
		sizeAccel: num(effect.sizeAccel, 0),
		sizeChangeFrame: num(effect.sizeChangeFrame, -1),
		sizeChangeSpeed: num(effect.sizeChangeSpeed, 0),
		sizeChangeAccel: num(effect.sizeChangeAccel, 0),
		radiusChangeFrame: num(effect.radiusChangeFrame, -1),
		radiusChangeSpeed: num(effect.radiusChangeSpeed, 0),
		radiusChangeAccel: num(effect.radiusChangeAccel, 0),
		baseRadius: num(effect.baseRadius, 0),
		baseSpeed: num(effect.baseSpeed, 0),
		baseAccel: num(effect.baseAccel, 0),
		topRadius: num(effect.topRadius, 0),
		topSpeed: num(effect.topSpeed, 0),
		topAccel: num(effect.topAccel, 0),
		coneHeight: num(effect.coneHeight, 0),
		coneHeightSpeed: num(effect.coneHeightSpeed, 0),
		coneHeightAccel: num(effect.coneHeightAccel, 0),
		coneHeightMax: num(effect.coneHeightMax, 100),
		pitch: num(effect.pitch, 0),
		drift: num(effect.drift, 0),
		driftAccel: num(effect.driftAccel, 0),
		driftOffset: num(effect.driftStart, 0)
	};
}

/**
 * Facing angle of an owner in the official client's convention, from a roBrowser
 * direction (0 south, then clockwise: 1 south-west ... 7 south-east).
 * The client measures it as atan2(dx, -dz) in degrees, 0..360; with the map's
 * y taken as the client's z that puts 0 on south and 90 on east.
 *
 * @param {number} direction roBrowser direction 0-7
 * @return {number} degrees
 */
export function facingAngle(direction) {
	const DX = [0, -1, -1, -1, 0, 1, 1, 1];
	const DY = [-1, -1, 0, 1, 1, 1, 0, -1];
	const d = (((Math.round(direction) || 0) % 8) + 8) % 8;
	const angle = (Math.atan2(DX[d], -DY[d]) * 180) / Math.PI;
	return (angle + 360) % 360;
}

/**
 * Turn a primitive by its owner's facing, the way the client sets up a hit
 * band: yaw = 180 - facing (kept in 0..360), plus the effect's own yaw.
 *
 * @param {object} state from createPrimState
 * @param {object} effect description
 * @param {number} direction roBrowser direction 0-7
 */
export function applyFacing(state, effect, direction) {
	if (effect.facing) {
		state.yaw = ((180 - facingAngle(direction) + 360) % 360) + num(effect.yaw, 0);
	}
}

/**
 * Advance a primitive by one tick
 *
 * @param {object} state
 */
export function stepPrim(state) {
	// From the fade-out tick on, alpha falls in a straight line to reach 0 on the last tick.
	if (state.frame === state.fadeOutFrame && state.frames > state.frame) {
		state.alphaSpeed = -state.alpha / (state.frames - state.frame);
	}

	state.alpha = Math.min(state.alphaMax, Math.max(0, state.alpha + state.alphaSpeed));

	// The ring's growth switches to new numbers once, on its change tick.
	if (state.frame === state.radiusChangeFrame) {
		state.radiusSpeed = state.radiusChangeSpeed;
		state.radiusAccel = state.radiusChangeAccel;
	}

	state.radiusSpeed += state.radiusAccel;
	state.radius += state.radiusSpeed;

	// Cone: both circles, the height (capped) and the drift along the axis.
	state.baseSpeed += state.baseAccel;
	state.baseRadius += state.baseSpeed;
	state.topSpeed += state.topAccel;
	state.topRadius += state.topSpeed;
	state.coneHeightSpeed += state.coneHeightAccel;
	state.coneHeight = Math.min(state.coneHeight + state.coneHeightSpeed, state.coneHeightMax);
	state.drift += state.driftAccel;
	state.driftOffset += state.drift;

	state.yaw += state.spin;

	// The quad's growth switches to new numbers once, on its change tick.
	if (state.frame === state.sizeChangeFrame) {
		state.sizeSpeed = state.sizeChangeSpeed;
		state.sizeAccel = state.sizeChangeAccel;
	}

	state.sizeSpeed += state.sizeAccel;
	state.size += state.sizeSpeed;

	state.frame++;
}

/**
 * Advance a primitive up to the given tick (it never goes past its lifetime)
 *
 * @param {object} state
 * @param {number} frame
 * @return {boolean} whether the state changed
 */
export function advancePrim(state, frame) {
	const target = Math.min(frame, state.frames);
	let changed = false;

	while (state.frame < target) {
		stepPrim(state);
		changed = true;
	}

	return changed;
}

/**
 * Write one vertex in roBrowser's GL space
 * (x, y on the map, z up; GL keeps the map plane in x/z and points y down)
 */
function vertex(out, i, center, x, y, up, u, v) {
	out[i + 0] = center[0] + 0.5 + x / UNITS_PER_CELL;
	out[i + 1] = -center[2] - up / UNITS_PER_CELL;
	out[i + 2] = center[1] + 0.5 + y / UNITS_PER_CELL;
	out[i + 3] = u;
	out[i + 4] = v;
	return i + 5;
}

/**
 * Number of vertices a primitive draws (triangles, 5 floats each)
 *
 * @param {object} effect description
 * @return {number}
 */
export function primVertexCount(effect) {
	const segments = num(effect.segments, 10);

	if (effect.prim === 'sphere') {
		return segments * num(effect.bands, 5) * 6;
	}

	if (effect.prim === 'quad') {
		return 6;
	}

	return segments * 6;
}

/**
 * Turn a point of the cone's own frame into the world: tilt by pitch about the
 * side axis, then turn by yaw about the vertical (the client's row-vector
 * order). Frame: x and z level, y down (so negative y is up).
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} pitch radians
 * @param {number} yaw radians
 * @return {Array} [x, y, z]
 */
export function coneToWorld(x, y, z, pitch, yaw) {
	const cp = Math.cos(pitch),
		sp = Math.sin(pitch);
	const cy = Math.cos(yaw),
		sy = Math.sin(yaw);

	// Tilt: (x, y, z) -> (x, y cos - z sin, y sin + z cos)
	const ty = y * cp - z * sp;
	const tz = y * sp + z * cp;

	// Turn: (x, z) -> (x cos + z sin, -x sin + z cos)
	return [x * cy + tz * sy, ty, -x * sy + tz * cy];
}

/**
 * Build the cone band: ten segments (by default) around the axis, from the base
 * circle (V = 1) to the top circle coneHeight away along the axis (V = 0).
 * U runs uStep per segment and starts again at 0 once it reaches 1.
 * The band sits `height` units above the position and has drifted
 * driftOffset units along its axis, toward the top.
 *
 * @param {Float32Array} out
 * @param {object} effect description
 * @param {object} state
 * @param {Array} center position, in cells
 */
function buildCone(out, effect, state, center) {
	const segments = num(effect.segments, 10);
	const step = 360 / segments;
	const uStep = num(effect.uStep, 0.25);
	const pitch = (state.pitch / 180) * Math.PI;
	const yaw = (state.yaw / 180) * Math.PI;
	const b = state.baseRadius;
	const t = state.topRadius;
	const h = state.coneHeight;
	const lift = num(effect.height, 0);

	// The axis (from base toward top) is the frame's -y; drift moves along it.
	const axis = coneToWorld(0, -1, 0, pitch, yaw);
	const ox = axis[0] * state.driftOffset + num(effect.offsetX, 0);
	const oy = axis[1] * state.driftOffset;
	const oz = axis[2] * state.driftOffset + num(effect.offsetY, 0);

	// Client x / z are the map's x / y; client y points down.
	const point = (r, depth, deg, u, v) => {
		const a = (deg / 180) * Math.PI;
		const p = coneToWorld(r * Math.cos(a), -depth, r * Math.sin(a), pitch, yaw);
		return [p[0] + ox, p[2] + oz, lift - (p[1] + oy), u, v];
	};

	let u = 0;
	let o = 0;

	for (let i = 0; i < segments; ++i) {
		const a0 = i * step;
		const a1 = a0 + step;
		const u0 = u;
		const u1 = u + uStep;

		const base0 = point(b, 0, a0, u0, 1);
		const base1 = point(b, 0, a1, u1, 1);
		const top0 = point(t, h, a0, u0, 0);
		const top1 = point(t, h, a1, u1, 0);

		o = vertex(out, o, center, ...base0);
		o = vertex(out, o, center, ...base1);
		o = vertex(out, o, center, ...top0);

		o = vertex(out, o, center, ...top1);
		o = vertex(out, o, center, ...top0);
		o = vertex(out, o, center, ...base1);

		u = u1 >= 1 ? 0 : u1;
	}
}

/**
 * Build the ring: a band between radius and radius - width, lying on the ground.
 * U runs uStep per segment and starts again at 0 once it reaches 1;
 * V is 0 on the outer edge and 1 on the inner one.
 *
 * @param {Float32Array} out
 * @param {object} effect description
 * @param {object} state
 * @param {Array} center position, in cells
 */
function buildRing(out, effect, state, center) {
	const segments = num(effect.segments, 10);
	const step = (Math.PI * 2) / segments;
	const uStep = num(effect.uStep, 0.25);
	const outer = state.radius;
	const inner = outer - Math.min(num(effect.width, 0), outer);
	const yaw = (state.yaw / 180) * Math.PI;
	let u = 0;
	let o = 0;

	for (let i = 0; i < segments; ++i) {
		const a0 = yaw + i * step;
		const a1 = a0 + step;
		const c0 = Math.cos(a0),
			s0 = Math.sin(a0);
		const c1 = Math.cos(a1),
			s1 = Math.sin(a1);
		const u0 = u;
		const u1 = u + uStep;

		o = vertex(out, o, center, c0 * outer, s0 * outer, 0, u0, 0);
		o = vertex(out, o, center, c1 * outer, s1 * outer, 0, u1, 0);
		o = vertex(out, o, center, c0 * inner, s0 * inner, 0, u0, 1);

		o = vertex(out, o, center, c1 * outer, s1 * outer, 0, u1, 0);
		o = vertex(out, o, center, c1 * inner, s1 * inner, 0, u1, 1);
		o = vertex(out, o, center, c0 * inner, s0 * inner, 0, u0, 1);

		u = u1 >= 1 ? 0 : u1;
	}
}

/**
 * Build the sphere, centred on the position (its lower half is under the ground).
 * U = longitude / 360, V = (latitude + 90) / 180.
 *
 * @param {Float32Array} out
 * @param {object} effect description
 * @param {object} state
 * @param {Array} center position, in cells
 */
function buildSphere(out, effect, state, center) {
	const segments = num(effect.segments, 10);
	const bands = num(effect.bands, 5);
	const r = state.radius;
	const yaw = (state.yaw / 180) * Math.PI;
	let o = 0;

	const point = (lon, lat) => {
		const a = yaw + (lon / segments) * Math.PI * 2;
		const b = (lat / bands - 0.5) * Math.PI;
		const flat = Math.cos(b) * r;
		return [Math.cos(a) * flat, Math.sin(a) * flat, Math.sin(b) * r, lon / segments, lat / bands];
	};

	for (let j = 0; j < bands; ++j) {
		for (let i = 0; i < segments; ++i) {
			const p00 = point(i, j);
			const p10 = point(i + 1, j);
			const p01 = point(i, j + 1);
			const p11 = point(i + 1, j + 1);

			o = vertex(out, o, center, ...p00);
			o = vertex(out, o, center, ...p10);
			o = vertex(out, o, center, ...p01);

			o = vertex(out, o, center, ...p10);
			o = vertex(out, o, center, ...p11);
			o = vertex(out, o, center, ...p01);
		}
	}
}

/**
 * Build the quad: a level square spanning -size..+size on both ground axes,
 * height units above the ground, the whole texture corner to corner.
 *
 * @param {Float32Array} out
 * @param {object} effect description
 * @param {object} state
 * @param {Array} center position, in cells
 */
function buildQuad(out, effect, state, center) {
	const s = state.size;
	const up = num(effect.height, 0);
	let o = 0;

	o = vertex(out, o, center, s, s, up, 0, 0);
	o = vertex(out, o, center, s, -s, up, 1, 0);
	o = vertex(out, o, center, -s, s, up, 0, 1);

	o = vertex(out, o, center, s, -s, up, 1, 0);
	o = vertex(out, o, center, -s, -s, up, 1, 1);
	vertex(out, o, center, -s, s, up, 0, 1);
}

/**
 * Fill a vertex buffer with the primitive's triangles in its current state
 *
 * @param {Float32Array} out, primVertexCount(effect) * 5 floats
 * @param {object} effect description
 * @param {object} state
 * @param {Array} center position, in cells
 */
export function buildPrimGeometry(out, effect, state, center) {
	if (effect.prim === 'sphere') {
		buildSphere(out, effect, state, center);
	} else if (effect.prim === 'quad') {
		buildQuad(out, effect, state, center);
	} else if (effect.prim === 'cone') {
		buildCone(out, effect, state, center);
	} else {
		buildRing(out, effect, state, center);
	}
}
