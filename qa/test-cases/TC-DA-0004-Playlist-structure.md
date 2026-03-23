---
id: TC-DA-0004
title: "API: Validate playlist.json structure for each dictation"
priority: High
status: Active
type: functional
created: 2026-03-23
updated: 2026-03-23
---

# TC-DA-0004 — API: Validate playlist.json structure for each dictation

## Objective
For every dictation listed in the `dics` array of `index.json`, fetch `playlist.json` at `base_url + dics[i].id + /playlist.json` and verify that it is a non-empty array where each item matches the expected schema.

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array with at least one item, each containing an `id` field).

## Test Data
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Playlist URL pattern:** `base_url + dics[i].id + /playlist.json`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each item in `dics`, send a GET request to `base_url + dics[i].id + /playlist.json` | Response status code is `200` |
| 3    | Parse the response body as JSON                                | Response is a valid JSON array |
| 4    | Verify the array is non-empty                                  | Array contains at least one item |
| 5    | For every item in the array, check field `id`                  | Value is a number |
| 6    | For every item in the array, check field `text`                | Value is a string |
| 7    | For every item in the array, check field `audio`               | Value is a string |
| 8    | For every item in the array, check field `duration_sec`        | Value is a number |

## Screenshots / Attachments (optional)

## Edge Cases
- Playlist URL returns non-200 → test should fail for that dictation.
- Response body is not valid JSON → test should fail.
- Response is not an array → test should fail.
- Array is empty → test should fail (expect at least one sentence).
- Any item is missing a required field → test should fail.
- `id` is not a number → test should fail.
- `duration_sec` is not a number → test should fail.

## Notes
- `duration_sec` is validated as a JavaScript `number` (covers both integer and float).
- `audio` is expected to be a string path/URL to the audio file; its reachability is not validated in this test case.

## Related
- TC-DA-0001 — API: Open Entry Point and fetch index.json
- TC-DA-0002 — API: Validate index.json structure
- TC-DA-0003 — API: Validate individual dictation (dic.json) structure