/**
 * Converts a camelCase string into snake_case.
 *
 * @param camelCase - The camelCase text to convert.
 * @returns The snake_case version of the provided text.
 */
export const toSnakeCase = (camelCase: string) => {
    return camelCase
        .match(/([A-Z])/g)
        ?.reduce((str, c) => str.replace(new RegExp(c), `_${c.toLowerCase()}`), camelCase)
        .substring(camelCase.slice(0, 1).match(/([A-Z])/g) ? 1 : 0);
};

/**
 * Normalises CLI input by trimming and replacing escaped spaces with actual space characters.
 *
 * @param input - Raw user input captured from the CLI.
 * @returns The sanitised string.
 */
export const sanitizeInput = (input: string) => input.trim().replace(/\\ /g, ' ');
