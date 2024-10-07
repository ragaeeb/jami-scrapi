import { load } from 'cheerio';
import { promises as fs } from 'fs';
import { describe, expect, it, Mock, vi } from 'vitest';

import { getPage } from '.';
import { getDOM } from '../utils/network';

vi.mock('../utils/network');

describe('index', () => {
    describe('getPage', () => {
        it('should handle request', async () => {
            const html = await fs.readFile('testing/rabee.net/713.html', 'utf-8');
            (getDOM as Mock).mockResolvedValue(load(html));

            const actual = await getPage(713);

            expect(actual).toEqual({
                content: expect.any(String),
                title: 'هل يجوز في أيام عشر ذي الحجة تقليم الأظافر وحلق الشعر بما في ذلك تخفيف اللحية أو حلقها؟',
            });
        });
    });
});
