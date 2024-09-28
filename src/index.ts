import axios from 'axios';
import process from 'process';

import { URL_ID_PLACEHOLDER } from './constants';
import { UrlPatternToHandler } from './patterns';
import { Page } from './types';
import { ProgressError } from './utils/errors';
import log from './utils/logger';

export const getUrlPatterns = (): string[] => {
    return Object.keys(UrlPatternToHandler);
};

export const scrape = async (start: number, end: number, urlTemplate: string): Promise<Page[]> => {
    const result: Page[] = [];
    const handler = UrlPatternToHandler[urlTemplate];

    process.on('SIGINT', () => {
        log.warn(`User Interrupt detected: ${result.length} items`);
        throw new ProgressError(`User Interrupt`, result, null);
    });

    for (let i = start; i <= end; i++) {
        try {
            const url = urlTemplate.replace(URL_ID_PLACEHOLDER, i.toString());

            log.info(`Visiting ${url}`);
            const response = await axios.get(url);
            const item = handler(response.data);

            if (Array.isArray(item)) {
                result.push(...item);
            } else if (item) {
                result.push({ id: i, ...item });
            } else {
                log.warn(`Skipping ${url}`);
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                log.warn('404');
            } else if (error.code === 'InvalidContentType') {
                log.warn(`Non-HTML content received ${error.message}`);
            } else {
                log.error(error);
                throw new ProgressError(`Error during scrape`, result, error);
            }
        }
    }

    return result;
};
