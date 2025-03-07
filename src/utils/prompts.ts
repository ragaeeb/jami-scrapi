import { input, select } from '@inquirer/prompts';
import { availableScrapers, getScraper, listFunctions } from 'bimbimba';
import fs from 'node:fs';

import { PageFetcher } from '../types.js';

type PromptChoicesResult = {
    delay: number;
    func: PageFetcher;
    functionName: string;
    library: string;
    pageNumbers: number[];
};

const parsePageRanges = (pageInput: string): number[] => {
    if (pageInput.includes('-')) {
        const [start, end] = pageInput.split('-').map(Number);

        if (start > end) {
            throw new Error('Start page cannot be greater than end page');
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    } else {
        return pageInput.split(',').map(Number);
    }
};

export const promptChoices = async (): Promise<PromptChoicesResult> => {
    const library: string = await select({
        choices: availableScrapers.toSorted(),
        message: 'Select library',
        pageSize: availableScrapers.length,
    });

    const module = await getScraper(library);
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

    const delay =
        parseInt(
            await input({
                default: '0',
                message: 'Enter delay in seconds between requests:',
                required: false,
                validate: (page) => {
                    if (!/\d+/.test(page)) {
                        return 'Please enter a valid delay in seconds';
                    }

                    return true;
                },
            }),
        ) || 0;

    return { delay, func: module[func], functionName: func, library, pageNumbers };
};

const sanitizeInput = (input: string) => input.trim().replace(/\\ /g, ' ');

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
