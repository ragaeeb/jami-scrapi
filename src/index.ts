import axios from 'axios';
import process from 'process';
import { setTimeout } from 'timers/promises';

import { URL_ID_PLACEHOLDER } from './constants';
import { UrlPatternToHandler } from './patterns';
import { JsonSerializable } from './types';
import { getRandomWaitTime } from './utils/errors';
import log from './utils/logger';

export const scrape = async (start: number, end: number, template: string) => {
    const result: JsonSerializable[] = [];
    const handler = UrlPatternToHandler[template];

    process.on('SIGINT', () => {
        log.info(`EXIT DETECTED: ${result.length} items`);
        process.exit();
    });

    for (let i = start; i <= end; i++) {
        try {
            const url = template.replace(URL_ID_PLACEHOLDER, i.toString());

            log.info(`Visiting ${url}`);
            const response = await axios.get(url);
            const item = handler(response.data);

            if (Array.isArray(item)) {
                result.push(...item);
            } else if (item) {
                result.push({ ...item, id: i });
            } else {
                log.warn(`Skipping ${url}`);
            }
        } catch (error: any) {
            if (error.code === 'ECONNREFUSED') {
                const waitTime = getRandomWaitTime(55, 100);
                log.error(`Rate limiting detected, will retry after ${waitTime / 1000} seconds`);
                await setTimeout(waitTime);
                i--;
            } else if (error.response?.status === 404) {
                log.warn('404');
            } else if (error.code === 'InvalidContentType') {
                log.warn(`Non-HTML content received ${error.message}`);
            } else {
                log.error(error);
            }
        }
    }
};
