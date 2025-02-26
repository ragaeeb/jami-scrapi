import { Page } from 'bimbimba';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const joinBooks = async (folder: string, metadata: Record<string, any>, outputFile: string) => {
    const filesPromises = (await fs.readdir(folder))
        .map((file) => path.join(folder, file))
        .map((file) => fs.readFile(file, 'utf-8'));
    const filesData = await Promise.all(filesPromises);
    const combined: { metadata: Record<string, any>; pages: Page[]; timestamp: Date } = {
        metadata,
        pages: [],
        timestamp: new Date(),
    };

    const pages = filesData.flatMap((raw) => JSON.parse(raw).pages as Page[]);
    combined.pages = pages.toSorted((a, b) => a.page - b.page);

    await fs.writeFile(outputFile, JSON.stringify(combined, null, 2));
};
