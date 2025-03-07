import { getJSON, type Page } from 'bimbimba';
import { removeUrls } from 'bitaboom';
import { load } from 'cheerio';
import { URL, URLSearchParams } from 'node:url';

import { ProgressSaver, type SubLogger } from './progressSaver.js';

type PostResponse = {
    content: { rendered: string };
    date_gmt: string;
    id: number;
    link: string;
    title: { rendered: string };
};

const getWordpressContent = async (
    host: string,
    endpoint: 'pages' | 'posts',
    offset: number,
    limit: number,
): Promise<Page[]> => {
    const url = new URL(`${host}/wp-json/wp/v2/${endpoint}`);
    url.search = new URLSearchParams({ offset: offset.toString(), per_page: limit.toString() }).toString();

    const data = (await getJSON(url.toString())) as PostResponse[];

    const pages = data.map((post) => {
        const $ = load(post.content.rendered);
        $('script').remove();

        let body = $.text().trim();

        if (body) {
            body = removeUrls(body.replace(/[❐❏◥❍◈◉▣❑∎]+/g, '')).trim();
        }

        return {
            accessed: new Date(),
            ...(body && { body }),
            page: post.id,
            publishTimestamp: new Date(post.date_gmt),
            title: post.title.rendered,
            url: post.link,
        };
    });

    return pages;
};

type ScrapeWordpressProps = {
    host: string;
    logger: SubLogger;
    metadata?: Record<string, any>;
    outputFile: string;
};

export const scrapeWordpress = async ({ host, logger, metadata, outputFile }: ScrapeWordpressProps) => {
    let pages: Page[] = [];

    const progressSaver = new ProgressSaver({
        getData: () => ({ ...metadata, pages: pages.toSorted((a, b) => a.page - b.page) }),
        logger,
        outputFile,
    });

    let offset = 0;

    while (true) {
        logger.info(`Downloading pages from ${host}/pages offset=${offset}`);
        const result = await getWordpressContent(host, 'pages', offset, 100);
        pages = pages.concat(result);

        offset += result.length;

        if (result.length === 0) {
            break;
        }
    }

    offset = 0;

    while (true) {
        logger.info(`Downloading posts from ${host}/posts offset=${offset}`);
        const result = await getWordpressContent(host, 'posts', offset, 100);
        pages = pages.concat(result);

        offset += result.length;

        if (result.length === 0) {
            break;
        }
    }

    await progressSaver.saveProgress();

    return pages;
};
