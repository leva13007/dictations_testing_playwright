---
id: TC-DA-0001
title: "API: Open Entry Point and fetch index.json"
type: API
priority: Medium
area: "api/entry-point"
component: "EntryPoint"
related-ticket: ""
status: Active
type: ["smoke", "regression"]
created: 2026-03-21
updated: 2026-03-21
---

# TC-DA-0001 — API: Open Entry Point and fetch index.json

## Objective
Verify that the API entry point URL responds with HTTP 200 and returns a valid `index.json`.

## Preconditions
- The dictations are published and GitHub actions have successfully completed(deployed the `index.json` to the GitHub Pages URL).

## Test Data
- **URL:** `https://leva13007.github.io/dictations/dics/index.json`
- **Expected resource:** `index.json`

## Steps and Expected Results

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1    | Send a GET request to the entry point URL `https://leva13007.github.io/dictations/dics/index.json` | Response status code is `200` |
| 2    | Parse the response body as JSON | Response body is a valid JSON object |

## Screenshots / Attachments (optional)

## Edge Cases
- Server is unreachable → request should fail with a network error.
- Server returns non-200 status → test should fail.
- Response body is not valid JSON → test should fail.

## Notes
- This is the first smoke-test validating that the API entry point is alive and serving the index resource.

## Related
