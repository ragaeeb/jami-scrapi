import { describe, expect, it, mock } from 'bun:test';

mock.module('bimbimba', () => ({
    getJSON: mock(async () => ({
        routes: {
            '/wp/v2/custom': {},
            '/wp/v2/media': {},
            '/wp/v2/menus': {},
            '/wp/v2/posts': {},
            '/wp/v2/posts/1': {},
        },
    })),
}));

mock.module('bitaboom', () => ({
    removeUrls: (value: string) => value,
}));

const { getRouteKeys } = await import('./wordpress');

describe('wordpress', () => {
    describe('getRouteKeys', () => {
        it('filters out noisy wordpress endpoints', async () => {
            const routes = await getRouteKeys('https://example.com');
            expect(routes).toEqual(['custom', 'posts']);
        });
    });
});
