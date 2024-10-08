import { getDOM } from '../utils/network';
import { Page } from './types';

export const getPage = async (id: number): Promise<Page> => {
    try {
        const $ = await getDOM(`https://shkhudheir.com/node/${id}`);
        const title = $('#block-shkhudheir-page-title').text().trim();

        if (/^برنامج نور على الدرب/.test(title)) {
            throw new Error(`Page ${id} not found`);
        }

        const questionTag = $(
            '#block-shkhudheir-content > div > div > article > div > div > div > div.field.field--name-field-fatwa-question.field--type-string-long.field--label-above > div.field__item',
        );
        const bodyTag = $('#block-shkhudheir-content');
        const answerTag = $(
            '#block-shkhudheir-content > div > div > article > div > div > div > div.clearfix.text-formatted.field.field--name-field-fatwa-answer.field--type-text-long.field--label-above > div.field__item',
        );
        const article = $(
            '#quicktabs-tabpage-lesson_tabs-0 > div:nth-child(2) > div > div > div > div > div > div > div',
        );

        bodyTag.find('.audiofield-player').remove();

        return {
            ...(questionTag.text().trim() && { question: questionTag.text().trim() }),
            ...(answerTag.text().trim() && { answer: answerTag.text().trim() }),
            ...(title && { title }),
            ...((article.text().trim() || bodyTag.text().trim()) && {
                content: article.text().trim() || bodyTag.text().trim(),
            }),
        };
    } catch (err: any) {
        if (err.status === 404) {
            throw new Error(`Page ${id} not found`);
        } else {
            throw err;
        }
    }
};
