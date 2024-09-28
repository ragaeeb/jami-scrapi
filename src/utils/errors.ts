export class ProgressError extends Error {
    progressData: any;

    constructor(message: string, progressData: any, originalError: any) {
        super(message);
        this.name = 'ProgressError';

        Object.assign(this, originalError);

        this.progressData = progressData;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ProgressError);
        }
    }
}
