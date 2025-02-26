import { input, select } from '@inquirer/prompts';
import { availableScrapers, getScraper, listFunctions, type Page } from 'bimbimba';

import { PageFetcher } from '../types.js';

type PromptChoicesResult = {
    delay: number;
    end: number;
    func: PageFetcher;
    functionName: string;
    library: string;
    start: number;
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

    const start = parseInt(
        await input({
            message: 'Enter page to start at:',
            required: true,
            validate: (page) => (/\d+/.test(page) ? true : 'Please enter a valid page number'),
        }),
    );

    const end = parseInt(
        await input({
            default: start.toString(),
            message: 'Enter page to end at:',
            required: true,
            validate: (page) => {
                if (!/\d+/.test(page)) {
                    return 'Please enter a valid page number';
                }

                const value = parseInt(page);

                if (value < start) {
                    return 'Ending page number cannot be less than the starting one';
                }

                return true;
            },
        }),
    );

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

    return { delay, end, func: module[func], functionName: func, library, start };
};
