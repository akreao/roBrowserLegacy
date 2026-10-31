import { describe, expect, it, vi } from 'vitest';

// The gamepad wraps the hotbar's list calls to keep its HUD in step; the
// wrappers must pass on every argument (the bar a list is for).
const mocks = vi.hoisted(() => ({
	shortcut: {
		setList: vi.fn(),
		setTab: vi.fn(),
		onChange: vi.fn(),
		setElement: vi.fn()
	},
	renderer: { sync: vi.fn(), updateByIndex: vi.fn(), updateById: vi.fn() }
}));

vi.mock('UI/Components/ShortCut/ShortCut.js', () => ({ default: mocks.shortcut }));
vi.mock('UI/Components/JoystickUI/JoystickUIRenderer.js', () => ({ default: mocks.renderer }));

const { default: Mapper } = await import('UI/Components/JoystickUI/JoystickShortcutMapper.js');

describe('JoystickShortcutMapper.prepare', () => {
	it('passes the bar on to the hotbar and resyncs the HUD', () => {
		const setList = mocks.shortcut.setList;
		const setTab = mocks.shortcut.setTab;
		Mapper.prepare();

		const list = [{ isSkill: 1, ID: 19, count: 10 }];
		mocks.shortcut.setList(list, 1, 2);
		expect(setList).toHaveBeenCalledWith(list, 1, 2);

		mocks.shortcut.setTab(1);
		expect(setTab).toHaveBeenCalledWith(1);
		expect(mocks.renderer.sync).toHaveBeenCalledTimes(2);
	});
});
