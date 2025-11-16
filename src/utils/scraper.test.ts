import { describe, expect, it, mock } from 'bun:test';

mock.module('catsa-janga', () => {
    class FakeCatsaJanga<T> {
        constructor(private readonly options: { getData: () => T }) {}

        saveProgress = mock(() => Promise.resolve(this.options.getData()));
    }

    return { CatsaJanga: FakeCatsaJanga };
});

const zeroBackoff = () => 0;

import { scrape } from './scraper';

const createLogger = () => ({
    error: mock(() => {}),
    info: mock(() => {}),
    warn: mock(() => {}),
});

describe('scraper', () => {
    it('scrapes each page and persists the progress', async () => {
        const logger = createLogger();
        const result = await scrape({
            delay: 0,
            func: async (page) => ({ body: `page-${page}`, page }),
            logger,
            metadata: { source: 'demo' },
            outputFile: 'out.json',
            pageNumbers: [2, 1],
            randomInt: zeroBackoff,
        });

        expect(result.source).toBe('demo');
        expect(result.pages.map((page) => page.page)).toEqual([1, 2]);
        expect(logger.info.mock.calls.length).toBe(2);
    });

    it('retries server errors with exponential backoff', async () => {
        const logger = createLogger();
        const func = mock(async (page: number) => ({ body: `page-${page}`, page }));
        func.mockImplementationOnce(async () => {
            throw Object.assign(new Error('Boom'), { status: 500 });
        });

        await scrape({
            delay: 0,
            func: func as unknown as (page: number) => Promise<{ body: string; page: number }>,
            logger,
            outputFile: 'out.json',
            pageNumbers: [1],
            randomInt: zeroBackoff,
        });

        expect(logger.error.mock.calls.length).toBe(1);
        expect(func.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
});
