/**
 * tests/engine/MapEngine.Homun.rename.test.js
 *
 * Renaming the homunculus asks first, as the official client does.
 */
import { expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ sent: [], prompt: vi.fn(), messages: {} }));

vi.mock('Network/NetworkManager.js', () => ({
	default: { hookPacket: vi.fn(), sendPacket: pkt => mocks.sent.push(pkt) }
}));
vi.mock('DB/DBManager.js', () => ({
	default: {
		getMessage: (id, defaultText) => mocks.messages[id] ?? (defaultText !== undefined ? defaultText : 'NO MSG ' + id)
	}
}));
vi.mock('UI/UIManager.js', () => ({ default: { showPromptBox: mocks.prompt } }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({ default: { addText: vi.fn(), TYPE: {}, FILTER: {} } }));
vi.mock('UI/Components/HomunInformations/HomunInformations.js', () => ({ default: {} }));
vi.mock('UI/Components/SkillListMH/SkillListMH.js', () => ({ default: { homunculus: {} } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: { world: { x: 0, y: 0 } } }));

await import('Engine/MapEngine/Homun.js');
const { default: HomunInformations } = await import('UI/Components/HomunInformations/HomunInformations.js');
const { default: PACKET } = await import('Network/PacketStructure.js');

it('asks before sending the new name and sends it on OK', () => {
	HomunInformations.reqNameEdit('Lif');

	expect(mocks.sent).toHaveLength(0);
	const [text, , , onYes] = mocks.prompt.mock.calls[0];
	expect(text).toBe("Are you sure you want to change your Homunculus's name to ^0000ffLif^000000?");
	onYes();
	expect(mocks.sent).toHaveLength(1);
	expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.RENAME_MER);
	expect(mocks.sent[0].name).toBe('Lif');
});

it('does not ask twice while the question is open', () => {
	mocks.prompt.mockReset();
	const host = document.createElement('div');
	document.body.appendChild(host);
	mocks.prompt.mockReturnValue({ _host: host });

	HomunInformations.reqNameEdit('Amistr');
	HomunInformations.reqNameEdit('Amistr');
	expect(mocks.prompt).toHaveBeenCalledTimes(1);

	host.remove();
	HomunInformations.reqNameEdit('Amistr');
	expect(mocks.prompt).toHaveBeenCalledTimes(2);
});

it('puts the name into a translated message', () => {
	mocks.prompt.mockReset();
	mocks.messages[2977] = 'Renommer en %s ?';
	HomunInformations.reqNameEdit('Vanil$&');
	expect(mocks.prompt.mock.calls[0][0]).toBe('Renommer en Vanil$& ?');
});
