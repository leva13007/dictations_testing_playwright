---
id: TC-DA-0011
title: "API: No duplicate dictation IDs in index"
priority: High
status: Active
type: functional
created: 2026-03-30
updated: 2026-03-30
---

# TC-DA-0011 — API: No duplicate dictation IDs in index

## Objective
Verify that all `id` values in the `dics` array of `index.json` are unique — no two dictations share the same ID.

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array with at least one item, each containing an `id` field).

## Test Data
- **base_url**: `https://leva13007.github.io/dictations/dics/`
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | Collect all `id` values from `dics` items                       | Array of ID strings |
| 3    | Check that the number of unique IDs equals the total number of items | No duplicates found |

## Screenshots / Attachments (optional)

## Edge Cases
- Two dictations have the same `id` → test should fail.
- IDs differ only in leading zeros (e.g. `"001"` vs `"0001"`) → test should fail (they are different strings, but may collide in routing).

## Notes
- Duplicate IDs would break client-side routing and could cause one dictation to shadow another.
- This test works entirely with the `index.json` response — no additional requests are needed.

## Related
- TC-DA-0001 — API: Open Entry Point and fetch index.json
- TC-DA-0002 — API: Validate index.json structure
