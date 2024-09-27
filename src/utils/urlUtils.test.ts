import { describe, expect, it } from 'vitest';

import { getQualifiedUrl } from './urlUtils.js';

describe('urlUtils', () => {
    describe('getQualifiedUrl', () => {
        it('should adjust the url', () => {
            const actual = getQualifiedUrl('https://abc.com/test', '/page');

            expect(actual).toEqual('https://abc.com/page');
        });
    });
});
