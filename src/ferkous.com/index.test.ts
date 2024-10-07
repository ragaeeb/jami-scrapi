import { load } from 'cheerio';
import { promises as fs } from 'fs';
import { describe, expect, it, Mock, vi } from 'vitest';

import { getPage } from '.';
import { getDOM } from '../utils/network';

vi.mock('../utils/network');

describe('index', () => {
    describe('getPage', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/ferkous.com/1900.html', 'utf-8');
            (getDOM as Mock).mockResolvedValue(load(html));

            const actual = await getPage(1900);

            expect(actual).toEqual({
                content: expect.any(String),
            });
        });
    });
});
