import { describe, expect, it } from 'vitest';

describe('ShortCutControls', () => {
	it('adds entries that are newer than the saved keys, and keeps the saved ones', async () => {
		const custom = { key: 81, alt: false, ctrl: false, shift: false };
		localStorage.setItem(
			'ShortCutControls',
			JSON.stringify({
				_version: 1.2,
				ShortCuts: {
					F1_1: { init: { key: 112 }, cust: custom, component: 'ShortCut', cmd: 'EXECUTE0' }
				}
			})
		);

		const { default: ShortCutControls } = await import('Preferences/ShortCutControls.js');

		expect(ShortCutControls.ShortCuts.F1_1.cust).toEqual(custom);
		expect(ShortCutControls.ShortCuts.SkillBarRotate).toMatchObject({
			init: { ctrl: true },
			component: 'ShortCut',
			cmd: 'ROTATE'
		});
	});
});
