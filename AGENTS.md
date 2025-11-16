# Agent Guide

Welcome to **jami-scrapi**! This guide captures everything you need to build, test, and extend the scraping CLI with confidence.

## Repository tour
- `src/index.ts` – the CLI entrypoint that wires the prompts, WordPress + Bimbimba scrapers, joiner, transformer, and output writers.
- `src/utils/` – focused helpers, each with colocated unit tests:
  - `joiner`, `transformUtils`, `textUtils`, and `prompts` support CLI ergonomics.
  - `scraper`, `wordpress`, and `random` cover network orchestration, WordPress discovery, and retry jitter.
  - `index.ts` re-exports the pieces that should be callable from consumers.
- `src/**/*.test.ts` – Bun-powered unit tests that sit next to the code they verify.
- `tsdown.config.ts` – the authoritative build definition consumed by the official `tsdown` CLI.
- `tsconfig.json` – compiler settings (strict mode, isolated declarations, Bun types) shared by the build and editors.
- `README.md` + `AGENTS.md` – living documentation for end-users and contributors respectively.
- `dist/` – generated bundles and declaration files; never edit by hand.

## Build + tooling workflow
- Install dependencies with `bun install` (Bun ≥1.2.22 is required).
- Bundle + type-check via `bun run build` which runs `tsdown` using `tsdown.config.ts` and emits `dist/index.mjs` + `.d.ts`.
- Run `bun test` to execute Bun's test runner; mock randomness/timers with `vi` where deterministic output is needed.
- Keep formatting + lint rules satisfied with `bun run lint` (Biome) and `bun run format` for mass rewrites.
- When dependencies need upgrading, run `bun update --latest` and capture failures in your summary.
- Always rerun `bun run build` and `bun test` before opening a PR.

## Coding conventions & style
- Modules use the ESM syntax (`import`/`export`). All exported functions must declare explicit return types.
- Prefer small, composable helpers; colocate a `*.test.ts` sibling for every new utility and cover edge cases (error paths, retries, sanitisation, etc.).
- Follow Biome's style profile: four-space indentation, 120 character line limit, single quotes, trailing commas, and organized imports.
- Stick to the logging helpers in `src/utils/prompts.ts` and `src/utils/textUtils.ts` so CLI messaging remains consistent.
- Reject unsafe `any` usage; if unavoidable, document the reasoning inline. Use discriminated unions or `unknown` with runtime guards where possible.
- Errors should carry actionable context (URL, retry count, etc.) and we prefer early returns to deeply nested conditionals.

## Release considerations
- The published package exposes `dist/index.mjs` plus `dist/index.d.mts`; keep `tsdown.config.ts` aligned with the latest guidance from [tsdown.dev](https://tsdown.dev).
- Semantic Release drives versioning. Keep commits conventional-friendly and avoid manually editing the changelog.
- The CLI ships with a Bun shebang via a tiny plugin in `tsdown.config.ts`. If you split the bundle, ensure the shebang stays on the executable chunk.

Thanks for contributing and happy shipping!
