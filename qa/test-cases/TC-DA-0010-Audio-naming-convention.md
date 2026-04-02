---
id: TC-DA-0010
title: "API: Audio file names follow naming convention"
priority: Medium
status: Active
type: functional
created: 2026-03-30
updated: 2026-03-30
---

# TC-DA-0010 — API: Audio file names follow naming convention

## Objective
For every dictation listed in the `dics` array of `index.json`, fetch `playlist.json` and verify that each item's `audio` field matches the expected naming pattern `{dicId}-{sentenceNum}.mp3` (e.g. `0001-01.mp3`).

## Preconditions
- TC-DA-0001 passes (entry point is reachable and returns valid JSON).
- TC-DA-0002 passes (`index.json` has a valid `dics` array).
- TC-DA-0004 passes (`playlist.json` is fetchable and each item has a valid `audio` string field).

## Test Data
- **base_url**: `https://leva13007.github.io/dictations/dics/`
- **Index URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Playlist URL pattern:** `base_url + dics[i].id + /playlist.json`
- **Expected audio pattern:** `{dicId}-{sentenceNum}.mp3` where `dicId` is zero-padded to 4 digits and `sentenceNum` is zero-padded to 2 digits

## Steps and Expected Results

| Step | Action | Expected Result |
|------|----------------------------------------------------------------|-----------------|
| 1    | Fetch `index.json` and parse the `dics` array                  | `dics` is a non-empty array |
| 2    | For each dictation, send a GET request to `base_url + dics[i].id + /playlist.json` | Response status code is `200` and body is a valid JSON array |
| 3    | For each item at index `j` (0-based) in the playlist, check `audio` matches regex `^\d{4}-\d{2}\.mp3$` | `audio` matches the pattern |
| 4    | Verify the dictation ID part of the filename equals `dics[i].id` | First 4 digits match the dictation ID |
| 5    | Verify the sentence number part equals `j + 1` (zero-padded to 2 digits) | Sentence number matches item position |

## Screenshots / Attachments (optional)

## Edge Cases
- Audio filename uses a different extension (e.g. `.wav`) → test should fail.
- Sentence number is not zero-padded (e.g. `0001-1.mp3` instead of `0001-01.mp3`) → test should fail.
- Dictation ID in filename does not match the dictation's actual ID → test should fail.
- Sentence number in filename does not match item position → test should fail.

## Notes
- Naming convention: `XXXX-YY.mp3` where `XXXX` = dictation id (4 digits), `YY` = sentence number (2 digits, 1-based).
- This test validates naming consistency; audio file reachability is covered by TC-DA-0006.

## Related
- TC-DA-0004 — API: Validate playlist.json structure for each dictation
- TC-DA-0006 — API: Each sentence should have a valid audio file
