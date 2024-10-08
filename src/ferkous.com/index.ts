import { getDOM } from '../utils/network';

export type Page = {
    content: string;
};

export const getPage = async (id: number): Promise<Page> => {
    try {
        const $ = await getDOM(`https://ferkous.com/home/?q=print/${id}`);
        const content = $('.content')
            .find('p, br')
            .map((i, el) => {
                if ($(el).is('br')) {
                    return '\n';
                }

                return $(el).text().trim();
            })
            .get()
            .join('\n')
            .trim();

        if (!content) {
            throw new Error(`Page ${id} is empty`);
        }

        return {
            content,
        };
    } catch (err: any) {
        if (err.status === 404) {
            throw new Error(`Page ${id} not found`);
        } else {
            throw err;
        }
    }
};
