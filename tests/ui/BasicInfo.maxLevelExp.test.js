import { beforeEach, describe, expect, it, vi } from 'vitest';

// At the last base level the server sends 0 as the next level's experience.
// The official client then hides the bar and writes the experience as 100.0%.
const mocks = vi.hoisted(() => ({ pending: [], root: null }));

class MockGUIComponent {
	getRoot() {
		return mocks.root;
	}
}
vi.mock('UI/GUIComponent.js', () => ({ default: MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: component => component } }));
vi.mock('Core/Client.js', () => ({
	default: {
		// Answers when the test says so, and in any order.
		loadFile: (filename, onload) => mocks.pending.push({ filename, answer: () => onload(filename) })
	}
}));
vi.mock('Core/Preferences.js', () => ({ default: { get: () => ({ save: vi.fn() }) } }));
vi.mock('Core/Configs.js', () => ({ default: { get: () => false } }));
vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '' } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20221005 } }));
const stub = vi.hoisted(() => () => ({ default: {} }));
vi.mock('DB/Monsters/MonsterTable.js', stub);
vi.mock('Renderer/Renderer.js', stub);
vi.mock('Engine/SessionStorage.js', stub);
vi.mock('UI/Components/Inventory/Inventory.js', stub);
vi.mock('UI/Components/Equipment/Equipment.js', stub);
vi.mock('UI/Components/PartyFriends/PartyFriends.js', stub);
vi.mock('UI/Components/Guild/Guild.js', stub);
vi.mock('UI/Components/Bank/Bank.js', stub);
vi.mock('UI/Components/Escape/Escape.js', stub);
vi.mock('UI/Components/WorldMap/WorldMap.js', stub);
vi.mock('UI/Components/CheckAttendance/CheckAttendance.js', stub);
vi.mock('UI/Components/ChatRoomCreate/ChatRoomCreate.js', stub);
vi.mock('UI/Components/Rodex/Rodex.js', stub);
vi.mock('UI/Components/WinStats/WinStats.js', stub);
vi.mock('UI/Components/Navigation/Navigation.js', stub);
vi.mock('UI/Components/SkillList/SkillList.js', stub);
vi.mock('UI/Components/Quest/Quest.js', stub);
vi.mock('UI/Components/Achievement/Achievement.js', stub);
vi.mock('UI/Components/Reputation/Reputation.js', stub);

const { createBasicInfo } = await import('UI/Components/BasicInfo/BasicInfoCommon.js');

describe('Basic Information experience at the last level', () => {
	let info;
	beforeEach(() => {
		mocks.root = document.createElement('div');
		mocks.root.innerHTML = '<div class="bexp"><div></div></div><span class="bexp_value"></span>';
		info = createBasicInfo({ name: 'ExpTest', htmlText: '', cssText: '', prefKey: 'ExpTest', innerId: '#x' });
	});

	it('reads 100.0% and hides the bar', () => {
		info.update('bexp', 123456, 1000000);
		expect(mocks.root.querySelector('.bexp_value').textContent).toBe('12.3%');
		info.update('bexp', 0, 0);
		expect(mocks.root.querySelector('.bexp_value').textContent).toBe('100.0%');
		expect(mocks.root.querySelector('.bexp').style.display).toBe('none');
	});
});
