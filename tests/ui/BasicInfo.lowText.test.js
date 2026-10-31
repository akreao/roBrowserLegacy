import { beforeEach, describe, expect, it, vi } from 'vitest';

// The official client writes HP and SP in red in the reduced Basic Info window
// while they are under a quarter of their maximum.
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

function textColor(type, value, max) {
	const info = createBasicInfo({ name: 'LowTest', htmlText: '', cssText: '', prefKey: 'LowTest', innerId: '#x' });
	info.update(type, value, max);
	return mocks.root.querySelector(`.${type}_text`).style.color;
}

describe('the reduced Basic Information HP and SP text', () => {
	beforeEach(() => {
		mocks.root = document.createElement('div');
		mocks.root.innerHTML = `
			<span class="hp_text"><span class="hp_value"></span>/<span class="hp_max_value"></span></span>
			<span class="sp_text"><span class="sp_value"></span>/<span class="sp_max_value"></span></span>`;
	});

	it('is red under a quarter', () => {
		expect(textColor('hp', 249, 1000)).toBe('red');
		expect(textColor('sp', 24, 100)).toBe('red');
	});

	it('is the normal colour from a quarter on', () => {
		expect(textColor('hp', 250, 1000)).toBe('');
		expect(textColor('sp', 100, 100)).toBe('');
	});
});
