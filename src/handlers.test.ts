import { promises as fs } from 'fs';
import { describe, expect, it } from 'vitest';

import { parseShRajhi, parseZubairAliZai } from './handlers';

describe('handlers', () => {
    describe('parseZubairAliZai', () => {
        it('should handle request', async () => {
            const jsCode = await fs.readFile('testing/zubair_ali_zai/ibnemaja_1200.js', 'utf-8');
            const actual = parseZubairAliZai(jsCode);

            expect(actual).toEqual({ body: expect.any(String), description: '', hukm: 'بخاری ومسلم' });
        });
    });

    describe('parseShRajhi', () => {
        it('should handle request', async () => {
            const json = JSON.parse(await fs.readFile('testing/shrajhi.com/lesson.json', 'utf-8'));
            const actual = parseShRajhi(json);

            expect(actual).toEqual([
                { body: expect.any(String), id: 690, title: expect.any(String), updatedAt: expect.any(Number) },
                { body: expect.any(String), id: 691, title: expect.any(String), updatedAt: expect.any(Number) },
            ]);
        });
    });
});
