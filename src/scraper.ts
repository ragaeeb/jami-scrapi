import type { Page } from 'bimbimba';

import { promises as fs } from 'node:fs';
import process from 'node:process';

import logger from './utils/logger.js';

export const scrape = async ({
    end,
    func,
    metadata,
    outputFile,
    start,
}: {
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
        logger.info(`Downloading page ${i}`);

        try {
            let result = await func(i);

            if (Array.isArray(result)) {
                pages.push(...result);
                i += result.length - 1;
            } else {
                pages.push(result);
            }
        } catch (err: any) {
            if (err.cause === 404) {
                logger.warn(`Page ${i} not found`);
            }
        }
    }

    return saveProgress();
};
