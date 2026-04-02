---
id: TC-DA-0012
title: "API: Text.md exists for each dictation"
priority: Medium
status: Active
type: functional
created: 2026-03-30
updated: 2026-03-30
---

# TC-DA-0012 — API: Text.md exists for each dictation

## Objective
For every dictation listed in the `dics` array of `index.json`, verify that the source text file `Text.md` exists and is reachable at `base_url + dics[i].id + /Text.md`.

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array with at least one item, each containing an `id` field).

## Test Data
- **base_url**: `https://leva13007.github.io/dictations/dics/`
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Text URL pattern:** `base_url + dics[i].id + /Text.md`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each dictation, send a GET request to `base_url + dics[i].id + /Text.md` | Response status code is `200` |
| 3    | Verify the response body is not empty                           | Body length is greater than 0 |

## Screenshots / Attachments (optional)

## Edge Cases
- `Text.md` returns non-200 (e.g. 404) → test should fail for that dictation.
- `Text.md` exists but is empty (0 bytes) → test should fail.

## Notes
- `Text.md` is the source text from which the dictation sentences are generated.
- The project file structure requires `Text.md` in every dictation folder:
  ```
  XXXX/
  ├── dic.json
  ├── playlist.json
  ├── Text.md            ← this file
  ├── ReadMe.md          (optional)
  └── sounds/
  ```

## Related
- TC-DA-0001 — API: Open Entry Point and fetch index.json
- TC-DA-0002 — API: Validate index.json structure
