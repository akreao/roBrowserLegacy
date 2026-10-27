/**
 * Renderer/Entity/ScaledLayer.js
 *
 * An effect sprite's ACT layer as drawn at a size factor: its offset grows with
 * it, as the official client scales an effect sprite's whole frame (Lightning
 * Jolt's 썬더스톰 at 2.5). Spec: effect-port/ninja-skills.md.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/** Reused copy of a layer drawn at another size, and its offset. */
const _scaledPos = [0, 0];
const _scaledLayer = {};

/**
 * @param {object} layer ACT layer
 * @param {number} scale size factor
 * @return {object} the layer itself at scale 1, else a reused scaled copy
 */
export function scaledLayer(layer, scale) {
	if (scale === 1) {
		return layer;
	}
	Object.assign(_scaledLayer, layer);
	_scaledPos[0] = layer.pos[0] * scale;
	_scaledPos[1] = layer.pos[1] * scale;
	_scaledLayer.pos = _scaledPos;
	return _scaledLayer;
}
