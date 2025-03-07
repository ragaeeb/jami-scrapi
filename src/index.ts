#!/usr/bin/env bun
import { input, select } from '@inquirer/prompts';
import welcome from 'cli-welcome';
import path from 'node:path';
import { URL } from 'node:url';

import packageJson from '../package.json' assert { type: 'json' };
import { joinBooks } from './joiner.js';
import logger from './utils/logger.js';
import { promptChoices, promptPostProcessor, promptWordpress } from './utils/prompts.js';
import { scrape } from './utils/scraper.js';
import { toSnakeCase } from './utils/textUtils.js';
import { scrapeWordpress } from './utils/wordpress.js';

const scrapeFromBimbimba = async (metadata: Record<string, any>) => {
    const { delay, func, functionName, library, pageNumbers } = await promptChoices();
    const urlPattern = await input({
        message: 'Enter the url pattern:',
        required: true,
        validate: (input) => (input ? true : 'Please enter a valid host'),
    });

    const outputFile = path.format({
        ext: '.json',
        name: `${library}_${toSnakeCase(functionName)}_${pageNumbers[0]}_${pageNumbers.at(-1)}`,
    });

    return scrape({
        delay,
        func,
        logger,
        metadata: { ...metadata, urlPattern },
        outputFile,
        pageNumbers,
    });
};

const main = async () => {
    welcome({
        bgColor: `#FADC00`,
        bold: true,
        clear: false,
        color: `#000000`,
        title: packageJson.name,
        version: packageJson.version,
    });

    const metadata = {
        scrapingEngine: {
            name: packageJson.name,
            version: packageJson.version,
        },
    };

    const action = await select({
        choices: [
            { name: 'Scrape Wordpress site', value: 'wordpress' },
            { name: 'Scrape from bimbimba', value: 'bimbimba' },
            { name: 'Post-process scraped data', value: 'post-process' },
        ],
        message: 'What do you want to do?',
    });

    if (action === 'bimbimba') {
        await scrapeFromBimbimba(metadata);
    } else if (action === 'post-process') {
        const { inputFolder, outputFile } = await promptPostProcessor();
        await joinBooks(inputFolder, metadata, outputFile);
    } else if (action === 'wordpress') {
        const { host, routes, urlPattern } = await promptWordpress();

        await scrapeWordpress({
            host,
            logger,
            metadata: { ...metadata, urlPattern },
            outputFile: path.format({ ext: '.json', name: new URL(host).host }),
            routes,
        });
    }
};

main();
