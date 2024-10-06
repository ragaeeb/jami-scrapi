import { describe, expect, it } from 'vitest';

import { getAudio } from '../src/al-albany.com/index';

describe('e2e', () => {
    describe('al-albany.com', () => {
        describe('getAudio', () => {
            it('should get the audio', async () => {
                const result = await getAudio(1500);
                console.log('result', result);
            });
        });
    });

    describe.skip('scrape', () => {
        const getPages = async (start: number, end: number, pattern: string) => {
            return await scrape(start, end, getUrlPatterns().find((url) => url.includes(pattern)) as string);
        };

        it(
            'should scrape saltaweel.com article',
            async () => {
                const pages = await getPages(55, 56, 'saltaweel.com');

                expect(pages).toEqual([
                    { body: expect.any(String), id: 55 },
                    { body: expect.any(String), id: 56 },
                ]);
            },
            { timeout: 10000 },
        );

        it(
            'should scrape al-badr.net article',
            async () => {
                const pages = await getPages(6706, 6707, 'al-badr.net/muqolat');

                expect(pages).toEqual([{ body: expect.any(String), id: 6706 }]);
            },
            { timeout: 10000 },
        );

        it(
            'should scrape alathar.net article',
            async () => {
                const pages = await getPages(110022, 110022, 'alathar.net/home');

                expect(pages).toEqual([
                    {
                        body: expect.any(String),
                        bookName: 'صحيح مسلم',
                        chapterName: 'كتاب الصيام والإعتكاف-02b',
                        id: 110022,
                        metadata: { author: 'الشيخ محمد بن صالح العثيمين' },
                        title: 'هل المقصود بأهل الكتاب هنا الذين كانوا على الحق أم الكفار ؟',
                    },
                ]);
            },
            { timeout: 10000 },
        );
    });
});
