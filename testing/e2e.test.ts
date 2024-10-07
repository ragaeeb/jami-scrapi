import { describe, expect, it } from 'vitest';

import { getAudio } from '../src/al-albany.com/index';
import {
    getAllArticleIds,
    getAllLessonIdsForCategory,
    getAllLessonIdsForKhutab,
    getAllLessonIdsForMuhadarat,
    getLesson,
    getLessonCategoryIds,
} from '../src/al-badr.net';
import { getPage as getFerkousPage } from '../src/ferkous.com';
import { getPage as getRabeePage } from '../src/rabee.net';
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

    describe('ferkous.com', () => {
        describe('getPage', () => {
            it('should get the page', async () => {
                const result = await getFerkousPage(1900);
                expect(result).toEqual({
                    content: expect.any(String),
                });
            });

            it('should gracefully handle 404', async () => {
                const id = Date.now().toString();
                await expect(getFerkousPage(Date.now())).rejects.toThrow(`${id} not found`);
            });
        });
    });

    describe('rabee.net', () => {
        describe('getPage', () => {
            it('should handle request', async () => {
                const actual = await getRabeePage(713);

                expect(actual).toEqual({
                    content: expect.any(String),
                    title: 'هل يجوز في أيام عشر ذي الحجة تقليم الأظافر وحلق الشعر بما في ذلك تخفيف اللحية أو حلقها؟',
                });
            });

            it('should gracefully handle 404', async () => {
                const id = Date.now().toString();
                await expect(getRabeePage(Date.now())).rejects.toThrow(`${id} not found`);
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

        describe('getAllLessonIdsForKhutab', () => {
            it(
                'should handle request',
                async () => {
                    const actual = await getAllLessonIdsForKhutab();
                    expect(actual.length > 480).toBe(true);
                },
                { timeout: 60000 },
            );
        });

        describe('getAllLessonIdsForMuhadarat', () => {
            it(
                'should handle request',
                async () => {
                    const actual = await getAllLessonIdsForMuhadarat();
                    expect(actual.length > 400).toBe(true);
                },
                { timeout: 60000 },
            );
        });

        describe('getLessonCategoryIds', () => {
            it('should get all category ids', async () => {
                const actual = await getLessonCategoryIds();
                expect(actual).toEqual(['9', '11', '14', '72', '118', '238', '240']);
            });
        });

        describe('getAllLessonIdsFromCategory', () => {
            it(
                'should get all lesson ids from the category',
                async () => {
                    const actual = await getAllLessonIdsForCategory('240');
                    expect(actual.length > 150).toBe(true);
                },
                { timeout: 30000 },
            );
        });
    });
});
