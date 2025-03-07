[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/04af99fc-239b-4df8-82cc-5747c6b23293.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/04af99fc-239b-4df8-82cc-5747c6b23293)
[![Node.js CI](https://github.com/ragaeeb/jami-scrapi/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/jami-scrapi/actions/workflows/build.yml)
![GitHub](https://img.shields.io/github/license/ragaeeb/jami-scrapi)
![GitHub issues](https://img.shields.io/github/issues/ragaeeb/jami-scrapi)
![GitHub License](https://img.shields.io/github/license/ragaeeb/jami-scrapi)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/jami-scrapi)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/ragaeeb/jami-scrapi?labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit%20Reviews)

# Jami Scrapi

A command-line tool for web scraping, designed for ease of use and flexibility. It leverages [bimbimba](some_bimbimba_link_eventually) to provide a straightforward interface for extracting data from websites.

## Installation

Ensure you have Bun installed. If not, you can install it following the instructions on the [Bun website](https://bun.sh/).

```bash
bun install -g jami-scrapi
```

Or

```bash
npx jami-scrapi
```

Or

````bash
bunx jami-scrapi
```

## Usage

After installation, you can run the `jami-scrapi` command in your terminal.

```bash
jami-scrapi
```

The CLI will then prompt you to:

1.  **Select a library**:  Choose the scraping library you want to use. Currently uses `bimbimba`.
2.  **Select a function**:  Choose the specific scraping function you want to run from the selected library.
3.  **Enter a start page**: Specify the page number to begin scraping from.
4.  **Enter an end page**:  Specify the page number to stop scraping at.

The scraped data will be saved to a JSON file in the current directory, named according to the library and function used (e.g., `library_function_name.json`).

Example:

```bash
jami-scrapi
```

```
? Select library:  exampleScraper
? Select function: getPage
? Enter page to start at: 1
? Enter page to end at: 5
```

This will scrape pages 1 through 5 using the `getPage` function from the exampleScraper library and save the results to `example_scraper_get_page.json`.

## Requirements

- **Node.js v23.0.0+**

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to suggest improvements or report bugs.

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main branch of the original repository.

## License

This project is licensed under the MIT License. See the `LICENSE.MD` file for details.

[![Built with Dokugen](https://img.shields.io/badge/Built%20with-Dokugen-brightgreen)](https://github.com/samueltuoyo15/Dokugen)
````
