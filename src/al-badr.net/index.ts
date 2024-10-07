import { getDOM } from '../utils/network';
import { getQualifiedUrl } from '../utils/urlUtils';
import {
    crawlAndCollectArticleLinks,
    crawlAndCollectLessonLinks,
    getArticleListLinksFromNavBar,
    getLessonsLinksFromCategories,
    getLessonsListLinksFromNavBar,
} from './parser';
import { Page } from './types';

export const BASE_URL = `https://al-badr.net`;

export const getAllArticleIds = async (): Promise<number[]> => {
    const $ = await getDOM(BASE_URL);
    const articleListLinks = getArticleListLinksFromNavBar($).map((link) => getQualifiedUrl(BASE_URL, link));
    const articleLinks: string[] = await crawlAndCollectArticleLinks(articleListLinks, BASE_URL);
    const ids: number[] = articleLinks.map((link) => parseInt(link.split('/').at(-1) as string));

    return ids.sort((a, b) => a - b);
};

export const getAllLessonIds = async (): Promise<string[]> => {
    const $ = await getDOM(BASE_URL);
    const lessonListLinks = (await getLessonsListLinksFromNavBar($)).map((link) => getQualifiedUrl(BASE_URL, link));
    const lessonLinks: string[] = await crawlAndCollectLessonLinks(lessonListLinks, BASE_URL);

    return lessonLinks.map((link) => link.split('/').at(-1) as string);
};

export const getAllLessonIdsFromCategories = async (): Promise<string[]> => {
    const $ = await getDOM(BASE_URL);
    const lessonLinks: string[] = await getLessonsLinksFromCategories($, BASE_URL);

    return lessonLinks.map((link) => link.split('/').at(-1) as string);
};

export const getArticle = async (id: number): Promise<Page> => {
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

export const getDurusCategories = async (): Promise<number[]> => {
    const $ = await getDOM(BASE_URL);
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
