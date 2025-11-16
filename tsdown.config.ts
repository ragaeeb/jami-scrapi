import { defineConfig } from 'tsdown';

const bunShebang = () => ({
    name: 'bun-shebang',
    renderChunk(code: string, chunk: { fileName: string }) {
        if (!chunk.fileName.endsWith('.js') && !chunk.fileName.endsWith('.mjs')) {
            return null;
        }

        if (code.startsWith('#!/usr/bin/env bun')) {
            return null;
        }

        return {
            code: `#!/usr/bin/env bun\n${code}`,
        };
    },
});

export default defineConfig({
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    external: ['bun', 'bun:*'],
    format: 'esm',
    minify: true,
    outDir: 'dist',
    platform: 'node',
    plugins: [bunShebang()],
    sourcemap: true,
    target: 'node22',
});
