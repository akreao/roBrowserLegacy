/**
 * tests/ui/QuestWindow.menu.test.js
 *
 * The on-screen quest tracker matches the official UIQuestDisplay: five quests at most,
 * "( Complete )" on a finished hunt, and a right-click menu on a quest's title.
 */
import { describe, expect, it, vi } from 'vitest';

vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: { DEFAULT: 0 }, setType: vi.fn(), getActualType: vi.fn() } }));
vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: 'data/texture/ui/',
		getMessage: (id, fallback) => ({ 351: 'Delete', 1622: 'Shows Quest information', 2030: 'Complete' })[id] ?? fallback
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn(), loadFiles: vi.fn() } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { setOverEntity: vi.fn() } }));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: component => component } }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: { screen: { x: 0, y: 0 } } }));

const config = { legacyQuestTracker: false };
vi.mock('Core/Configs.js', () => ({ default: { get: (key, fallback) => (key in config ? config[key] : fallback) } }));
const menu = [];
vi.mock('UI/Components/ContextMenu/ContextMenu.js', () => ({
	default: {
		remove: () => menu.splice(0),
		append: vi.fn(),
		addElement: (text, callback) => menu.push({ text, callback })
	}
}));

const QuestWindow = (await import('UI/Components/Quest/Quest/QuestWindow.js')).default;

const quest = (questID, hunts = {}) => ({ questID, active: 1, end_time: 0, title: `Quest ${questID}`, summary: '', hunt_list: hunts });

function show(quests) {
	QuestWindow.prepare();
	QuestWindow.ClearQuestList();
	QuestWindow.setQuestList(quests, []);
	return [...QuestWindow.getRoot().querySelectorAll('.quest-window-li')];
}

describe('the quest tracker', () => {
	it('shows five quests at most', () => {
		const quests = {};
		for (let i = 1; i <= 7; i++) {
			quests[i] = quest(i);
		}
		expect(show(quests)).toHaveLength(5);
	});

	it('marks a finished hunt Complete', () => {
		const [li] = show({
			1: quest(1, {
				a: { mobName: 'Poring', huntCount: 3, maxCount: 3 },
				b: { mobName: 'Lunatic', huntCount: 1, maxCount: 5 }
			})
		});
		const lines = [...li.querySelectorAll('.quest-window-li-monster li')].map(el => el.textContent);
		expect(lines).toEqual(['Poring ( Complete )', 'Lunatic ( 1 / 5 )']);
	});

	it('opens Shows Quest information and Delete on a right click on the title', () => {
		const second = quest(2);
		const [, li] = show({ 1: quest(1), 2: second });
		const onShowInfo = vi.fn();
		const onDelete = vi.fn();
		QuestWindow.onShowInfo = onShowInfo;
		QuestWindow.onDelete = onDelete;

		const title = li.querySelector('.quest-window-li-title');
		const event = new MouseEvent('mousedown', { button: 2, bubbles: true, composed: true });
		const outside = vi.fn();
		window.addEventListener('mousedown', outside);
		title.dispatchEvent(event);
		window.removeEventListener('mousedown', outside);

		expect(outside).not.toHaveBeenCalled();
		expect(menu.map(item => item.text)).toEqual(['Shows Quest information', 'Delete']);
		menu[0].callback();
		expect(onShowInfo).toHaveBeenCalledWith(second);
		menu[1].callback();
		expect(onDelete).toHaveBeenCalledWith(second);
	});
});

describe('the legacy quest tracker', () => {
	it('shows four quests and counts hunts to the end', () => {
		config.legacyQuestTracker = true;
		const quests = {};
		for (let i = 1; i <= 7; i++) {
			quests[i] = quest(i, i === 1 ? { a: { mobName: 'Poring', huntCount: 3, maxCount: 3 } } : {});
		}
		const shown = show(quests);
		config.legacyQuestTracker = false;
		expect(shown).toHaveLength(4);
		expect(shown[0].querySelector('.quest-window-li-monster li').textContent).toBe('Poring ( 3 / 3 )');
	});
});
