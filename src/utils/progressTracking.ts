import crypto from 'crypto';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

import { JsonSerializable } from '../types';

const stringToHash = (str: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
};

export const getCacheDirectory = async (prefix: string = 'baheth'): Promise<string> => {
    const tempDirBase = path.join(os.tmpdir(), prefix);

    await fs.mkdir(tempDirBase, { recursive: true });

    return tempDirBase;
};

export const loadProgress = async (key: string): Promise<JsonSerializable> => {
    try {
        const file = await getFileNameForKey(key);
        const raw = await fs.readFile(file, 'utf-8');

        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const getFileNameForKey = async (key: string) => {
    const cacheDirectory = await getCacheDirectory();
    const file = path.join(cacheDirectory, `${stringToHash(key)}.json`);

    return file;
};

export const saveProgress = async (key: string, jsonData: JsonSerializable): Promise<string> => {
    const file = await getFileNameForKey(key);
    await fs.writeFile(file, JSON.stringify(jsonData));

    return file;
};
