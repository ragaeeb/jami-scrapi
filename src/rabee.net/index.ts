import { getDOM } from '../utils/network';
import { Page } from './types';

export const getPage = async (id: number): Promise<Page> => {
    try {
        const $ = await getDOM(`https://rabee.net/?p=${id}`);
        const content = $('.elementor-element.elementor-element-0dbc278');
        content.find('h3.jp-relatedposts-headline').remove();
        $('div.wrap-maisra_single_downloads_section').find('span').remove();

        const body = content.text().trim();
        const title = $('h1.elementor-heading-title.elementor-size-default').text().trim();

        if (!body && !title) {
            throw new Error(`Blank page encountered`);
        }

        return { ...(body && { content: body }), ...(title && { title }) };
    } catch (err: any) {
        if (err.status === 404) {
            throw new Error(`Page ${id} not found`);
        } else {
            throw err;
        }
    }
};
