import { type Page } from 'bimbimba';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { ScrapeResult } from './types.js';
import logger from './utils/logger.js';

const findGaps = (pages: Page[]): number[] => {
    return pages.reduce((gaps: number[], currentPage, index, array) => {
        // If not the last page, check the gap with the next page
        if (index < array.length - 1) {
            const nextPage = array[index + 1];
            // If there's a gap, add the missing pages to the gaps array
            if (nextPage.page - currentPage.page > 1) {
                gaps.push(
                    ...Array.from({ length: nextPage.page - currentPage.page - 1 }, (_, i) => currentPage.page + i + 1),
                );
            }
        }
        return gaps;
    }, [] as number[]);
};

export const joinBooks = async (folder: string, metadata: Record<string, any>, outputFile: string) => {
    const files = (await fs.readdir(folder))
        .filter((file) => file.endsWith('.json'))
        .map((file) => path.join(folder, file));

    logger.info(`Found ${files.length} files to merge`);

    const combined: ScrapeResult = {
        pages: [],
        timestamp: new Date(),
    };

    let lastMetadata: Record<string, any> = {};

    for (const file of files) {
        logger.info(`Processing ${file}`);
        const { pages, ...currentMetadata } = JSON.parse(await fs.readFile(file, 'utf-8'));
        combined.pages = combined.pages.concat(pages);
        lastMetadata = currentMetadata;
    }

    Object.assign(combined, { ...lastMetadata, ...metadata });
    combined.pages = combined.pages.toSorted((a, b) => a.page - b.page);

    const missingPages = findGaps(combined.pages);

    if (missingPages.length > 0) {
        logger.warn(`Missing pages found: ${missingPages.toString()}`);
    }

    logger.info(`Writing ${combined.pages.length} pages to ${outputFile}`);

    await fs.writeFile(outputFile, JSON.stringify(combined, null, 2));
};
