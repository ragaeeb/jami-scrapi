import fs from 'node:fs';
import { checkbox, input, select } from '@inquirer/prompts';
import { availableScrapers, customScrapers, getScraper, listFunctions } from 'bimbimba';
import { parsePageRanges } from 'bitaboom';

import type { PageFetcher } from '@/types.js';
import { sanitizeInput } from './textUtils.js';
import { getRouteKeys } from './wordpress.js';

type PromptChoicesResult = {
    delay: number;
    func: PageFetcher;
    functionName: string;
    library: string;
    pageNumbers: number[];
};

/**
 * Walks the user through selecting a scraper, function and pagination strategy.
 *
 * @returns The resolved scraper metadata used to kick off a scraping session.
 */
export const promptChoices = async (): Promise<PromptChoicesResult> => {
    const allScrapers = availableScrapers.concat(customScrapers).sort();

    const library: string = await select({
        choices: allScrapers,
        message: 'Select library',
        pageSize: allScrapers.length,
    });

    const module = await getScraper(library);
    // eslint-disable-next-line prefer-const
    let [func, ...functions] = listFunctions(module);

    if (functions.length > 0) {
        func = await select({
            choices: [func, ...functions],
            message: 'Select function',
        });
    }

    const ranges = await input({
        message: 'Enter page ranges (e.g., "1-55" or "1,2,3,5,9,11"):',
        required: true,
        validate: (page) =>
            /^(\d+-\d+|\d+(,\d+)*)$/.test(page) ? true : 'Please enter a valid page range or comma-separated pages',
    });

    const pageNumbers = parsePageRanges(ranges);
    const delayValue = await input({
        default: '0',
        message: 'Enter delay in seconds between requests:',
        required: false,
        validate: (page) => {
            if (!/\d+/.test(page)) {
                return 'Please enter a valid delay in seconds';
            }

            return true;
        },
    });

    const delay = parseInt(delayValue, 10) || 0;

    return { delay, func: module[func], functionName: func, library, pageNumbers };
};

/**
 * Captures the folder to join and the output file for the joiner workflow.
 *
 * @returns The normalised input folder and output file path.
 */
export const promptPostProcessor = async () => {
    const inputFolder = await input({
        message: 'Enter the folder:',
        required: true,
        validate: (folder) => {
            if (!folder) {
                return 'Folder is required';
            }

            const escapedFolder = sanitizeInput(folder);

            if (fs.existsSync(escapedFolder) && fs.lstatSync(escapedFolder).isDirectory()) {
                return true;
            }

            return 'Please enter a valid folder';
        },
    });

    const outputFile = await input({
        message: 'Enter the output file:',
        required: true,
        validate: (file) => (file.endsWith('.json') ? true : 'Please enter a valid JSON file'),
    });

    return { inputFolder: inputFolder.trim(), outputFile: outputFile.trim() };
};

/**
 * Captures the WordPress host and route filters for a scrape run.
 *
 * @returns The host, selected routes and a default URL pattern.
 */
export const promptWordpress = async () => {
    const host = await input({
        message: 'Enter the host (ie: https://abc.com):',
        required: true,
        validate: (input) => (input ? true : 'Please enter a valid host'),
    });

    const routeKeys = await getRouteKeys(host);

    const routes: string[] = await checkbox({
        choices: routeKeys,
        message: 'Enter the routes you want to scrape:',
        required: true,
    });

    return { host, routes, urlPattern: `${host}?p={{page}}` };
};
