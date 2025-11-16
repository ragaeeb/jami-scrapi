import { describe, expect, it } from 'bun:test';

import { sanitizeInput, toSnakeCase } from './textUtils';

describe('textUtils', () => {
    describe('toSnakeCase', () => {
        it('should convert from camel to snake case', () => {
            const actual = toSnakeCase('getPage');
            expect(actual).toEqual('get_page');
        });
    });

    describe('sanitizeInput', () => {
        it('should trim and replace escaped spaces', () => {
            const actual = sanitizeInput('  folder\\ name  ');
            expect(actual).toEqual('folder name');
        });
    });
});
