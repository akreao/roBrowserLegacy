/**
 * tests/ui/WhisperBox.resize.test.js
 *
 * Whisper windows resize like the official ones: 280x120 to 512x384, in 32px steps.
 */
import { expect, it, vi } from 'vitest';

vi.mock('DB/DBManager.js', () => ({ default: { getMessage: () => '' } }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		static MouseMode = { STOP: 'stop' };
	}
}));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_key, def) => def } }));
vi.mock('Renderer/Renderer.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/History.js', () => ({ default: class {} }));
vi.mock('Audio/SoundManager.js', () => ({ default: {} }));
vi.mock('UI/Components/NpcBox/NpcBox.js', () => ({ default: {} }));
vi.mock('UI/Components/NpcMenu/NpcMenu.js', () => ({ default: {} }));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: {} }));

const { snapSize } = await import('UI/Components/WhisperBox/WhisperBox.js');

it('keeps the width between 280 and 512 in 32px steps', () => {
	expect(snapSize(150, 280, 512)).toBe(280);
	expect(snapSize(311, 280, 512)).toBe(280);
	expect(snapSize(312, 280, 512)).toBe(312);
	expect(snapSize(500, 280, 512)).toBe(472);
	expect(snapSize(900, 280, 512)).toBe(504);
});

it('keeps the height between 120 and 384 in 32px steps', () => {
	expect(snapSize(100, 120, 384)).toBe(120);
	expect(snapSize(160, 120, 384)).toBe(152);
	expect(snapSize(1000, 120, 384)).toBe(376);
});
