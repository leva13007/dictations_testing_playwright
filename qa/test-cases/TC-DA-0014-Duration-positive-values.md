---
id: TC-DA-0014
title: "API: Duration values are positive"
priority: Medium
status: Active
type: functional
created: 2026-03-30
updated: 2026-03-30
---

# TC-DA-0014 — API: Duration values are positive

## Objective
Verify that all `duration_sec` values — in `index.json` items, `dic.json`, and each `playlist.json` item — are strictly positive numbers (> 0).

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array).
- TC-DA-0003 passes (`dic.json` is fetchable and has a valid `duration_sec` field).
- TC-DA-0004 passes (`playlist.json` is fetchable and each item has a valid `duration_sec` field).

## Test Data
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Dictation URL pattern:** `base_url + dics[i].id + /dic.json`
- **Playlist URL pattern:** `base_url + dics[i].id + /playlist.json`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each item in `dics`, check `duration_sec`                   | Value is a number greater than 0 |
| 3    | For each dictation, fetch `dic.json` and check `duration_sec`   | Value is a number greater than 0 |
| 4    | For each dictation, fetch `playlist.json`                       | Response status code is `200` and body is a valid JSON array |
| 5    | For each item in the playlist array, check `duration_sec`       | Value is a number greater than 0 |

## Screenshots / Attachments (optional)

## Edge Cases
- `duration_sec` is `0` → test should fail.
- `duration_sec` is negative → test should fail.
- `duration_sec` is `NaN` or `null` → test should fail.

## Notes
- Zero or negative duration indicates a generation error — every sentence and dictation must have a measurable positive duration.
- This test complements TC-DA-0005 (which checks consistency between dic.json and playlist.json totals) by ensuring individual values are valid.

## Related
- TC-DA-0003 — API: Validate individual dictation (dic.json) structure
- TC-DA-0004 — API: Validate playlist.json structure for each dictation
- TC-DA-0005 — API: Sentence count and duration consistency between dic.json and playlist.json
