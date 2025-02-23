import { describe, expect, it } from 'vitest';

import { toSnakeCase } from './textUtils';

describe('textUtils', () => {
    describe('toSnakeCase', () => {
        it('should convert from camel to snake case', () => {
            const actual = toSnakeCase('getPage');
            expect(actual).toEqual('get_page');
        });
    });
});
