import { CheerioAPI } from 'cheerio';

import { getDOM } from '../utils/network';
import { getQualifiedUrl } from '../utils/urlUtils';

export const getLinksFromList = ($: CheerioAPI, selector: string, pattern: RegExp): string[] => {
    const links: string[] = [];
    $(selector).each((_, el) => {
        const href = $(el).attr('href') as string;
        if (pattern.test(href)) {
            links.push(href);
        }
    });

    return Array.from(new Set(links));
};

export const crawlAndCollectArticleLinks = async (
    articleListLinksFromNav: string[],
    baseUrl: string,
): Promise<string[]> => {
    const articleLinks: string[] = [];
    const articleListLinks = [...articleListLinksFromNav];
    let currentListLink = articleListLinks.pop();

    while (currentListLink) {
        const $ = await getDOM(currentListLink);
        const nextPageLink = $('div.pager a:contains(">")').attr('href');
        articleLinks.push(...getLinksFromList($, 'div.post-content ul li a', /\/muqolat\/\d+/));

        if (nextPageLink) {
            articleListLinks.push(getQualifiedUrl(baseUrl, nextPageLink));
        }

        currentListLink = articleListLinks.pop();
    }

    return articleLinks;
};

export const crawlAndCollectLessonLinks = async (
    lessonListLinksFromNav: string[],
    baseUrl: string,
): Promise<string[]> => {
    const result: string[] = [];
    const visited = new Set<string>();
    const lessonListLinks = [...lessonListLinksFromNav];
    let currentListLink = lessonListLinks.pop();

    while (currentListLink) {
        const $ = await getDOM(currentListLink);
        const nextPageLink = $('div.pager a:contains(">")').attr('href');

        const linksFound = getLinksFromList($, 'article.post-content ul li a', /\/detail\/[a-zA-Z\d]+/);
        result.push(...linksFound);

        if (nextPageLink && !visited.has(nextPageLink)) {
            lessonListLinks.push(getQualifiedUrl(baseUrl, nextPageLink));
            visited.add(nextPageLink);
        }

        currentListLink = lessonListLinks.pop();
    }

    return result;
};

export const getLinksFromMenu = ($: CheerioAPI, query: string, linkPattern: RegExp): string[] => {
    const links: string[] = [];
    $(`li:contains("${query}")`)
        .find('ul.sub-menu li a')
        .each((i, elem) => {
            const href = $(elem).attr('href') as string;

            if (linkPattern.test(href)) {
                links.push(href);
            }
        });

    return links;
};

export const mapLinkToId = (link: string): string => link.split('/').at(-1) as string;

export const getLessonIdsFromMenuItem = async (
    baseUrl: string,
    query: string,
    linkPattern: RegExp,
): Promise<string[]> => {
    const $ = await getDOM(baseUrl);
    const lessonListLinks = getLinksFromMenu($, query, linkPattern).map((link) => getQualifiedUrl(baseUrl, link));
    const lessonLinks = await crawlAndCollectLessonLinks(lessonListLinks, baseUrl);

    return lessonLinks.map(mapLinkToId);
};
