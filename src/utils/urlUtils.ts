import { URL } from 'url';

export const getQualifiedUrl = (url: string, href: string): string => {
    const baseUrl = new URL(url).origin;
    return new URL(href, baseUrl).href;
};
