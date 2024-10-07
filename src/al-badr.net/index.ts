import { getDOM } from '../utils/network';
import { getQualifiedUrl } from '../utils/urlUtils';
import {
    crawlAndCollectArticleLinks,
    crawlAndCollectLessonLinks,
    getArticleListLinksFromNavBar,
    getLessonsListLinksFromNavBar,
    getLinksFromList,
    getLinksFromMenu,
    mapLinkToId,
} from './parser';
import { Page } from './types';

export const BASE_URL = `https://al-badr.net`;

const qualifyUrl = (link: string): string => getQualifiedUrl(BASE_URL, link);

export const getAllArticleIds = async (): Promise<string[]> => {
    const $ = await getDOM(BASE_URL);
    const articleListLinks = getArticleListLinksFromNavBar($).map(qualifyUrl);
    const articleLinks: string[] = await crawlAndCollectArticleLinks(articleListLinks, BASE_URL);
    return articleLinks.map(mapLinkToId);
};

export const getAllLessonIds = async (): Promise<string[]> => {
    const $ = await getDOM(BASE_URL);
    const lessonListLinks = (await getLessonsListLinksFromNavBar($)).map(qualifyUrl);
    const lessonLinks: string[] = await crawlAndCollectLessonLinks(lessonListLinks, BASE_URL);

    return lessonLinks.map(mapLinkToId);
};

export const getAllLessonIdsFromCategory = async (id: string): Promise<string[]> => {
    const $ = await getDOM(getQualifiedUrl(BASE_URL, `/category/${id}`));
    const lessonListLinks = await getLinksFromList($, 'div.post-content ul li a', /\/sub\/\d+/).map(qualifyUrl);
    const lessonLinks = await crawlAndCollectLessonLinks(lessonListLinks, BASE_URL);

    return lessonLinks.map(mapLinkToId);
};

export const getArticle = async (id: string): Promise<Page> => {
    const url = `${BASE_URL}/muqolat/${id}`;

    const $ = await getDOM(url);
    const title = $('meta[name="Description"]').attr('content') as string;

    if (title === '404') {
        throw new Error(`${id} not found.`);
    }

    const content = $('article').text().trim();

    return {
        content,
        title,
    };
};

export const getLesson = async (id: string): Promise<Page> => {
    const url = `${BASE_URL}/detail/${id}`;

    const $ = await getDOM(url);
    const title = $('meta[name="Description"]').attr('content') as string;

    if (!title) {
        throw new Error(`${id} not found.`);
    }

    const paragraphs = $('div.post-content p')
        .map((i, elem) => $(elem).text().trim())
        .get();
    const transcriptFile = $('a[href^="/dl/doc/"]').attr('href');
    const audioFile = $('audio source[type="audio/mp3"]').attr('src');

    return {
        content: paragraphs.join('\n'),
        title,
        ...(audioFile && { audioFile }),
        ...(transcriptFile && { transcript: { file: getQualifiedUrl(url, transcriptFile) } }),
    };
};

export const getLessonCategoryIds = async (): Promise<string[]> => {
    const $ = await getDOM(BASE_URL);

    const categoryLinks = getLinksFromMenu($, 'الدروس', /\/category\/\d+/).filter((link) => link !== '/category/274');

    return categoryLinks.map(mapLinkToId);
};
