export type ResponseData = { [key: string]: any } | string;

export interface Page {
    body?: string;
    bookName?: string;
    chapterName?: string;
    footer?: string;
    id: number;
    metadata?: any;
    part?: number;
    sourceUpdatedAt?: number;
    title?: string;
}

export type TargetHandler = {
    (responseData: ResponseData): null | Page[] | Partial<Page>;
};
