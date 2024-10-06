import { describe, expect, it } from 'vitest';

import { getAudio } from '../src/al-albany.com/index';
import { getPage } from '../src/saltaweel.com';

describe('e2e', () => {
    describe('al-albany.com', () => {
        describe('getAudio', () => {
            it('should get the audio', async () => {
                const result = await getAudio(1500);
                expect(result).toEqual({
                    content: expect.any(Array),
                    file: expect.any(String),
                    tape: expect.any(String),
                    tapeNumber: '1050',
                    timestamp: 3521,
                    title: expect.any(String),
                });

                expect(result.content).toHaveLength(10);
            });

            it('should gracefully handle 404', async () => {
                await expect(getAudio(99999999)).rejects.toThrow('Audio 99999999 not found');
            });
        });
    });

    describe('saltaweel.com', () => {
        describe('getPage', () => {
            it('should get the page', async () => {
                const result = await getPage(55);
                expect(result).toEqual({
                    content: expect.any(String),
                    date: '9 رجب 1428 | 23 يوليو 2007',
                    title: 'لا يدخل الجنة قتات',
                });
            });

            it('should gracefully handle 404', async () => {
                await expect(getPage(99999999)).rejects.toThrow('Page 99999999 not found');
            });
        });
    });
});
