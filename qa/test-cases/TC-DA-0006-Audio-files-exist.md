---
id: TC-DA-0006
title: "API: Each sentence should have a valid audio file"
priority: High
status: Active
type: functional
created: 2026-03-30
updated: 2026-03-30
---

# TC-DA-0006 — API: Each sentence should have a valid audio file

## Objective
For every dictation listed in the `dics` array of `index.json`, fetch `playlist.json` and verify that each sentence's audio file exists and is reachable (HTTP `200`) at `base_url + dics[i].id + /sounds/ + audio`.

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array with at least one item, each containing an `id` field).
- TC-DA-0004 passes (`playlist.json` is fetchable and each item has a valid `audio` string field).

## Test Data
- **base_url**: `https://leva13007.github.io/dictations/dics/`
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Playlist URL pattern:** `base_url + dics[i].id + /playlist.json`
- **Audio URL pattern:** `base_url + dics[i].id + /sounds/ + playlist[j].audio`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each dictation, send a GET request to `base_url + dics[i].id + /playlist.json` | Response status code is `200` and body is a valid JSON array |
| 3    | For each item in the playlist array, extract the `audio` field  | `audio` is a non-empty string |
| 4    | Send a HEAD/GET request to `base_url + dics[i].id + /sounds/ + audio` | Response status code is `200` |
| 5    | Verify the response `Content-Type` header                       | Value contains `audio/` (e.g. `audio/mpeg`) |

## Screenshots / Attachments (optional)

## Edge Cases
- Audio URL returns non-200 → test should fail for that sentence.
- `audio` field is an empty string → test should fail.
- Audio file returns an unexpected content type (e.g. `text/html`) → test should fail.
- Playlist is empty → test should fail (covered by TC-DA-0004).

## Notes
- Audio files follow the naming convention `XXXX-YY.mp3` where `XXXX` is the dictation id and `YY` is the sentence number (e.g. `0001-01.mp3`).
- The project file structure for each dictation is:
  ```
  XXXX/
  ├── dic.json
  ├── playlist.json
  ├── Text.md
  ├── ReadMe.md          (optional)
  └── sounds/
      ├── XXXX-01.mp3
      ├── XXXX-02.mp3
      └── ...
  ```
- A HEAD request is preferred over GET for performance, but GET is acceptable if HEAD is not supported.

## Related
- TC-DA-0001 — API: Open Entry Point and fetch index.json
- TC-DA-0002 — API: Validate index.json structure
- TC-DA-0004 — API: Validate playlist.json structure for each dictation
