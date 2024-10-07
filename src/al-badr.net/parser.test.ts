import { load } from 'cheerio';
import { promises as fs } from 'fs';
import { describe, expect, it, Mock, vi } from 'vitest';

import { getDOM } from '../utils/network';
import { crawlAndCollectArticleLinks, crawlAndCollectLessonLinks, getLinksFromMenu } from './parser';

vi.mock('../utils/network');

describe('parser', () => {
    describe('getLinksFromMenu', () => {
        it('should parse the links', async () => {
            const html = await fs.readFile('testing/al-badr.net/7218.html', 'utf-8');

            const actual = await getLinksFromMenu(load(html), 'المقالات', /\/muqolats\/\d+/);
            expect(actual).toEqual([
                '/muqolats/1',
                '/muqolats/2',
                '/muqolats/3',
                '/muqolats/4',
                '/muqolats/5',
                '/muqolats/6',
                '/muqolats/7',
                '/muqolats/9',
            ]);
        });
    });

    describe('crawlAndCollectArticleLinks', () => {
        it('should parse the links', async () => {
            let html = await fs.readFile('testing/al-badr.net/muqolat_list.html', 'utf-8');
            (getDOM as Mock).mockResolvedValueOnce(load(html));

            html = await fs.readFile('testing/al-badr.net/muqolat_list_last.html', 'utf-8');
            (getDOM as Mock).mockResolvedValueOnce(load(html));

            const actual = await crawlAndCollectArticleLinks(['https://a.com/page1'], 'https://a.com');
            expect(actual.length).toEqual(34);
        });
    });

    describe('crawlAndCollectLessonLinks', () => {
        it('should parse the links', async () => {
            let html = await fs.readFile('testing/al-badr.net/sub/220.html', 'utf-8');
            (getDOM as Mock).mockResolvedValueOnce(load(html));

            html = await fs.readFile('testing/al-badr.net/sub/220_page_140.html', 'utf-8');
            (getDOM as Mock).mockResolvedValueOnce(load(html));

            html = await fs.readFile('testing/al-badr.net/sub/220_page_160.html', 'utf-8');
            (getDOM as Mock).mockResolvedValueOnce(load(html));

            const actual = await crawlAndCollectLessonLinks(['https://a.com/page1'], 'https://a.com');
            expect(actual.length).toEqual(58);
        });
    });
});
