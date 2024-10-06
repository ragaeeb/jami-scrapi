import { URL_ID_PLACEHOLDER } from './constants';
import { parseAlBadrNet, parseFerkous, parseRabeeNet, parseShKhudheir } from './handlers';
import { TargetHandler } from './types';

export const UrlPatternToHandler: Record<string, TargetHandler> = {
    'https://al-badr.net/muqolat/{{id}}': parseAlBadrNet,
    'https://ferkous.com/home/?q=print/{{id}}': parseFerkous,
    'https://rabee.net/?p={{id}}': parseRabeeNet,
    'https://shkhudheir.com/node/{{id}}': parseShKhudheir,
};

const invalidPattern = Object.keys(UrlPatternToHandler).find((url) => !url.includes(URL_ID_PLACEHOLDER));

if (invalidPattern) {
    throw new Error(`${invalidPattern} does not include ${URL_ID_PLACEHOLDER} placeholder`);
}
