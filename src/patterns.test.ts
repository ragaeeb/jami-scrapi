import { describe, expect, it, vi } from 'vitest';

import { URL_ID_PLACEHOLDER } from './constants'; // Adjust the path
import {
    parseAlAlbaanyCom,
    parseAlAtharNet,
    parseMainContainer,
    parseRabeeNet,
    parseShKhudheir,
    parseZubairAliZai,
} from './handlers';
import { handleUrl } from './patterns';

vi.mock('./handlers', () => ({
    parseAlAlbaanyCom: vi.fn(),
    parseAlAtharNet: vi.fn(),
    parseMainContainer: vi.fn(() => vi.fn()),
    parseRabeeNet: vi.fn(),
    parseShKhudheir: vi.fn(),
    parseZubairAliZai: vi.fn(),
}));

describe('handleUrl', () => {
    const validUrls = [
        {
            expectedHandler: 'parseMainContainer',
            url: 'https://al-badr.net/detail/someId',
        },
        {
            expectedHandler: 'parseZubairAliZai',
            url: 'https://dashingquill.com/js/abudawood/123.js',
        },
        {
            expectedHandler: 'parseMainContainer',
            url: 'https://www.saltaweel.com/articles/456',
        },
        {
            expectedHandler: 'parseMainContainer',
            url: 'https://ferkous.com/home/?q=print/789',
        },
        {
            expectedHandler: 'parseMainContainer',
            url: 'https://sh-albarrak.com/article/101',
        },
        {
            expectedHandler: 'parseShKhudheir',
            url: 'https://shkhudheir.com/node/202',
        },
        {
            expectedHandler: 'parseAlAlbaanyCom',
            url: 'https://www.al-albany.com/audios/content/303/1',
        },
        {
            expectedHandler: 'parseAlAtharNet',
            url: 'https://alathar.net/home/esound/index.php?op=codevi&coid=404',
        },
        {
            expectedHandler: 'parseRabeeNet',
            url: 'https://rabee.net/?p=505',
        },
    ];

    describe('parseMainContainer', () => {
        it.only('should handle al-badr.net muqolat', () => {
            handleUrl('https://al-badr.net/muqolat/233');
            expect(parseMainContainer).toHaveBeenCalledTimes(1);
            expect(parseMainContainer).toHaveBeenCalledWith('https://al-badr.net/muqolat/233');
        });
    });

    it('should return undefined for non-matching URLs', () => {
        const result = handleUrl('https://invalid.url');
        expect(result).toBeUndefined();
    });
});
