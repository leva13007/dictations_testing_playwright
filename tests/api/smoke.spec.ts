import { test, expect } from "@playwright/test";
import { INDEX_FILE } from "./constants";

test.describe("Smoke tests", () => {
  test(`TC-DA-0001 — API: Open Entry Point and fetch ${INDEX_FILE}`, async({request}) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(INDEX_FILE);
    expect(response.status()).toBe(200);

    // Step 2: Parse the response body as JSON
    const body = await response.json();
    expect(body).toBeTruthy();
    expect(typeof body).toBe("object");
  });
});
