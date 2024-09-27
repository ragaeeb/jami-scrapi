import { number, select } from '@inquirer/prompts';
import { URL } from 'url';

import { scrape } from './index';
import { UrlPatternToHandler } from './patterns';

export const init = async () => {
    try {
        const target = await select({
            choices: Object.keys(UrlPatternToHandler).map((value) => {
                const url = new URL(value);
                return { description: value, name: url.host + decodeURI(url.pathname), value };
            }),
            message: 'Select the url to scrape',
            pageSize: 100,
        });

        const start = await number({ message: 'Enter starting page id', min: 1, required: true });
        const end = await number({ message: 'Enter ending page id', min: start, required: true });

        await scrape(start as number, end as number, target);
    } catch {
        // nothing
    }
};

init();
