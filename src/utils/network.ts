import { CheerioAPI, load } from 'cheerio';
import wretch from 'wretch';

const w = wretch();

export const getDOM = async (url: string): Promise<CheerioAPI> => {
    const raw = await w.url(url).get().text();
    const $ = load(raw);

    return $;
};
