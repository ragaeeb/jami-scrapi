import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { logger, task } from '@trigger.dev/sdk/v3';
import { getScraper } from 'bimbimba';
import process from 'node:process';

import { scrape } from '../utils/scraper.js';

type ScrapeAndUploadPayload = {
    delay: number;
    end: number;
    functionName: string;
    library: string;
    outputFile: string;
    start: number;
};

export const scrapeAndUpload = task({
    id: 'scrape-and-upload',
    maxDuration: 3600,
    run: async (payload: ScrapeAndUploadPayload, { ctx }) => {
        logger.log('scrapeAndUpload', { ctx, payload });

        if (
            [
                process.env.AWS_REGION,
                process.env.AWS_ACCESS_KEY,
                process.env.AWS_SECRET_KEY,
                process.env.AWS_BUCKET,
            ].some((variable) => !variable)
        ) {
            logger.log('Missing variables');
            throw new Error(`Variable not set`);
        }

        const { delay, end, functionName, library, outputFile, start } = payload;

        const module = await getScraper(library);
        const pages = await scrape({
            delay,
            end,
            func: module[functionName],
            outputFile,
            start,
        });

        logger.log(`${pages.length} pages downloaded, uploading`);

        const s3Client = new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY as string,
                secretAccessKey: process.env.AWS_SECRET_KEY as string,
            },
            region: process.env.AWS_REGION as string,
        });

        logger.log(`Uploading to bucket`);

        await s3Client.send(
            new PutObjectCommand({
                Body: JSON.stringify(pages),
                Bucket: process.env.AWS_BUCKET,
                ContentType: 'application/json',
                Key: outputFile,
            }),
        );

        logger.log(`Uploaded to ${process.env.AWS_BUCKET}/${outputFile}`);

        s3Client.destroy();
    },
});
