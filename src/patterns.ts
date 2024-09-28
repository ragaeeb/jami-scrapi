import { URL_ID_PLACEHOLDER } from './constants';
import {
    parseAlAtharNet,
    parseAlBadrNet,
    parseFerkous,
    parseRabeeNet,
    parseSalTaweel,
    parseShAlBarrak,
    parseShKhudheir,
    parseShRajhi,
    parseZubairAliZai,
} from './handlers';
import { TargetHandler } from './types';

export const UrlPatternToHandler: Record<string, TargetHandler> = {
    'http://www.saltaweel.com/articles/{{id}}': parseSalTaweel,
    'https://al-badr.net/muqolat/{{id}}': parseAlBadrNet,
    'https://alathar.net/home/esound/index.php?op=codevi&coid={{id}}': parseAlAtharNet,
    'https://api.shrajhi.com.sa/api/v2/posts/lesson?limit=5000&page={{id}}': parseShRajhi,
    'https://dashingquill.com/js/abudawood/{{id}}.js': parseZubairAliZai,
    'https://dashingquill.com/js/ibnemaja/{{id}}.js': parseZubairAliZai,
    'https://dashingquill.com/js/mishkaat/{{id}}.js': parseZubairAliZai,
    'https://dashingquill.com/js/nasai/{{id}}.js': parseZubairAliZai,
    'https://dashingquill.com/js/tirmizi/{{id}}.js': parseZubairAliZai,
    'https://ferkous.com/home/?q=print/{{id}}': parseFerkous,
    'https://rabee.net/?p={{id}}': parseRabeeNet,
    'https://sh-albarrak.com/article/{{id}}': parseShAlBarrak,
    'https://shkhudheir.com/node/{{id}}': parseShKhudheir,
    'https://www.al-albany.com/audios/content/{{id}}/1': parseAlAtharNet,
};

const invalidPattern = Object.keys(UrlPatternToHandler).find((url) => !url.includes(URL_ID_PLACEHOLDER));

if (invalidPattern) {
    throw new Error(`${invalidPattern} does not include ${URL_ID_PLACEHOLDER} placeholder`);
}
