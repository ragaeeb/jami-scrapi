import { CheerioAPI, load } from 'cheerio';

export const parseRabeeNet = (responseData: ResponseData): Partial<Page> => {
    const $: CheerioAPI = load(responseData as string);
    const content = $('.elementor-element.elementor-element-0dbc278');
    content.find('h3.jp-relatedposts-headline').remove();
    $('div.wrap-maisra_single_downloads_section').find('span').remove();

    const body = content.text().trim();
    const title = $('h1.elementor-heading-title.elementor-size-default').text().trim();

    return { ...(body && { body }), ...(title && { title }) };
};

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
