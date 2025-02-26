#!/usr/bin/env bun
import welcome from 'cli-welcome';
import path from 'node:path';
import process from 'node:process';

import packageJson from '../package.json' assert { type: 'json' };
import { joinBooks } from './joiner.js';
import { promptChoices } from './utils/prompts.js';
import { scrape } from './utils/scraper.js';
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

    const outputFile = path.format({ ext: '.json', name: `${library}_${toSnakeCase(functionName)}_${start}_${end}` });

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

const [command, input, outputFile] = process.argv.slice(2);

if (command === '--join') {
    if (!input || !outputFile) {
        throw new Error(`Both an input folder and an output file are required`);
    }

    joinBooks(
        input,
        {
            scrapingEngine: {
                name: packageJson.name,
                version: packageJson.version,
            },
        },
        outputFile,
    );
} else {
    main();
}
