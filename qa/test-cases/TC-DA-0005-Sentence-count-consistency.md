---
id: TC-DA-0005
title: "API: Sentence count and duration consistency between dic.json and playlist.json"
priority: High
status: Active
type: functional
created: 2026-03-23
updated: 2026-03-23
---

# TC-DA-0005 — API: Sentence count and duration consistency between dic.json and playlist.json

## Objective
For every dictation, verify that `dic.json` metadata is consistent with the actual `playlist.json` data:
1. The `sentences` field in `dic.json` equals the number of items in `playlist.json`.
2. The `duration_sec` field in `dic.json` equals the sum of all `duration_sec` values in `playlist.json`.

## Preconditions
- TC-DA-0003 passes (`dic.json` is fetchable and has valid `sentences` and `duration_sec` fields).
- TC-DA-0004 passes (`playlist.json` is fetchable and each item has a valid `duration_sec` field).

## Test Data
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Dictation URL pattern:** `dics[i].path` → `dic.json`
- **Playlist URL pattern:** `base_url + dics[i].id + /playlist.json`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each dictation, fetch `dic.json` and `playlist.json`       | Both responses return status `200` and valid JSON |
| 3    | Compare `dic.json.sentences` with `playlist.json.length`       | Values are equal |
| 4    | Sum all `duration_sec` values from `playlist.json` items        | Sum is computed |
| 5    | Compare `dic.json.duration_sec` with the computed sum           | Values are equal |

## Screenshots / Attachments (optional)

## Edge Cases

## Notes

## Related
- TC-DA-0003 — API: Validate individual dictation (dic.json) structure
- TC-DA-0004 — API: Validate playlist.json structure for each dictation