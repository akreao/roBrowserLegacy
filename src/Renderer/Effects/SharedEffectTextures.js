/**
 * Renderer/Effects/SharedEffectTextures.js
 *
 * One GPU texture per file for every instance of an effect class, counted by the
 * instances using it. The last instance to let go deletes it.
 *
 * Loading a texture means decoding it and drawing it through two 2D canvases,
 * which is slow, and each canvas adds work to the browser's GPU process. An
 * effect that loads its own copy on every cast pays that each time.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import WebGL from 'Utils/WebGL.js';
import Client from 'Core/Client.js';

export default class SharedEffectTextures {
	constructor() {
		this.entries = new Map();
	}

	/**
	 * Start using the texture of a file.
	 *
	 * @param {WebGL2RenderingContext} gl
	 * @param {string} path - whole path, e.g. data/texture/effect/ring_blue.tga
	 * @param {function} onload - gets the texture, now or once it is loaded
	 * @param {function} [onerror] - the file is missing
	 * @return {object} handle to give back to release()
	 */
	acquire(gl, path, onload, onerror) {
		let entry = this.entries.get(path);

		if (!entry) {
			entry = { path, texture: null, failed: false, waiting: [], users: 0 };
			this.entries.set(path, entry);
			Client.loadFile(
				path,
				buffer => {
					WebGL.texture(gl, buffer, texture => {
						if (this.entries.get(path) !== entry) {
							// Nobody uses it any more.
							gl.deleteTexture(texture);
							return;
						}
						entry.texture = texture;
						const waiting = entry.waiting;
						entry.waiting = [];
						waiting.forEach(w => w.onload(texture));
					});
				},
				() => {
					entry.failed = true;
					const waiting = entry.waiting;
					entry.waiting = [];
					waiting.forEach(w => w.onerror && w.onerror());
				}
			);
		}

		entry.users++;

		if (entry.texture) {
			onload(entry.texture);
		} else if (entry.failed) {
			if (onerror) {
				onerror();
			}
		} else {
			entry.waiting.push({ onload, onerror });
		}

		return entry;
	}

	/**
	 * Stop using a texture. A handle from before clear() does nothing.
	 *
	 * @param {WebGL2RenderingContext} gl
	 * @param {object} entry - from acquire()
	 */
	release(gl, entry) {
		if (!entry || this.entries.get(entry.path) !== entry) {
			return;
		}
		entry.users--;
		if (entry.users > 0) {
			return;
		}
		this.entries.delete(entry.path);
		if (entry.texture) {
			gl.deleteTexture(entry.texture);
		}
	}

	/**
	 * Delete every texture (the class is freed).
	 *
	 * @param {WebGL2RenderingContext} gl
	 */
	clear(gl) {
		for (const entry of this.entries.values()) {
			if (entry.texture) {
				gl.deleteTexture(entry.texture);
			}
		}
		this.entries.clear();
	}
}
