import { Page } from 'bimbimba';

export type PageFetcher = (page: number) => Promise<Page>;

export type ScrapeResult = {
    pages: Page[];
    scrapingEngine?: { name: string; version: string };
    timestamp: Date;
    urlPattern?: string;
};
