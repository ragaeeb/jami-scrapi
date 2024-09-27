import { Buffer } from 'buffer';
import { createReadStream, createWriteStream, promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { Readable, Writable } from 'stream';
import { pipeline } from 'stream/promises';
import { createGunzip, createGzip } from 'zlib';

export const createTempDir = async (prefix = 'baheth'): Promise<string> => {
    const tempDirBase = path.join(os.tmpdir(), prefix);
    return fs.mkdtemp(tempDirBase);
};

export const readGzippedFile = async (filePath: string): Promise<string> => {
    const gunzip = createGunzip();
    const chunks: Uint8Array[] = [];

    // Create a custom writable stream to collect the decompressed chunks
    const writable = new Writable({
        write(chunk, encoding, callback) {
            chunks.push(chunk);
            callback();
        },
    });

    // Use pipeline to stream source (gzipped file) -> gunzip -> writable (which collects the decompressed data)
    await pipeline(createReadStream(filePath), gunzip, writable);

    return Buffer.concat(chunks).toString('utf-8');
};

export const saveGzippedFile = async (filePath: string, content: any, level: number = -1) => {
    const gzip = createGzip({ level });
    const source = Readable.from(Buffer.from(content));
    const destination = createWriteStream(filePath);

    return pipeline(source, gzip, destination); // Stream the content through gzip and into the destination file
};
