# Dictations API Testing

Automated API test suite for the [Dictations](https://leva13007.github.io/dictations/dics/) platform, built with [Playwright](https://playwright.dev/).

## Overview

This project validates the REST API that serves dictation content — index metadata, individual dictation configs (`dic.json`), playlists (`playlist.json`), audio files, and text transcripts (`Text.md`).

Tests are organized into four groups:

| Group | File | Description |
|-------|------|-------------|
| **Smoke** | `smoke.spec.ts` | Entry point availability and basic response validation |
| **Contract** | `contract.spec.ts` | JSON schema and structure validation for index, `dic.json`, and `playlist.json` |
| **Content** | `content.spec.ts` | Audio file existence, sentence quality, playlist ID sequencing, naming conventions, `Text.md` presence |
| **Integrity** | `integrity.spec.ts` | Cross-resource consistency — sentence counts, durations, index-vs-dic metadata, duplicate ID detection |

## Test Cases

| ID | Title |
|----|-------|
| TC-DA-0001 | Index availability |
| TC-DA-0002 | Index structure |
| TC-DA-0003 | Dictation structure |
| TC-DA-0004 | Playlist structure |
| TC-DA-0005 | Sentence count consistency |
| TC-DA-0006 | Audio files exist |
| TC-DA-0007 | No empty sentences |
| TC-DA-0008 | Index vs dic.json consistency |
| TC-DA-0009 | Playlist IDs sequential |
| TC-DA-0010 | Audio naming convention |
| TC-DA-0011 | No duplicate dictation IDs |
| TC-DA-0012 | Text.md exists |

Detailed test case descriptions are available in `qa/test-cases/`.

## Prerequisites

- Node.js 18+
- Yarn or npm

## Setup

```bash
yarn install
npx playwright install
```

## Running Tests

```bash
# Run all tests
yarn test

# Run a specific test group
npx playwright test tests/api/smoke.spec.ts
npx playwright test tests/api/contract.spec.ts
npx playwright test tests/api/content.spec.ts
npx playwright test tests/api/integrity.spec.ts

# Interactive UI mode
yarn test-ui

# Debug mode
yarn test-debug

# Open HTML report
yarn report
```

## Project Structure

```
tests/api/
├── constants.ts        # Shared constants (entry point URL)
├── types.ts            # TypeScript types for API responses
├── smoke.spec.ts       # Smoke tests
├── contract.spec.ts    # Contract/schema tests
├── content.spec.ts     # Content validation tests
└── integrity.spec.ts   # Cross-resource integrity tests

qa/
├── templates/          # Test case template
└── test-cases/         # Detailed test case documentation (TC-DA-0001..0012)
```

## Versioning & Releasing

The project version lives in `package.json` and is mirrored in `CHANGELOG.md`.

### Bump the version

Use `npm version` to bump the version automatically — it updates `package.json` and creates a git commit + tag in one step:

```bash
# Patch (0.0.1 → 0.0.2) — small fixes, metadata changes
npm version patch -m "v%s"

# Minor (0.0.2 → 0.1.0) — new dictation added
npm version minor -m "v%s"

# Major (0.1.0 → 1.0.0) — breaking structure changes
npm version major -m "v%s"
```

## Configuration

Base URL and Playwright settings are defined in `playwright.config.ts`. Tests run against:

```
https://leva13007.github.io/dictations/dics/
```

## License

MIT
