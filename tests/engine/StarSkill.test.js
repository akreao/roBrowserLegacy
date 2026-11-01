import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Star Gladiator Feeling / Hatred (ZC_STARSKILL 0x20e, ZC_STARPLACE 0x253), as the
// official client (kRO 2025-07-16) handles them: 0xcd9650 picks the chat line by
// `result`, and 0x253 opens UIStarPlaceAcceptWnd, which answers CZ_AGREE_STARPLACE.
const read = file => readFileSync(join(process.cwd(), 'src', file), 'utf8').replace(/\r\n/g, '\n');
const skill = read('Engine/MapEngine/Skill.js');
const handler = skill.slice(skill.indexOf('function onStarSkill('), skill.indexOf('function onTaekwonMission('));

describe('Star Gladiator Feeling and Hatred', () => {
	it('hooks both packets', () => {
		expect(skill).toContain('Network.hookPacket(PACKET.ZC.STARSKILL, onStarSkill);');
		expect(skill).toContain('Network.hookPacket(PACKET.ZC.STARPLACE, onStarPlace);');
	});

	it('keeps the Taekwon Mission line on result 20', () => {
		expect(handler).toMatch(/pkt\.result === 20\) \{\n\t\tonTaekwonMission\(pkt\);/);
	});

	it('picks the official message ids by result and star', () => {
		expect(handler).toContain('(pkt.result === 0 ? 837 : 840) + star');
		expect(handler).toContain('(pkt.result === 10 ? 843 : 846) + star');
		expect(handler).toContain('DB.getMessage(1033)');
	});

	it('plays 543 and T_피링.wav on results 1 and 11, and 432 on a reset', () => {
		expect(handler).toContain('effectId = pkt.result === 1 ? 543 : 0;');
		expect(handler).toContain('effectId = pkt.result === 11 ? 543 : 0;');
		expect(handler).toContain('effectId = 432;');
		expect(handler).toContain("Sound.play('effect/T_\\xc7\\xc7\\xb8\\xb5.wav');");
	});

	it('asks with msg 1028 and answers CZ_AGREE_STARPLACE with the star', () => {
		expect(handler).toContain('UIManager.showPromptBox(DB.getMessage(1028)');
		expect(handler).toContain('new PACKET.CZ.AGREE_STARPLACE()');
		expect(handler).toContain('reply.which = which;');
	});
});
