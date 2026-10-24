import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
		}

		prepare() {
			this._host = document.createElement('div');
			this._host.innerHTML = this.render();
			if (this.init) this.init();
		}

		getRoot() {
			return this._host;
		}

		draggable() {}
	}

	return { MockGUIComponent, autoFeedPets: new Set(), packetver: { value: 20221005 } };
});

vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		getMessage: id => `MSG ${id}`,
		getPetIllustPath: () => '',
		getPetEvolutionByJob: () => null,
		isPetAutoFeedAllowed: job => mocks.autoFeedPets.has(job)
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_name, defaults) => ({ ...defaults, save: vi.fn() }) } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: { ESCAPE: 27, ENTER: 13 } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: mocks.packetver }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));

const PetInformations = (await import('UI/Components/PetInformations/PetInformations.js')).default;

const POPORING = 1031;
const MASTERING = 1090;

function show(job) {
	PetInformations.setInformations({ job, szName: 'Pet', nLevel: 1, nFullness: 50, nRelationship: 250, ITID: 0 });
	return PetInformations.getRoot().querySelector('.feeding').style.display;
}

describe('PetInformations auto-feed checkbox', () => {
	beforeEach(() => {
		mocks.autoFeedPets = new Set([MASTERING]);
		mocks.packetver.value = 20221005;
		PetInformations.prepare();
	});

	it('shows the checkbox for a pet on the auto-feed list', () => {
		expect(show(MASTERING)).toBe('');
	});

	it('hides the checkbox for a pet the server will not auto-feed', () => {
		expect(show(POPORING)).toBe('none');
	});

	it('updates the checkbox when a different pet is hatched', () => {
		expect(show(POPORING)).toBe('none');
		expect(show(MASTERING)).toBe('');
		expect(show(POPORING)).toBe('none');
	});

	it('hides the checkbox for clients older than auto-feeding', () => {
		mocks.packetver.value = 20140101;
		expect(show(MASTERING)).toBe('none');
	});

	it('sends the toggle for a listed pet', () => {
		PetInformations.onConfigUpdate = vi.fn();
		show(MASTERING);
		PetInformations.getRoot().querySelector('.pet_auto_feed').dispatchEvent(new MouseEvent('mousedown'));
		expect(PetInformations.onConfigUpdate).toHaveBeenCalledWith(2, 1);
	});
});
