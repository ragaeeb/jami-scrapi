import { defineConfig } from '@trigger.dev/sdk/v3';

export default defineConfig({
    dirs: ['./src/trigger'],
    logLevel: 'log',
    // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
    // You can override this on an individual task.
    // See https://trigger.dev/docs/runs/max-duration
    maxDuration: 3600,
    project: 'proj_vonbqumlifqxmluiacbo',
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
