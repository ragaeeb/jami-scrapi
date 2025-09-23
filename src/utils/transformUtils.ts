import type { Page } from 'bimbimba';

export const mapPagesToGroupingFields = (pages: Page[]) => {
    const groupingFields = new Set<string>();

    for (const page of pages) {
        if (page.metadata) {
            for (const key of Object.keys(page.metadata)) {
                groupingFields.add(key);
            }
        }
    }

    return groupingFields;
};

export const groupPagesByFields = (pages: Page[], fields: string[], delimiter: string) => {
    const groupedPages = Object.groupBy(pages, (page) => {
        const keys = [];

        if (page.metadata) {
            for (const field of fields) {
                keys.push(page.metadata[field]);
            }
        }

        return keys.join(delimiter);
    });

    return groupedPages;
};

export const transformPage = (page: Page, groupingFields: string[], partField?: string, removePartField?: boolean) => {
    if (!page.metadata) {
        return page;
    }

    const { metadata, ...updatedPage } = page;

    for (const field of groupingFields) {
        delete metadata[field];
    }

    if (partField) {
        updatedPage.part = parseInt(metadata[partField].replace(/\D+/, ''), 10);

        if (removePartField) {
            delete metadata[partField];
        } else {
            metadata[partField] = metadata[partField].replace(/\d+/, '');
        }
    }

    if (Object.keys(metadata).length > 0) {
        (updatedPage as Page).metadata = metadata;
    }

    return updatedPage;
};
