---
id: TC-DA-0008
title: "API: Index metadata should match dic.json"
priority: High
status: Active
type: functional
created: 2026-03-30
updated: 2026-03-30
---

# TC-DA-0008 — API: Index metadata should match dic.json

## Objective
For every dictation listed in the `dics` array of `index.json`, fetch `dic.json` and verify that the shared fields in both sources are identical.

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array).
- TC-DA-0003 passes (`dic.json` is fetchable and has the expected structure).

## Test Data
- **base_url**: `https://leva13007.github.io/dictations/dics/`
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Dictation URL pattern:** `base_url + dics[i].id + /dic.json`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each item in `dics`, send a GET request to `base_url + dics[i].id + /dic.json` | Response status code is `200` and body is valid JSON |
| 3    | Compare `index.dics[i].id` with `dic.json.id`                  | Values are equal |
| 4    | Compare `index.dics[i].title` with `dic.json.title`            | Values are equal |
| 5    | Compare `index.dics[i].level` with `dic.json.level`            | Values are equal |
| 6    | Compare `index.dics[i].sentences` with `dic.json.sentences`    | Values are equal |
| 7    | Compare `index.dics[i].duration_sec` with `dic.json.duration_sec` | Values are equal |
| 8    | Compare `index.dics[i].tags` with `dic.json.tags`              | Arrays are deeply equal |
| 9    | Compare `index.dics[i].features` with `dic.json.features`      | Arrays are deeply equal |

## Screenshots / Attachments (optional)

## Edge Cases
- `dic.json` returns non-200 → test should fail for that dictation.
- A field exists in `index.json` but is missing in `dic.json` (or vice versa) → test should fail.
- Numeric values differ by floating-point rounding (e.g. `70.9` vs `70.90000001`) → consider a tolerance or exact match based on project convention.
- Array fields (`tags`, `features`) differ in order → decide whether order matters (currently expected to be identical).

## Notes
- The following fields are present in both `index.json` items and `dic.json` and should be compared:
  `id`, `title`, `level`, `sentences`, `duration_sec`, `tags`, `features`.
- Fields present only in `index.json`: `path`, `type`, `has_video`.
- Fields present only in `dic.json`: `voice`, `video`, `created_at`.
- This test does not validate `index.dics[i].path` correctness (that is implicitly covered by successfully fetching `dic.json`).

## Related
- TC-DA-0001 — API: Open Entry Point and fetch index.json
- TC-DA-0002 — API: Validate index.json structure
- TC-DA-0003 — API: Validate individual dictation (dic.json) structure
