import { Page } from 'bimbimba';

export type PageFetcher = (page: number) => Promise<Page | Page[]>;
