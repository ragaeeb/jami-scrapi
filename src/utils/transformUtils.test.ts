import type { Page } from 'bimbimba';

import { describe, expect, it } from 'vitest';

import { groupPagesByFields, mapPagesToGroupingFields, transformPage } from './transformUtils';

describe('transformUtils', () => {
    describe('mapPagesToGroupingFields', () => {
        it('should grab all unique metadata fields', () => {
            const pages: Partial<Page>[] = [
                { metadata: { author: 'A', book: 'B' } },
                { metadata: { author: 'A0', book: 'B1' } },
                { metadata: { author: 'A', book: 'B', chapter: 'C' } },
            ];

            const actual = mapPagesToGroupingFields(pages as Page[]);
            expect(Array.from(actual)).toEqual(['author', 'book', 'chapter']);
        });
    });

    describe('groupPagesByFields', () => {
        it('should group the pages by the fields', () => {
            const pages: Partial<Page>[] = [
                { metadata: { author: 'A', book: 'B' }, page: 1 },
                { metadata: { author: 'A0', book: 'B1' }, page: 2 },
                { metadata: { author: 'A', book: 'B', chapter: 'C', page: 3 } },
                { page: 4 },
            ];

            const actual = groupPagesByFields(pages as Page[], ['author', 'book'], '_');
            expect(actual).toEqual({
                '': [{ page: 4 }],
                A0_B1: [{ metadata: { author: 'A0', book: 'B1' }, page: 2 }],
                A_B: [
                    { metadata: { author: 'A', book: 'B' }, page: 1 },
                    { metadata: { author: 'A', book: 'B', chapter: 'C', page: 3 } },
                ],
            });
        });
    });

    describe('transformPage', () => {
        it('should skip pages with no metadata', () => {
            const page = { page: 1 };
            expect(transformPage(page as Page, [])).toBe(page);
        });

        it('should remove all metadata fields that are grouped', () => {
            const page: Partial<Page> = { metadata: { author: 'A', book: 'B' }, page: 1 };
            expect(transformPage(page as Page, ['author'])).toEqual({ metadata: { book: 'B' }, page: 1 });
        });

        it('should remove the metadata property if it becomes an empty object', () => {
            const page: Partial<Page> = { metadata: { author: 'A', book: 'B' }, page: 1 };
            expect(transformPage(page as Page, ['author', 'book'])).toEqual({ page: 1 });
        });

        it('should extract part number from metadata field', () => {
            const page: Partial<Page> = { metadata: { author: 'A', book: 'B', chapter: 'C012' }, page: 1 };
            expect(transformPage(page as Page, ['author', 'book'], 'chapter')).toEqual({
                metadata: { chapter: 'C' },
                page: 1,
                part: 12,
            });
        });

        it('should remove the chapter field after extraction', () => {
            const page: Partial<Page> = { metadata: { book: 'B', chapter: 'C012' }, page: 1 };
            expect(transformPage(page as Page, ['book'], 'chapter', true)).toEqual({
                page: 1,
                part: 12,
            });
        });
    });
});
