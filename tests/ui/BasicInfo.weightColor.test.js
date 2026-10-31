import { beforeEach, describe, expect, it, vi } from 'vitest';

// The official client draws the weight in red from the server's overweight
// percentage (ZC 0x0ade) on, comparing whole percentages. It is 50 until the
// server says otherwise.
const mocks = vi.hoisted(() => ({ pending: [], root: null, session: { overWeightPercent: 50 } }));

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
vi.mock('Engine/SessionStorage.js', () => ({ default: mocks.session }));
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

function weightColor(weight, max) {
	const info = createBasicInfo({ name: 'WeightTest', htmlText: '', cssText: '', prefKey: 'WeightTest', innerId: '#x' });
	info.update('weight', weight, max);
	return mocks.root.querySelector('.weight').style.color;
}

describe('the Basic Information weight colour', () => {
	beforeEach(() => {
		mocks.root = document.createElement('div');
		mocks.root.innerHTML = '<span class="weight"><span class="weight_value"></span>/<span class="weight_total"></span></span>';
		mocks.session.overWeightPercent = 50;
	});

	it('turns red at 50% before the server sends its percentage', () => {
		expect(weightColor(4990, 10000)).toBe('');
		expect(weightColor(5000, 10000)).toBe('red');
	});

	it('follows the percentage the server sent', () => {
		mocks.session.overWeightPercent = 70;
		expect(weightColor(6990, 10000)).toBe('');
		expect(weightColor(7000, 10000)).toBe('red');
	});

	it('compares whole percentages', () => {
		// 69.99% is 69%, under a limit of 70.
		mocks.session.overWeightPercent = 70;
		expect(weightColor(6999, 10000)).toBe('');
	});
});
