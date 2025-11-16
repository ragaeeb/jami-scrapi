import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { promises as fs } from 'node:fs';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type { Page } from 'bimbimba';

import { findGaps, joinBooks } from './joiner';

const createTempDir = async () => mkdtemp(path.join(tmpdir(), 'jami-scrapi-'));

describe('joiner', () => {
    let tmp: string;

    beforeEach(async () => {
        tmp = await createTempDir();
    });

    afterEach(async () => {
        await fs.rm(tmp, { force: true, recursive: true });
    });

    describe('findGaps', () => {
        it('returns the missing page numbers inside a sorted list', () => {
            const pages = [{ page: 1 }, { page: 2 }, { page: 5 }, { page: 8 }] as Page[];

            expect(findGaps(pages)).toEqual([3, 4, 6, 7]);
        });
    });

    describe('joinBooks', () => {
        it('merges all json files and sorts the pages', async () => {
            const inputA = path.join(tmp, 'a.json');
            const inputB = path.join(tmp, 'b.json');
            const outputFile = path.join(tmp, 'output.json');

            await fs.writeFile(
                inputA,
                JSON.stringify({
                    metadata: 'A',
                    pages: [
                        { body: 'hello', page: 2 },
                        { body: 'hello 2', page: 4 },
                    ],
                }),
            );

            await fs.writeFile(
                inputB,
                JSON.stringify({
                    pages: [
                        { body: 'hola', page: 1 },
                        { body: 'hola 2', page: 3 },
                    ],
                    source: 'foo',
                }),
            );

            await joinBooks(tmp, { extra: true }, outputFile);

            const { pages, extra, metadata, source } = JSON.parse(await fs.readFile(outputFile, 'utf-8'));

            expect(pages.map((page: Page) => page.page)).toEqual([1, 2, 3, 4]);
            expect(extra).toBe(true);
            expect(metadata).toBeUndefined();
            expect(source).toBe('foo');
        });
    });
});
