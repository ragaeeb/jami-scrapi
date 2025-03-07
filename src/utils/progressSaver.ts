import { promises as fs } from 'node:fs';
import process from 'node:process';
import { type Logger as PinoLogger } from 'pino';

export type SubLogger = Pick<PinoLogger, 'error' | 'info'>;

interface ProgressSaverOptions<T> {
    getData: () => T;
    logger: SubLogger;
    outputFile: string;
}

export class ProgressSaver<T> {
    private getData: () => T;
    private logger: SubLogger;
    private outputFile: string;

    constructor(options: ProgressSaverOptions<T>) {
        this.outputFile = options.outputFile;
        this.getData = options.getData;
        this.logger = options.logger;

        // Handle shutdown signals
        process.on('SIGINT', async () => {
            this.logger.info('Gracefully shutting down...');
            await this.saveProgress();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            this.logger.info('Process terminated.');
            await this.saveProgress();
            process.exit(0);
        });
    }

    async saveProgress() {
        try {
            this.logger.info(`Saving progress to ${this.outputFile}...`);

            await fs.writeFile(this.outputFile, JSON.stringify(this.getData(), null, 2));
        } catch (error) {
            this.logger.error('Error saving progress:', error);
        }
    }
}
