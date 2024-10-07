import { load } from 'cheerio';
import { promises as fs } from 'fs';
import { describe, expect, it, Mock, vi } from 'vitest';

import { getAllArticleIds, getArticle, getLesson } from '.';
import { getDOM } from '../utils/network';

vi.mock('../utils/network');

describe('index', () => {
    describe('getArticle', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/al-badr.net/7218.html', 'utf-8');
            (getDOM as Mock).mockResolvedValue(load(html));

            const actual = await getArticle(7218);

            expect(actual).toEqual({
                content: expect.any(String),
                title: 'العزلة',
            });
        });
    });

    describe('getAllArticleIds', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/al-badr.net/7218.html', 'utf-8');
            (getDOM as Mock).mockResolvedValue(load(html));

            const actual = await getAllArticleIds();

            expect(actual).toEqual([]);
        });
    });

    describe('getLesson', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/al-badr.net/T0RjDkx4Wb.html', 'utf-8');
            (getDOM as Mock).mockResolvedValue(load(html));

            const actual = await getLesson('T0RjDkx4Wb');

            expect(actual).toEqual({
                audioFile: 'http://www.al-badr.net/download/esound/khutob/003_034.mp3',
                content: 'خطبة جمعة بتاريخ / 30-12-1427 هـ',
                title: 'نعمة الهداية إلى دين الإسلام',
                transcript: { file: 'https://al-badr.net/dl/doc/T0RjDkx4Wb' },
            });
        });

        it('should handle request', async () => {
            const html = await fs.readFile('testing/al-badr.net/HK9FCGy2jkOD.html', 'utf-8');
            (getDOM as Mock).mockResolvedValue(load(html));

            const actual = await getLesson('HK9FCGy2jkOD');

            expect(actual).toEqual({
                content: expect.any(String),
                title: 'متى يفلح',
            });
        });
    });
});
