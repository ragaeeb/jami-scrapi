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

export const getRandomWaitTime = (minSeconds: number, maxSeconds: number) => {
    const minMilliseconds = minSeconds * 1000;
    const maxMilliseconds = maxSeconds * 1000;
    return Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) + minMilliseconds;
};
