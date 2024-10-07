import { parseRabeeNet, parseShKhudheir } from './handlers';

export const UrlPatternToHandler: Record<string, TargetHandler> = {
    'https://rabee.net/?p={{id}}': parseRabeeNet,
    'https://shkhudheir.com/node/{{id}}': parseShKhudheir,
};
