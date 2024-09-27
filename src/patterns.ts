import { URL_ID_PLACEHOLDER } from './constants';
import { parseAlAtharNet, parseMainContainer, parseRabeeNet, parseShKhudheir, parseZubairAliZai } from './handlers';
import { TargetHandler } from './types';

const buildAlBadr = (path: string): string => `https://al-badr.net/${path}/${URL_ID_PLACEHOLDER}`;

const buildZubairAliZai = (path: string): string => `https://dashingquill.com/js/${path}/${URL_ID_PLACEHOLDER}.js`;

export const UrlPatternToHandler: Record<string, TargetHandler> = {
    [buildAlBadr('detail')]: parseMainContainer(),
    [buildAlBadr('muqolat')]: parseMainContainer(),
    [buildZubairAliZai('abudawood')]: parseZubairAliZai,
    [buildZubairAliZai('ibnemaja')]: parseZubairAliZai,
    [buildZubairAliZai('mishkaat')]: parseZubairAliZai,
    [buildZubairAliZai('nasai')]: parseZubairAliZai,
    [buildZubairAliZai('tirmizi')]: parseZubairAliZai,
    'http://www.saltaweel.com/articles/{{id}}': parseMainContainer(),
    'https://alathar.net/home/esound/index.php?op=codevi&coid={{id}}': parseAlAtharNet,
    'https://ferkous.com/home/?q=print/${id}': parseMainContainer('.content'),
    'https://rabee.net/?p={{id}}': parseRabeeNet,
    'https://sh-albarrak.com/article/{{id}}': parseMainContainer('.article-body'),
    'https://shkhudheir.com/node/{id}}': parseShKhudheir,
    'https://www.al-albany.com/audios/content/{{id}}/1': parseAlAtharNet,
};

const invalidPattern = Object.keys(UrlPatternToHandler).find((url) => !url.includes(URL_ID_PLACEHOLDER));

if (invalidPattern) {
    throw new Error(`${invalidPattern} does not include ${URL_ID_PLACEHOLDER} placeholder`);
}
