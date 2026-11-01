import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Summoner Hide (EFST 933) freezes the Doram on its bush frame. The head sprite is
// empty there, but every headgear sprite has art on it, so headgear drew on top of
// the bush. While hidden, only the bush shows.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');

describe('Summoner Hide headgear', () => {
	it('marks the entity hidden while the status is on', () => {
		const code = read('Engine/MapEngine/Entity.js');
		const start = code.indexOf('case StatusConst.SUHIDE:');
		const block = code.slice(start, code.indexOf('break;', start));
		expect(block).toContain('entity.suHide = pkt.state == 1;');
	});

	it('skips the top, mid and lower headgear while hidden', () => {
		const code = read('Renderer/Entity/EntityRender.js');
		expect(code).toContain('const showHats = !self.suHide;');
		expect(code).toMatch(/if \(showHats && self\.accessory3 > 0/);
		expect(code).toMatch(/if \(\n\t*showHats &&\n\t*self\.accessory2 > 0/);
		expect(code).toMatch(/if \(showHats && self\.accessory > 0\)/);
	});
});
