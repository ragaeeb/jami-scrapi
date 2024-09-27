export type ParsedContent = null | Record<string, number | string>;

export type TargetHandler = {
    (responseData: string): ParsedContent;
};
