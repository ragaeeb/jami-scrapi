import { load } from 'cheerio';
import { promises as fs } from 'fs';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { getAllArticleIds, getArticle, getLesson } from '.';
import { getDOM } from '../utils/network';
import { crawlAndCollectArticleLinks, getLinksFromMenu } from './parser';

vi.mock('../utils/network');
vi.mock('./parser');

describe('index', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getArticle', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/al-badr.net/7218.html', 'utf-8');
            (getDOM as Mock).mockResolvedValue(load(html));

            const actual = await getArticle('7218');

            expect(actual).toEqual({
                content: expect.any(String),
                title: 'العزلة',
            });
        });
    });

    describe('getAllArticleIds', () => {
        it('should handle request', async () => {
            (getLinksFromMenu as Mock).mockReturnValue([]);
            (crawlAndCollectArticleLinks as Mock).mockResolvedValue(['/detail/1234']);

            const actual = await getAllArticleIds();

            expect(actual).toEqual(['1234']);
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
