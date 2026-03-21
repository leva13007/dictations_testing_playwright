import { test, expect } from "@playwright/test";

const FILE_NAME = "index.json";

test.describe(`TC-DA-0001 — API: Open Entry Point and fetch ${FILE_NAME}`, () => {
  test("GET entry point returns status 200 and valid JSON", async ({
    request,
  }) => {
    // Step 1: Send GET request to the entry point URL
    const response = await request.get(FILE_NAME);
    expect(response.status()).toBe(200);

    // Step 2: Parse the response body as JSON
    const body = await response.json();
    expect(body).toBeTruthy();
    expect(typeof body).toBe("object");
  });
});
