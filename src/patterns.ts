import { URL_ID_PLACEHOLDER } from './constants';
import { parseAlAtharNet, parseMainContainer, parseRabeeNet, parseShAlBarrak, parseShKhudheir } from './handlers';
import { TargetHandler } from './types';

const buildAlBadr = (path: string): string => `https://al-badr.net/${path}/${URL_ID_PLACEHOLDER}`;

export const UrlPatternToHandler: Record<string, TargetHandler> = {
    [buildAlBadr('detail')]: parseMainContainer,
    [buildAlBadr('muqolat')]: parseMainContainer,
    'http://www.saltaweel.com/articles/{{id}}': parseMainContainer,
    'https://alathar.net/home/esound/index.php?op=codevi&coid={{id}}': parseAlAtharNet,
    'https://rabee.net/?p={{id}}': parseRabeeNet,
    'https://sh-albarrak.com/article/{{id}}': parseShAlBarrak,
    'https://shkhudheir.com/node/{id}}': parseShKhudheir,
    'https://www.al-albany.com/audios/content/{{id}}/1': parseAlAtharNet,
};

const invalidPattern = Object.keys(UrlPatternToHandler).find((url) => !url.includes(URL_ID_PLACEHOLDER));

if (invalidPattern) {
    throw new Error(`${invalidPattern} does not include ${URL_ID_PLACEHOLDER} placeholder`);
}
