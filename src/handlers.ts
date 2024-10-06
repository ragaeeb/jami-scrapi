import { CheerioAPI, load } from 'cheerio';

import { Page, ResponseData } from './types';

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

const parseArticle = (responseData: ResponseData, selector: string = 'article'): Partial<Page> => {
    const $: CheerioAPI = load(responseData as string);
    const body = $(selector).text().trim();
    return {
        ...(body && { body }),
    };
};

export const parseAlBadrNet = (responseData: ResponseData): null | Partial<Page> => {
    const $: CheerioAPI = load(responseData as string);
    const description = $('meta[name="Description"]').attr('content') as string;

    if (description === '404') {
        return null;
    }

    const body = $('article').text().trim();
    return {
        ...(body && { body }),
    };
};

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
