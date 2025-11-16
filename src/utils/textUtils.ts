/**
 * Converts a camelCase string into snake_case.
 *
 * @param camelCase - The camelCase text to convert.
 * @returns The snake_case version of the provided text.
 */
export const toSnakeCase = (camelCase: string) => {
    return camelCase.replace(/[A-Z]/g, (letter, index) => (index > 0 ? '_' : '') + letter.toLowerCase());
};

/**
 * Normalises CLI input by trimming and replacing escaped spaces with actual space characters.
 *
 * @param input - Raw user input captured from the CLI.
 * @returns The sanitised string.
 */
export const sanitizeInput = (input: string) => input.trim().replace(/\\ /g, ' ');
