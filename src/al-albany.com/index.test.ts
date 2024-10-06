import { load } from 'cheerio';
import { promises as fs } from 'fs';
import { describe, expect, it, Mock, vi } from 'vitest';

import { getAudio, SpeakerId } from '.';
import { getDOM } from '../utils/network';

vi.mock('../utils/network');

describe('index', () => {
    describe('getAudio', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/al-albaany.com/1500.htm', 'utf-8');
            (getDOM as Mock).mockResolvedValue(load(html));

            const actual = await getAudio(1500);

            expect(actual).toEqual({
                content: [
                    { speaker: { id: SpeakerId.AbuLayla, name: 'أبو ليلى' }, text: expect.any(String) },
                    { speaker: { id: SpeakerId.Shaykh, name: 'الشيخ' }, text: expect.any(String) },
                ],
                file: 'https://www.al-albany.com/audios/mp3/1/1050.mp3#t=00:58:41',
                tape: 'سلسلة الهدى والنور',
                tapeNumber: '1050',
                timestamp: 3521,
                title: 'الكلام على محفل ماسوني أقيم ببعض البلاد العربية والكلام الذي أثير عن الشيخ الألباني.',
            });
        });
    });
});
