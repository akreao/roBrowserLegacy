import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ShortCutControls', () => {
	beforeEach(() => {
		vi.resetModules();
	});

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

	it('leaves a new entry unbound when the player already uses its key', async () => {
		const ctrlF12 = { key: 123, alt: false, ctrl: true, shift: false };
		localStorage.setItem(
			'ShortCutControls',
			JSON.stringify({
				_version: 1.2,
				ShortCuts: {
					F1_1: { init: { key: 112 }, cust: ctrlF12, component: 'ShortCut', cmd: 'EXECUTE0' }
				}
			})
		);

		const { default: ShortCutControls } = await import('Preferences/ShortCutControls.js');

		expect(ShortCutControls.ShortCuts.F1_1.cust).toEqual(ctrlF12);
		expect(ShortCutControls.ShortCuts.SkillBarRotate.cust).toMatchObject({ key: '' });
	});
});
