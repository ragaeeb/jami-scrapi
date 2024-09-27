import process from 'process';
import { createInterface } from 'readline/promises';

import { downloadMediaInfo } from './index.js';

export const init = async () => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const url = await rl.question('Enter the url to scrape: ');
    const resumeUrl = await rl.question('Enter the url to resume from: ');
    const outputFile = await rl.question('Enter the output file path: ');
    rl.close();

    await downloadMediaInfo(url.trim(), outputFile.trim(), resumeUrl);
};

init();
