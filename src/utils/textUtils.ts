export const toSnakeCase = (camelCase: string) => {
    return camelCase
        .match(/([A-Z])/g)
        ?.reduce((str, c) => str.replace(new RegExp(c), '_' + c.toLowerCase()), camelCase)
        .substring(camelCase.slice(0, 1).match(/([A-Z])/g) ? 1 : 0);
};
