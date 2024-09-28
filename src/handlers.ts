import { CheerioAPI, load } from 'cheerio';

import { Page, ResponseData } from './types';
import { runSafely } from './utils/sandbox';

export const parseAlAlbaanyCom = (responseData: ResponseData): Partial<Page> => {
    const $: CheerioAPI = load(responseData as string);
    const title = $('.col-lg-10').text().trim();
    const body = $('#contentText').text().trim();
    const bookName = $('.content-details a:nth-of-type(1)').text().trim();
    const part = $('body > div.container > div.content > div.content-details > ul > li:nth-child(1) > a:nth-child(4)')
        .text()
        .trim();

    return { ...(body && { body }), ...(bookName && { bookName }), part: parseInt(part), ...(title && { title }) };
};

export const parseAlAtharNet = (responseData: ResponseData): Partial<Page> => {
    const $: CheerioAPI = load(responseData as string);
    const author = $('div.page-title > a:nth-child(1)').text().trim();
    const bookName = $('div.page-title > a:nth-child(2)').text().trim();
    const chapterName = $('div.card-header.block-header').text().trim();

    const title = $('body > div > div > div:nth-child(1) > div > div.card.mb-4 > div.card-body > div:nth-child(1)')
        .children()
        .not('a')
        .text()
        .trim();

    const bodyHtml = $('div.text-justify').html();
    const bodyWithLineBreaks = bodyHtml?.replace(/<br\s*\/?>/gi, '\n');
    const body = bodyWithLineBreaks ? load(bodyWithLineBreaks).text().trim() : '';

    return { ...(body && { body }), bookName, chapterName, metadata: { author }, title };
};

const parseArticle = (responseData: ResponseData, selector: string = 'article'): Partial<Page> => {
    const $: CheerioAPI = load(responseData as string);
    const body = $(selector).text().trim();
    return {
        ...(body && { body }),
    };
};

export const parseAlBadrNet = parseArticle;

export const parseFerkous = (responseData: ResponseData): Partial<Page> => {
    return parseArticle(responseData, '.content');
};

export const parseRabeeNet = (responseData: ResponseData): Partial<Page> => {
    const $: CheerioAPI = load(responseData as string);
    const content = $('.elementor-element.elementor-element-0dbc278');
    content.find('h3.jp-relatedposts-headline').remove();
    $('div.wrap-maisra_single_downloads_section').find('span').remove();

    const body = content.text().trim();
    const title = $('h1.elementor-heading-title.elementor-size-default').text().trim();

    return { ...(body && { body }), ...(title && { title }) };
};

export const parseSalTaweel = parseArticle;

export const parseShAlBarrak = parseArticle;

export const parseShKhudheir = (responseData: ResponseData): null | Partial<Page> => {
    const $: CheerioAPI = load(responseData as string);
    const title = $('#block-shkhudheir-page-title').text().trim();

    if (/^برنامج نور على الدرب/.test(title)) {
        return null;
    }

    const question = $(
        '#block-shkhudheir-content > div > div > article > div > div > div > div.field.field--name-field-fatwa-question.field--type-string-long.field--label-above > div.field__item',
    );
    const bodyTag = $('#block-shkhudheir-content');
    const answer = $(
        '#block-shkhudheir-content > div > div > article > div > div > div > div.clearfix.text-formatted.field.field--name-field-fatwa-answer.field--type-text-long.field--label-above > div.field__item',
    );
    const article = $('#quicktabs-tabpage-lesson_tabs-0 > div:nth-child(2) > div > div > div > div > div > div > div');

    bodyTag.find('.audiofield-player').remove();

    const body = question.text()
        ? [question.text().trim(), answer.text().trim()].join('\n').trim()
        : (article.text() || bodyTag.text()).trim();

    return { ...(body && { body }), ...(title && { title }) };
};

export interface PostData {
    content: {
        ar: {
            body: string;
            title: string;
            updatedAt: number;
        };
    };
    id: number;
}

export const parseShRajhi = (responseData: ResponseData): Page[] => {
    const parsedContents: Page[] = ((responseData as any).data as PostData[])
        .map(
            ({
                content: {
                    ar: { body, title, updatedAt },
                },
                id,
            }: PostData) => {
                return {
                    ...(body && { body: load(body).text().trim() }),
                    id,
                    sourceUpdatedAt: updatedAt,
                    title,
                };
            },
        )
        .reverse();

    return parsedContents;
};

export const parseZubairAliZai = (responseData: ResponseData): Partial<Page> => {
    const sandbox = runSafely(responseData as string);
    const [{ arabic, description = '', hukam: hukm = '' }] = Object.values(sandbox);

    return { ...(arabic && { body: arabic }), footer: [description, hukm].filter(Boolean).join('\n') };
};
