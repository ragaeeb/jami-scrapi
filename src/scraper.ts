import type { Page } from 'bimbimba';

import { promises as fs } from 'node:fs';
import process from 'node:process';
import { setTimeout } from 'node:timers/promises';

import logger from './utils/logger.js';

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const scrape = async ({
    delay,
    end,
    func,
    metadata,
    outputFile,
    start,
}: {
    delay: number;
    end: number;
    func(page: number): Promise<Page | Page[]>;
    metadata?: Record<string, any>;
    outputFile: string;
    start: number;
}) => {
    const pages: Page[] = [];

    const saveProgress = async () => {
        logger.info(`Saving ${pages.length} pages to ${outputFile}...`);
        await fs.writeFile(
            outputFile,
            JSON.stringify(
                { pages: pages.toSorted((a, b) => a.page - b.page), timestamp: new Date(), ...metadata },
                null,
                2,
            ),
        );
    };

    process.on('SIGINT', () => {
        logger.info('Gracefully shutting down...');
        saveProgress();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        logger.info('Process terminated.');
        saveProgress();
        process.exit(0);
    });

    for (let i = start; i <= end; i++) {
        try {
            logger.info(`Downloading page ${i}`);
            let result = await func(i);

            if (Array.isArray(result)) {
                pages.push(...result);
                i += result.length - 1;
            } else {
                pages.push(result);
            }

            if (delay) {
                await setTimeout(delay * 1000);
            }
        } catch (err: any) {
            if (err.cause === 404) {
                logger.warn(`Page ${i} not found`);
            } else if (err.status >= 500 && err.status <= 502) {
                const backoffDelay = getRandomInt(60, 240);
                logger.error(`${err.status} code detected. Delaying for ${backoffDelay} seconds...`);
                i--;
                await setTimeout(backoffDelay * 1000);
            }
        }
    }

    return saveProgress();
};
