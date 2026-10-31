import { describe, expect, it, vi } from 'vitest';

// Hovering the weight in the official Basic Info window shows "Weight %d%%".
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

describe('the Basic Information weight hover text', () => {
	it('reads Weight and a whole percentage', () => {
		mocks.root = document.createElement('div');
		mocks.root.innerHTML = '<span class="weight"></span>';
		const info = createBasicInfo({ name: 'TipTest', htmlText: '', cssText: '', prefKey: 'TipTest', innerId: '#x' });
		info.update('weight', 4567, 10000);
		expect(mocks.root.querySelector('.weight').title).toBe('Weight 45%');
	});
});
