import fs from 'fs';

import { scrape } from './scrapers/index.js';
import { onTerminate } from './utils/keyboard.js';

export const init = async (id, start, end) => {
    const pages = [];

    const commit = () => {
        if (pages.length) {
            // only write if changes were made
            const file = `data/${id}.json`;

            console.log(`Saving ${pages.length} pages to`, file);
            const prevPages = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) || [] : [];
            fs.writeFileSync(file, JSON.stringify(prevPages.concat(pages), null, 2));
        }

        process.exit();
    };

    onTerminate(commit);

    try {
        for (let i = start; i <= end; i += 1) {
            console.log('Trying page', i);
            // eslint-disable-next-line no-await-in-loop
            try {
                // eslint-disable-next-line no-await-in-loop
                const page = await scrape(id, i);

                if (page.body) {
                    pages.push({ page: i, ...page });
                } else {
                    console.warn('Empty body', i);
                }
            } catch (err) {
                if (err.response.status > 404) {
                    throw err;
                }
            }
        }
    } catch (err) {
        console.error(err.response.status);
        console.error(err);
    } finally {
        commit();
    }
};

export default init;
