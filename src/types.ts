export type JsonSerializable = { [key: string]: any };

export type ParsedContent = null | Record<string, any>;

export type TargetHandler = {
    (responseData: JsonSerializable | string): ParsedContent | ParsedContent[];
};
