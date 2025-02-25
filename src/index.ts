#!/usr/bin/env bun
import welcome from 'cli-welcome';
import path from 'node:path';

import packageJson from '../package.json' assert { type: 'json' };
import { scrape } from './scraper.js';
import { promptChoices } from './utils/prompts.js';
import { toSnakeCase } from './utils/textUtils.js';

const main = async () => {
    welcome({
        bgColor: `#FADC00`,
        bold: true,
        color: `#000000`,
        title: packageJson.name,
        version: packageJson.version,
    });

    const { delay, end, func, functionName, library, start } = await promptChoices();

    const outputFile = path.format({ ext: '.json', name: `${library}_${toSnakeCase(functionName)}` });

    await scrape({
        delay,
        end,
        func,
        metadata: {
            scrapingEngine: {
                name: packageJson.name,
                version: packageJson.version,
            },
        },
        outputFile,
        start,
    });
};

main();
