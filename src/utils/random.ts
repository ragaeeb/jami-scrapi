/**
 * Generates a random integer between the inclusive min and max values.
 *
 * @param min - Minimum value that can be returned.
 * @param max - Maximum value that can be returned.
 * @returns A random integer between min and max.
 */
export const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
