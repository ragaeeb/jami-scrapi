[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/04af99fc-239b-4df8-82cc-5747c6b23293.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/04af99fc-239b-4df8-82cc-5747c6b23293)
[![Node.js CI](https://github.com/ragaeeb/jami-scrapi/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/jami-scrapi/actions/workflows/build.yml)
![GitHub](https://img.shields.io/github/license/ragaeeb/jami-scrapi)
![GitHub issues](https://img.shields.io/github/issues/ragaeeb/jami-scrapi)
![GitHub License](https://img.shields.io/github/license/ragaeeb/jami-scrapi)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/jami-scrapi)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/ragaeeb/jami-scrapi?labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit%20Reviews)

# Jami Scrapi

A batteries-included scraping CLI that turns Bimbimba scrapers and WordPress APIs into portable JSON datasets. Jami Scrapi guides you through every step – from picking a scraper to transforming the harvested pages – while automatically persisting progress so interrupted runs can resume safely.

## Features

- **Interactive scraper orchestration** – choose any Bimbimba library/function, provide page ranges, and let the CLI orchestrate the run.
- **WordPress session harvesting** – discover available `/wp-json/wp/v2` routes, fetch posts in batches, and clean their HTML payloads.
- **Joiner workflow** – merge multiple scrape artefacts, highlight missing page gaps, and emit a consolidated JSON file.
- **Transformer workflow** – regroup pages by metadata, extract part numbers, and write grouped collections to disk.
- **Resilient downloader** – auto retries on transient server errors with jittered backoff and logs detailed progress.
- **TypeScript definitions** – generated during builds to keep downstream projects strongly typed.

## Installation

Ensure you have [Bun](https://bun.sh/) installed.

```bash
bun install -g jami-scrapi
```

Or run it ad-hoc:

```bash
npx jami-scrapi
# or
bunx jami-scrapi
```

## Usage

Launch the CLI from your terminal:

```bash
jami-scrapi
```

You will be prompted to select one of the following actions:

1. **Scrape WordPress site** – choose a WordPress host, pick the discovered content routes, and export every record to JSON.
2. **Scrape from bimbimba** – select a Bimbimba scraper and function, define page ranges, and download each page with optional delay.
3. **Post-process scraped data** – merge multiple session files into a single archive using the joiner.
4. **Transform a scraped session** – regroup an existing scrape by metadata fields and split it into logical collections.

Each workflow asks for the minimal amount of information required, sanitises your input, and writes the output file in the current directory. Progress is logged with timestamps so that long-running scrapes can be monitored easily.

### Advanced workflows

- **Joining artefacts** – when you choose _Post-process scraped data_, the CLI validates the folder, consolidates every `*.json` file, sorts the resulting pages, and warns you about missing page gaps before writing the combined result.
- **Transforming sessions** – the transformer inspects metadata to suggest grouping fields, optionally extracts numeric `part` identifiers, and emits one JSON file per group in a dedicated folder.
- **WordPress scraping** – results are cleaned of embedded scripts and noisy characters, URLs are stripped from bodies, and runs are persisted incrementally via `catsa-janga` so they can resume if interrupted.

## Development

Install dependencies:

```bash
bun install
```

Bundle the CLI (via the official `tsdown` CLI and `tsdown.config.ts`):

```bash
bun run build
```

This produces `dist/index.mjs` plus the matching `dist/index.d.mts` typings consumed by downstream projects.

Run the unit test suite:

```bash
bun test
```

Format and lint the codebase:

```bash
bun run format
bun run lint
```

## Requirements

- **Bun v1.3.2+**
- **Node.js v22+**

## Contributing

Contributions are welcome! Please open an issue or pull request describing the improvement or bug fix you would like to tackle.

## License

This project is licensed under the MIT License. See [`LICENSE.MD`](./LICENSE.MD) for details.

[![Built with Dokugen](https://img.shields.io/badge/Built%20with-Dokugen-brightgreen)](https://github.com/samueltuoyo15/Dokugen)
