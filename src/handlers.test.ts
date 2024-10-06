import { promises as fs } from 'fs';
import { describe, expect, it } from 'vitest';

import { parseAlBadrNet, parseFerkous, parseSalTaweel, parseShKhudheir } from './handlers';

describe('handlers', () => {
    describe('parseShKhudheir', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/shkhudheir.com/2222.html', 'utf-8');
            const actual = parseShKhudheir(html);

            expect(actual).toEqual({
                body: expect.any(String),
                title: 'مِن أَعظَمِ المِنَن على المُسلِم',
            });
        });
    });

    describe('parseArticle', () => {
        it('should handle saltaweel.com request', async () => {
            const html = await fs.readFile('testing/saltaweel/55.html', 'utf-8');
            const actual = parseSalTaweel(html);

            expect(actual).toEqual({
                body: expect.any(String),
            });
        });

        it('should handle al-badr.net/detail request', async () => {
            const html = await fs.readFile('testing/al-badr.net/detail.html', 'utf-8');
            const actual = parseAlBadrNet(html);

            expect(actual).toEqual({
                body: expect.any(String),
            });
        });

        it('should handle ferkous.com request', async () => {
            const html = await fs.readFile('testing/ferkous.com/1900.html', 'utf-8');
            const actual = parseFerkous(html);

            expect(actual).toEqual({
                body: expect.any(String),
            });
        });

        it('should handle sh-albarrak.com/articles request', async () => {
            const html = await fs.readFile('testing/sh-albarrak.com/23756.html', 'utf-8');
            const actual = parseShAlBarrak(html);

            expect(actual).toEqual({
                body: expect.any(String),
            });
        });
    });
});
