---
id: TC-DA-0003
title: "API: Validate individual dictation (dic.json) structure"
priority: High
status: Active
type: functional
created: 2026-03-23
updated: 2026-03-23
---

# TC-DA-0003 — API: Validate individual dictation (dic.json) structure

## Objective
For every dictation listed in the `dics` array of `index.json`, fetch the resource at `dics[i].path` (`dic.json`) and verify that its structure matches the expected schema.

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array with at least one item, each containing a `path` field).

## Test Data
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Dictation URL pattern:** value of `dics[i].path` for each item in the array

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each item in `dics`, send a GET request to `dics[i].path`  | Response status code is `200` |
| 3    | Parse the response body as JSON                                | Response is a valid JSON object |
| 4    | Check field `id`                                               | Value is a string |
| 5    | Check field `title`                                            | Value is a string |
| 6    | Check field `level`                                            | Value is a string |
| 7    | Check field `sentences`                                        | Value is a number |
| 8    | Check field `duration_sec`                                     | Value is a float (number) |
| 9    | Check field `voice`                                            | Value is an object |
| 10   | Check `voice.voice_name`                                       | Value is `null` or a string |
| 11   | Check `voice.voice_id`                                         | Value is `null` or a string |
| 12   | Check `voice.provider`                                         | Value is `"ElevenLabs"` or `null` |
| 13   | Check `voice.type`                                             | Value is `"man"` or `"woman"` |
| 14   | Check field `features`                                         | Field exists |
| 15   | Check field `tags`                                             | Field exists |
| 16   | Check field `video`                                            | Value is `null` or a string |
| 17   | Check field `created_at`                                       | Value is a date string |

## Screenshots / Attachments (optional)

## Edge Cases

## Notes
- `duration_sec` is validated as a JavaScript `number` (covers both integer and float).
- `voice.provider` is an enum limited to `"ElevenLabs"` or `null` based on current data.

## Related
- TC-DA-0001 — API: Open Entry Point and fetch index.json
- TC-DA-0002 — API: Validate index.json structure