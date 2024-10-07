import { describe, expect, it } from 'vitest';

import { getAudio } from '../src/al-albany.com/index';
import {
    getAllArticleIds,
    getAllLessonIds,
    getAllLessonIdsFromCategory,
    getLesson,
    getLessonCategoryIds,
} from '../src/al-badr.net';
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
                await expect(getPage(99999999)).rejects.toThrow(`99999999 not found`);
            });
        });
    });

    describe('al-badr.net', () => {
        describe('getLesson', () => {
            it('should get the page', async () => {
                const result = await getLesson('HK9FCGy2jkOD');

                expect(result).toEqual({
                    content: expect.any(String),
                    date: '9 رجب 1428 | 23 يوليو 2007',
                    title: 'لا يدخل الجنة قتات',
                });
            });

            it('should gracefully handle 404', async () => {
                const id = Date.now().toString();
                await expect(getLesson(Date.now().toString())).rejects.toThrow(`${id} not found`);
            });
        });

        describe('getAllArticleIds', () => {
            it(
                'should handle request',
                async () => {
                    const actual = await getAllArticleIds();
                    expect(actual.length > 300).toBe(true);
                },
                { timeout: 30000 },
            );
        });

        describe('getAllLessonIds', () => {
            it(
                'should handle request',
                async () => {
                    const actual = await getAllLessonIds();
                    expect(actual.length > 890).toBe(true);
                },
                { timeout: 120000 },
            );
        });

        describe('getLessonCategoryIds', () => {
            it('should get all category ids', async () => {
                const actual = await getLessonCategoryIds();
                expect(actual).toEqual(['9', '11', '14', '72', '118', '238', '240']);
            });
        });

        describe('getAllLessonIdsFromCategory', () => {
            it.only(
                'should get all lesson ids from the category',
                async () => {
                    const actual = await getAllLessonIdsFromCategory('240');
                    expect(actual.length > 150).toBe(true);
                },
                { timeout: 30000 },
            );
        });
    });
});
