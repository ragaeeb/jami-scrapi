import { CheerioAPI, load } from 'cheerio';

import { ParsedContent } from './types';
import { runSafely } from './utils/sandbox';

export const parseAlAlbaanyCom = (responseData: string): ParsedContent => {
    const $: CheerioAPI = load(responseData);
    const title = $('.col-lg-10').text().trim();
    const body = $('#contentText').text().trim();
    const book = $('.content-details a:nth-of-type(1)').text().trim();
    const part = $('body > div.container > div.content > div.content-details > ul > li:nth-child(1) > a:nth-child(4)')
        .text()
        .trim();

    return { body, book, part, title };
};

export const parseAlAtharNet = (responseData: string): ParsedContent => {
    const $: CheerioAPI = load(responseData);
    const book = $('div.page-title').text().trim();
    const section = $('div.card-header.block-header').text().trim();

    const title = $('body > div > div > div:nth-child(1) > div > div.card.mb-4 > div.card-body > div:nth-child(1)')
        .children()
        .not('a')
        .text()
        .trim();

    const bodyHtml = $('div.text-justify').html();
    const bodyWithLineBreaks = bodyHtml?.replace(/<br\s*\/?>/gi, '\n');
    const body = bodyWithLineBreaks ? load(bodyWithLineBreaks).text().trim() : '';

    return { body, book, section, title };
};

export const parseMainContainer =
    (selector: string = '#main-container > div') =>
    (responseData: string): ParsedContent => {
        const $: CheerioAPI = load(responseData);
        return {
            body: $(selector).text().trim(),
        };
    };

export const parseRabeeNet = (responseData: string): ParsedContent => {
    const $: CheerioAPI = load(responseData);
    const content = $('.elementor-element.elementor-element-0dbc278');
    content.find('h3.jp-relatedposts-headline').remove();
    $('div.wrap-maisra_single_downloads_section').find('span').remove();

    const body = content.text().trim();
    const title = $('h1.elementor-heading-title.elementor-size-default').text().trim();

    return { body, title };
};

export const parseShKhudheir = (responseData: string): ParsedContent => {
    const $: CheerioAPI = load(responseData);
    const title = $('#block-shkhudheir-page-title').text().trim();

    if (/^برنامج نور على الدرب/.test(title)) {
        return null;
    }

    const question = $(
        '#block-shkhudheir-content > div > div > article > div > div > div > div.field.field--name-field-fatwa-question.field--type-string-long.field--label-above > div.field__item',
    );
    const body = $('#block-shkhudheir-content');
    const answer = $(
        '#block-shkhudheir-content > div > div > article > div > div > div > div.clearfix.text-formatted.field.field--name-field-fatwa-answer.field--type-text-long.field--label-above > div.field__item',
    );
    const article = $('#quicktabs-tabpage-lesson_tabs-0 > div:nth-child(2) > div > div > div > div > div > div > div');

    body.find('.audiofield-player').remove();

    return {
        body: question.text()
            ? [question.text().trim(), answer.text().trim()].join('\n').trim()
            : (article.text() || body.text()).trim(),
        title,
    };
};

export const parseZubairAliZai = (responseData: string): ParsedContent => {
    const sandbox = runSafely(responseData);
    const [{ arabic, description, hukam: hukm }] = Object.values(sandbox);

    return { body: arabic, description, hukm };
};
