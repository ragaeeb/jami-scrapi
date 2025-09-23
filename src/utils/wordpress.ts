import { URL, URLSearchParams } from 'node:url';
import { getJSON, type Page } from 'bimbimba';
import { removeUrls } from 'bitaboom';
import { CatsaJanga, type Logger } from 'catsa-janga';
import { load } from 'cheerio';

type PostResponse = {
    content: { rendered: string };
    date_gmt: string;
    id: number;
    link: string;
    title: { rendered: string };
};

const getWordpressContent = async (host: string, endpoint: string, offset: number, limit: number): Promise<Page[]> => {
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
    logger: Logger;
    metadata?: Record<string, any>;
    outputFile: string;
    routes: string[];
};

export const scrapeWordpress = async ({ host, logger, metadata, outputFile, routes }: ScrapeWordpressProps) => {
    let pages: Page[] = [];

    const progressSaver = new CatsaJanga({
        getData: () => ({ ...metadata, pages: pages.toSorted((a, b) => a.page - b.page) }),
        logger,
        outputFile,
    });

    for (const route of routes) {
        let offset = 0;

        while (offset >= 0) {
            logger.info(`Downloading pages from ${host}/${route} offset=${offset}`);
            const result = await getWordpressContent(host, route, offset, 100);
            pages = pages.concat(result);

            if (result.length === 0) {
                offset = -1;
            } else {
                offset += result.length;
            }
        }
    }

    await progressSaver.saveProgress();

    return pages;
};

const STANDARD_ROUTES = [
    '/wp/v2/comments',
    '/wp/v2/types',
    '/wp/v2/media',
    '/wp/v2/menu-items',
    '/wp/v2/blocks',
    '/wp/v2/templates',
    '/wp/v2/template-parts',
    '/wp/v2/navigation',
    '/wp/v2/font-families',
    '/wp/v2/e-floating-buttons',
    '/wp/v2/elementor_library',
    '/wp/v2/feedback',
    '/wp/v2/jp_pay_order',
    '/wp/v2/jp_pay_product',
    '/wp/v2/statuses',
    '/wp/v2/taxonomies',
    '/wp/v2/categories',
    '/wp/v2/tags',
    '/wp/v2/menus',
    '/wp/v2/wp_pattern_category',
    '/wp/v2/audio_category_api',
    '/wp/v2/slide_category_api',
    '/wp/v2/book_category_api',
    '/wp/v2/groups_category_api',
    '/wp/v2/about_Sheikh_category_api',
    '/wp/v2/alfatawi_category_api',
    '/wp/v2/benefits_category_api',
    '/wp/v2/users',
    '/wp/v2/search',
    '/wp/v2/block-types',
    '/wp/v2/settings',
    '/wp/v2/themes',
    '/wp/v2/plugins',
    '/wp/v2/sidebars',
    '/wp/v2/widget-types',
    '/wp/v2/widgets',
    '/wp/v2/menu-locations',
    '/wp/v2/font-collections',
];

export const getRouteKeys = async (host: string) => {
    const noise = new Set(STANDARD_ROUTES);

    const routeKeys = Object.keys((await getJSON(`${host}/wp-json/wp/v2`)).routes)
        .filter((route) => route.split('/').length === 4) // only consider /wp/v2/[x] and not /wp/v2/[x]/...
        .filter((route) => !noise.has(route))
        .map((route) => route.split('/').at(-1) as string);

    return routeKeys;
};
