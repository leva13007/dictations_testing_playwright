---
id: TC-DA-0009
title: "API: Playlist IDs are sequential"
priority: Medium
status: Active
type: functional
created: 2026-03-30
updated: 2026-03-30
---

# TC-DA-0009 — API: Playlist IDs are sequential

## Objective
For every dictation listed in the `dics` array of `index.json`, fetch `playlist.json` and verify that the `id` field of each item forms a sequential series starting from 1 (i.e. 1, 2, 3, …).

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array).
- TC-DA-0004 passes (`playlist.json` is fetchable and each item has a valid numeric `id` field).

## Test Data
- **base_url**: `https://leva13007.github.io/dictations/dics/`
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Playlist URL pattern:** `base_url + dics[i].id + /playlist.json`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each dictation, send a GET request to `base_url + dics[i].id + /playlist.json` | Response status code is `200` and body is a valid JSON array |
| 3    | For each item at index `j` (0-based) in the playlist array, check `item.id` | `item.id` equals `j + 1` |

## Screenshots / Attachments (optional)

## Edge Cases
- IDs start from 0 instead of 1 → test should fail.
- IDs have gaps (e.g. 1, 2, 4) → test should fail.
- IDs are out of order (e.g. 2, 1, 3) → test should fail.
- Duplicate IDs → test should fail.
`
## Notes
- Sequential IDs ensure the generation pipeline did not skip or duplicate sentences.

## Related
- TC-DA-0004 — API: Validate playlist.json structure for each dictation
