import { setTimeout } from 'node:timers/promises';
import type { Page } from 'bimbimba';
import { CatsaJanga } from 'catsa-janga';
import type { Logger as PinoLogger } from 'pino';

import type { ScrapeResult } from '../types.js';

import { getRandomInt } from './random.js';

type ScrapeProps = {
    delay: number;
    func(page: number): Promise<Page | Page[]>;
    logger: Pick<PinoLogger, 'error' | 'info' | 'warn'>;
    metadata?: Record<string, any>;
    outputFile: string;
    pageNumbers: number[];
    randomInt?: typeof getRandomInt;
};

/**
 * Iterates through the requested page numbers and persists the progress of the scrape to disk.
 *
 * @param delay - Delay in seconds between page fetches.
 * @param func - Scraper function capable of fetching a page.
 * @param logger - Logger used to emit progress and error information.
 * @param metadata - Metadata to include with persisted results.
 * @param outputFile - File location where progress snapshots should be written.
 * @param pageNumbers - List of page numbers to scrape.
 * @param randomInt - Optional RNG used to determine retry backoff delays (defaults to `getRandomInt`).
 * @returns The final persisted scrape result as returned by the progress saver.
 */
export const scrape = async ({
    delay,
    func,
    logger,
    metadata,
    outputFile,
    pageNumbers,
    randomInt,
}: ScrapeProps) => {
    const pages: Page[] = [];

    const pickRandomInt = randomInt ?? getRandomInt;

    const progressSaver = new CatsaJanga<Partial<ScrapeResult>>({
        getData: () => ({ ...metadata, pages: pages.toSorted((a, b) => a.page - b.page) }),
        logger,
        outputFile,
    });

    for (let i = 0; i < pageNumbers.length; i++) {
        const pageNumber = pageNumbers[i];

        try {
            logger.info(`Downloading page ${pageNumber}`);
            const page = await func(pageNumber);

            if (Array.isArray(page)) {
                pages.push(...page);
            } else {
                pages.push({ accessed: new Date(), ...page });
            }

            if (delay) {
                await setTimeout(delay * 1000);
            }
        } catch (err: any) {
            if (err.cause === 404) {
                logger.warn(`Page ${pageNumber} not found`);
            } else if (err.status >= 500 && err.status <= 502) {
                const backoffDelay = pickRandomInt(60, 240);
                logger.error(`${err.status} code detected. Delaying for ${backoffDelay} seconds...`);
                i--;
                await setTimeout(backoffDelay * 1000);
            }
        }
    }

    return progressSaver.saveProgress();
};
