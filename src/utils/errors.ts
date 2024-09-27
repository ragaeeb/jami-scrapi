import { JsonSerializable } from '../types';

export class ProgressError extends Error {
    progressData: JsonSerializable;

    constructor(message: string, progressData: JsonSerializable, originalError: any) {
        super(message);
        this.name = 'ProgressError';

        Object.assign(this, originalError);

        this.progressData = progressData;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ProgressError);
        }
    }
}
