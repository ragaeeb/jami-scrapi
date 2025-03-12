import { checkbox, confirm, input, select } from '@inquirer/prompts';
import { Page } from 'bimbimba';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { ScrapeResult } from './types.js';

import logger from './utils/logger.js';
import { sanitizeInput } from './utils/textUtils.js';
import { groupPagesByFields, mapPagesToGroupingFields, transformPage } from './utils/transformUtils.js';

/**
 * Takes in scraped data, and allows transforming it to a different shape based on metadata.
 */
export const transform = async () => {
    const inputFile = sanitizeInput(
        await input({
            message: 'Enter the scrape result:',
            required: true,
            validate: (file) => (sanitizeInput(file).endsWith('.json') ? true : 'Please enter a valid JSON file'),
        }),
    );
    const outputFolder = path.parse(inputFile).name;

    await fs.mkdir(outputFolder, { recursive: true });

    const { pages, ...globalMetadata }: ScrapeResult = JSON.parse(await fs.readFile(inputFile, 'utf-8'));
    const groupingFields = mapPagesToGroupingFields(pages);

    if (groupingFields.size === 0) {
        logger.info('No metadata found');
        return;
    }

    let fields = [...groupingFields];

    if (fields.length > 1) {
        fields = await checkbox({
            choices: fields,
            message: 'Select the fields you want to group by:',
            required: true,
        });
    }

    const partFields = Array.from(groupingFields.difference(new Set(fields)));

    const partField: string | undefined =
        partFields &&
        (await select({
            choices: partFields.map((value) => ({ name: value, value })).concat({ name: 'N/A', value: '' }),
            default: partFields[0],
            message: 'Select the fields you want to extract the part numbers from:',
        }));

    const removePartField = partField
        ? await confirm({
              default: true,
              message: 'Do you want to remove the part field after extraction?',
          })
        : false;

    const groupedPages = groupPagesByFields(pages, fields, '_');

    logger.info(`Creating ${outputFolder}`);

    for (const key of Object.keys(groupedPages)) {
        const pagesForGroup = groupedPages[key] as Page[];

        logger.info(`Processing ${key} which has ${pagesForGroup.length} pages`);
        const pages = pagesForGroup.map((p) => transformPage(p, fields, partField, removePartField));

        const result: ScrapeResult = {
            ...globalMetadata,
            pages,
        };

        const outputFile = path.format({ dir: outputFolder, ext: '.json', name: key || 'unknown' });

        logger.info(`Writing ${outputFile}`);

        await fs.writeFile(outputFile, JSON.stringify(result, null, 2));
    }

    return outputFolder;
};
