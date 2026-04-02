---
id: TC-DA-0007
title: "API: Sentences should not be empty"
priority: High
status: Active
type: functional
created: 2026-03-30
updated: 2026-03-30
---

# TC-DA-0007 — API: Sentences should not be empty

## Objective
For every dictation listed in the `dics` array of `index.json`, fetch `playlist.json` and verify that every sentence's `text` field is a non-empty, meaningful string (length > 3).

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array with at least one item, each containing an `id` field).
- TC-DA-0004 passes (`playlist.json` is fetchable and each item has a valid `text` string field).

## Test Data
- **base_url**: `https://leva13007.github.io/dictations/dics/`
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Playlist URL pattern:** `base_url + dics[i].id + /playlist.json`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each dictation, send a GET request to `base_url + dics[i].id + /playlist.json` | Response status code is `200` and body is a valid JSON array |
| 3    | For each item in the playlist array, check that `text` is not empty | `text` is a non-empty string (after trimming whitespace) |
| 4    | For each item in the playlist array, check that `text.trim().length > 3` | Trimmed text length is greater than 3 |

## Screenshots / Attachments (optional)

## Edge Cases
- `text` is an empty string `""` → test should fail.
- `text` contains only whitespace (e.g. `"   "`) → test should fail.
- `text` has 1–3 characters (e.g. `"Hi"`, `"Ok."`) → test should fail (too short to be a valid sentence).
- `text` is `null` or `undefined` → test should fail.

## Notes
- The minimum length threshold of 3 characters ensures that trivially short or placeholder values are caught.
- Whitespace is trimmed before checking length to prevent strings like `"   a"` from passing on padding alone.

## Related
- TC-DA-0001 — API: Open Entry Point and fetch index.json
- TC-DA-0002 — API: Validate index.json structure
- TC-DA-0004 — API: Validate playlist.json structure for each dictation
