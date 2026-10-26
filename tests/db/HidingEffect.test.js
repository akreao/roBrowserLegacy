import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Hiding: the official client plays EF_BASH (16) on an actor going into hiding (not for Ninja or
// Baby Ninja) and nothing when it comes out. Spec: effect-port/thief-skills.md.

const source = readFileSync(join(process.cwd(), 'src/Engine/MapEngine/Entity.js'), 'utf8');
const hiding = source.slice(source.indexOf('case StatusConst.HIDING:'), source.indexOf('case StatusConst.FALCON:'));

describe('Hiding effect', () => {
	it('plays EF_BASH only when hiding starts, not for Ninja', () => {
		expect(hiding).toMatch(/pkt\.state == 1 && entity\.job != JobId\.NINJA && entity\.job != JobId\.NINJA_B/);
		expect(hiding).toMatch(/effectId: EffectConst\.EF_BASH/);
	});

	it('plays nothing when hiding ends', () => {
		expect(hiding).not.toMatch(/EF_SUMMONSLAVE/);
	});
});
