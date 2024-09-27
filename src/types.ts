export type JsonSerializable =
    | { [key: string]: JsonSerializable }
    | boolean
    | JsonSerializable[]
    | null
    | number
    | string;

export type ParsedContent = null | Record<string, JsonSerializable>;

export type TargetHandler = {
    (responseData: JsonSerializable | string): ParsedContent | ParsedContent[];
};
