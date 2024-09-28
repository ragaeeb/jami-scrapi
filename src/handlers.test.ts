import { promises as fs } from 'fs';
import { describe, expect, it } from 'vitest';

import { parseAlAlbaanyCom, parseAlAtharNet, parseShRajhi, parseZubairAliZai } from './handlers';

describe('handlers', () => {
    describe('parseAlAlbaanyCom', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/al-albaany.com/1500.htm', 'utf-8');
            const actual = parseAlAlbaanyCom(html);

            expect(actual).toEqual({
                body: expect.any(String),
                bookName: 'سلسلة الهدى والنور',
                part: 1050,
                title: expect.any(String),
            });
        });
    });

    describe('parseZubairAliZai', () => {
        it('should handle request', async () => {
            const jsCode = await fs.readFile('testing/zubair_ali_zai/ibnemaja_1200.js', 'utf-8');
            const actual = parseZubairAliZai(jsCode);

            expect(actual).toEqual({ body: expect.any(String), footer: 'بخاری ومسلم' });
        });
    });

    describe('parseAlAtharNet', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/alathar.net/110022.html', 'utf-8');
            const actual = parseAlAtharNet(html);

            expect(actual).toEqual({
                body: expect.any(String),
                bookName: 'صحيح مسلم',
                chapterName: 'كتاب الصيام والإعتكاف-02b',
                metadata: { author: 'الشيخ محمد بن صالح العثيمين' },
                title: expect.any(String),
            });
        });
    });

    describe('parseShRajhi', () => {
        it('should handle request', async () => {
            const json = JSON.parse(await fs.readFile('testing/shrajhi.com/lesson.json', 'utf-8'));
            const actual = parseShRajhi(json);

            expect(actual).toEqual([
                { body: expect.any(String), id: 690, sourceUpdatedAt: expect.any(Number), title: expect.any(String) },
                { body: expect.any(String), id: 691, sourceUpdatedAt: expect.any(Number), title: expect.any(String) },
            ]);
        });
    });
});
