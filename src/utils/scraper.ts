import type { Page } from 'bimbimba';

import { setTimeout } from 'node:timers/promises';
import { type Logger as PinoLogger } from 'pino';

import { ProgressSaver } from './progressSaver.js';
import { getRandomInt } from './random.js';

type ScrapeProps = {
    delay: number;
    func(page: number): Promise<Page>;
    logger: Pick<PinoLogger, 'error' | 'info' | 'warn'>;
    metadata?: Record<string, any>;
    outputFile: string;
    pageNumbers: number[];
};

export const scrape = async ({ delay, func, logger, metadata, outputFile, pageNumbers }: ScrapeProps) => {
    const pages: Page[] = [];

    const progressSaver = new ProgressSaver({
        getData: () => ({ metadata, pages: pages.toSorted((a, b) => a.page - b.page) }),
        logger,
        outputFile,
    });

    for (let i = 0; i < pageNumbers.length; i++) {
        const pageNumber = pageNumbers[i];

        try {
            logger.info(`Downloading page ${pageNumber}`);
            const page = await func(pageNumber);

            pages.push({ accessed: new Date(), ...page });

            if (delay) {
                await setTimeout(delay * 1000);
            }
        } catch (err: any) {
            if (err.cause === 404) {
                logger.warn(`Page ${pageNumber} not found`);
            } else if (err.status >= 500 && err.status <= 502) {
                const backoffDelay = getRandomInt(60, 240);
                logger.error(`${err.status} code detected. Delaying for ${backoffDelay} seconds...`);
                i--;
                await setTimeout(backoffDelay * 1000);
            }
        }
    }

    return progressSaver.saveProgress();
};
