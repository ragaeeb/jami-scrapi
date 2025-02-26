import { defineConfig } from '@trigger.dev/sdk/v3';
import process from 'node:process';

if (!process.env.TRIGGER_DEV_PROJECT_ID) {
    throw new Error('Error: TRIGGER_DEV_PROJECT_ID is not set.');
}

export default defineConfig({
    dirs: ['./src/trigger'],
    logLevel: 'log',
    // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
    // You can override this on an individual task.
    // See https://trigger.dev/docs/runs/max-duration
    maxDuration: 3600,
    project: process.env.TRIGGER_DEV_PROJECT_ID,
    retries: {
        default: {
            factor: 2,
            maxAttempts: 3,
            maxTimeoutInMs: 10000,
            minTimeoutInMs: 1000,
            randomize: true,
        },
        enabledInDev: true,
    },
    runtime: 'node',
});
