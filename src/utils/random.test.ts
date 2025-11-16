import { describe, expect, it } from 'bun:test';

import { getRandomInt } from './random';

describe('random', () => {
    describe('getRandomInt', () => {
        it('should always return a value within the inclusive range', () => {
            const min = 5;
            const max = 10;

            for (let i = 0; i < 100; i++) {
                const value = getRandomInt(min, max);
                expect(value).toBeGreaterThanOrEqual(min);
                expect(value).toBeLessThanOrEqual(max);
            }
        });
    });
});
