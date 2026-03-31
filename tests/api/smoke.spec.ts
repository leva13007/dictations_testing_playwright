import { test, expect } from "@playwright/test";

/**
 * Smoke tests — absolute minimum to know the API is alive.
 * If these fail, nothing else matters.
 */
test.describe("Smoke", () => {
  test("TC-DA-0001: index.json is reachable and returns valid JSON", async ({ request }) => {
    const response = await request.get("index.json");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toBeTruthy();
    expect(typeof body).toBe("object");
  });
});
