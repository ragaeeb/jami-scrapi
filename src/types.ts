import { CheerioAPI } from 'cheerio';

export type ParsedContent = null | Record<string, number | string>;

export type TargetHandler = {
    ($: CheerioAPI): ParsedContent;
};
