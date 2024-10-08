import { getDOM } from '../utils/network';
import { Page } from './types';

export const getPage = async (id: number): Promise<Page> => {
    try {
        const $ = await getDOM(`http://www.saltaweel.com/articles/${id}`);
        const title = $('article header h1').text().trim();
        const date = $('article time').parent().text().trim();
        const content = $('article div p').text().trim();

        return {
            content,
            date,
            title,
        };
    } catch (err: any) {
        if (err.status === 404) {
            throw new Error(`Page ${id} not found`);
        } else {
            throw err;
        }
    }
};
