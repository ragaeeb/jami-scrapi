import type { Page } from 'bimbimba';

/**
 * Maps the provided pages to all available metadata keys.
 *
 * @param pages - The pages that may contain metadata fields.
 * @returns A set containing each unique metadata key discovered.
 */
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

/**
 * Groups pages by the provided metadata fields using a delimiter to form the group key.
 *
 * @param pages - Pages that should be grouped.
 * @param fields - Metadata keys that should be used for grouping.
 * @param delimiter - Separator used when concatenating keys.
 * @returns A record keyed by the computed group identifier with the matching pages.
 */
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

/**
 * Removes grouping metadata fields from a page and optionally extracts a numeric part identifier.
 *
 * @param page - The page being transformed.
 * @param groupingFields - Fields that should be removed from metadata.
 * @param partField - Field used to extract the numeric part identifier.
 * @param removePartField - When true removes the part field after extraction.
 * @returns The transformed page.
 */
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
