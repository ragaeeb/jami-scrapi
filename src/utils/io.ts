import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

export const createTempDir = async (prefix = 'jami-scrapers'): Promise<string> => {
    const tempDirBase = path.join(os.tmpdir(), prefix);
    return fs.mkdtemp(tempDirBase);
};
