import { promises as fs } from 'fs';
import { describe, expect, it } from 'vitest';

import { parseZubairAliZai } from './handlers';

describe('handlers', () => {
    describe('parseZubairAliZai', () => {
        it('should handle request', async () => {
            const jsCode = await fs.readFile('testing/zubair_ali_zai/ibnemaja_1200.js', 'utf-8');
            const actual = parseZubairAliZai(jsCode);

            expect(actual).toEqual({ body: expect.any(String), description: '', hukm: 'بخاری ومسلم' });
        });
    });
});
