/**
 * tests/engine/MapEngine.Mercenary.delete.test.js
 *
 * Deleting the mercenary asks with the official warning and sends on OK.
 */
import { expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ sent: [], prompt: vi.fn() }));

vi.mock('Network/NetworkManager.js', () => ({
	default: { hookPacket: vi.fn(), sendPacket: pkt => mocks.sent.push(pkt) }
}));
vi.mock('DB/DBManager.js', () => ({
	default: { getMessage: (id, defaultText) => (defaultText !== undefined ? defaultText : 'NO MSG ' + id) }
}));
vi.mock('UI/UIManager.js', () => ({ default: { showPromptBox: mocks.prompt } }));
vi.mock('UI/Components/MercenaryInformations/MercenaryInformations.js', () => ({ default: { ui: { hide: vi.fn() } } }));
vi.mock('UI/Components/SkillListMH/SkillListMH.js', () => ({ default: { mercenary: { ui: { hide: vi.fn() } } } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: () => null } }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: { world: { x: 0, y: 0 } } }));

await import('Engine/MapEngine/Mercenary.js');
const { default: MercenaryInformations } = await import('UI/Components/MercenaryInformations/MercenaryInformations.js');
const { default: PACKET } = await import('Network/PacketStructure.js');

it('warns that the growth history goes too, and deletes on OK', () => {
	MercenaryInformations.reqDeleteMercenary();

	const [text, , , onYes] = mocks.prompt.mock.calls[0];
	expect(text).toContain('will also delete his growth history');
	expect(mocks.sent).toHaveLength(0);
	onYes();
	expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.MER_COMMAND);
	expect(mocks.sent[0].command).toBe(2);
});
