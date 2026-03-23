---
id: TC-DA-0002
title: "API: Validate index.json structure"
priority: High
status: Active
type: functional
created: 2026-03-23
updated: 2026-03-23
---

# TC-DA-0002 — API: Validate index.json structure

## Objective
Verify that `index.json` returned by the API entry point conforms to the expected top-level schema and that each item in the `dics` array has the required shape.

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).

## Test Data
- **URL:** `https://leva13007.github.io/dictations/dics/index.json`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|------------------------------------------------------|-----------------|
| 1    | Send a GET request to `https://leva13007.github.io/dictations/dics/index.json` and parse the response as JSON | Response is a valid JSON object |
| 2    | Check top-level field `language`                     | Value is a non-empty string |
| 5    | Check top-level field `repository`                   | Value is a string, field not required |
| 6    | Check top-level field `created_at`                   | Value is a date string |
| 7    | Check top-level field `updated_at`                   | Value is a date string |
| 8    | Check top-level field `dics`                         | Value is a non-empty array |
| 9    | For every item in `dics`, verify `id`                | Value is a non-empty string |
| 11   | For every item in `dics`, verify `title`             | Value is a non-empty string |
| 12   | For every item in `dics`, verify `level`             | Value is a non-empty string |
| 13   | For every item in `dics`, verify `sentences`         | Value is a non-negative integer |
| 14   | For every item in `dics`, verify `duration_sec`      | Value is a non-negative float (number) |
| 15   | For every item in `dics`, verify `tags`              | Field exists, field not required |
| 16   | For every item in `dics`, verify `features`          | Field exists, field not required |
| 17   | For every item in `dics`, verify `type`              | Field exists, field not required |

## Screenshots / Attachments (optional)

## Edge Cases

## Notes
- `duration_sec` is validated as a JavaScript `number` (which covers both integer and float).

## Related
- TC-DA-0001 — API: Open Entry Point and fetch index.json