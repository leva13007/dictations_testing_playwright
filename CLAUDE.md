# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does

Automated API test suite for the Dictations platform — a language-learning dictation app. Tests hit the GitHub Pages–hosted static API (JSON files + MP3s) that powers the app, validating availability, schema contract, content quality, and cross-resource consistency.

The API being tested has no server logic. It is a set of static files published from the `dictations` repo to GitHub Pages:
- `dics/index.json` — master list of all dictations
- `dics/<id>/dic.json` — per-dictation metadata
- `dics/<id>/playlist.json` — ordered sentence list with audio references
- `dics/<id>/sounds/<id>-<nn>.mp3` — sentence audio files
- `dics/<id>/Text.md` — full dictation text

## Ecosystem Context

This repo lives inside a local `dic_app/` workspace alongside sibling projects:

| Sibling | Role |
|---------|------|
| `dictations/` | Content repo — source of truth for JSON metadata and MP3 audio, published to GitHub Pages |
| `dictation_app/` | Frontend React/Vite app that fetches from the GitHub Pages API at runtime |
| `dic_img/`, `dic_thumbnail/`, `dic_video/` | Media generation helpers |

This test suite validates the published output of the `dictations/` repo. When content is added or modified there, run these tests against that deployment.

## Tech Stack

- **Playwright** (`@playwright/test`) — API request testing, no browser UI involved
- **TypeScript** — test files and utilities
- **Yarn** — package manager

## Commands

```bash
yarn install
npx playwright install          # install Playwright browsers (Chromium only is active)

yarn test                       # run all tests
yarn test-ui                    # interactive Playwright UI mode
yarn test-debug                 # step-through debug mode
yarn report                     # open last HTML report

# Run a single spec file
npx playwright test tests/api/smoke.spec.ts
npx playwright test tests/api/contract.spec.ts
npx playwright test tests/api/content.spec.ts
npx playwright test tests/api/integrity.spec.ts

# Run against production instead of the default staging URL
API_URL=https://leva13007.github.io/dictations/dics/ yarn test
```

## Architecture

### Target URL

`playwright.config.ts` defaults to `https://leva13007.github.io/dictations_stage/dics/` (staging). Override with `API_URL` env var to target production (`/dictations/dics/`). The README references production; the config defaults to staging — this is intentional.

### Test layers

| File | ID range | What it checks |
|------|----------|----------------|
| `smoke.spec.ts` | TC-DA-0001 | Entry point responds and returns an object |
| `contract.spec.ts` | TC-DA-0002–0004 | JSON schema: field types, required keys, value constraints |
| `content.spec.ts` | TC-DA-0006–0007, 0009–0010, 0012 | Audio files return `audio/mpeg`, sentences non-empty, IDs sequential, filenames match `NNNN-NN.mp3`, `Text.md` exists |
| `integrity.spec.ts` | TC-DA-0005, 0008, 0011 | `dic.json` sentence count matches `playlist.json` length, duration sums match, index metadata matches `dic.json`, no duplicate IDs |

### `DictationAPI` client (`tests/utils/api-client.ts`)

Central wrapper over `APIRequestContext` with per-instance caching (`indexCache`, `dicCache`, `playlistCache`). All spec files instantiate it in `beforeAll` and share it within the describe block. `expect` calls inside the client act as pre-condition guards — if any fetch fails, the test fails there rather than with a null-dereference later.

### Audio filename convention

Pattern: `NNNN-NN.mp3` (4-digit dictation ID + 2-digit sentence number). Enforced by `AUDIO_FILENAME_PATTERN` and `getDicAndSentenceIds` in `tests/utils/helpers.ts`.

### QA docs

`qa/test-cases/` holds one Markdown file per test case (TC-DA-0001 through TC-DA-0012) with objective, preconditions, steps, and edge cases. `qa/templates/TC-DA-0000-Template.md` is the template for new test case docs.

## Versioning

Version lives in `package.json`. Use `npm version` to bump — it creates a commit and tag:

```bash
npm version patch -m "v%s"   # small fix
npm version minor -m "v%s"   # new test added
npm version major -m "v%s"   # breaking structure change
```
