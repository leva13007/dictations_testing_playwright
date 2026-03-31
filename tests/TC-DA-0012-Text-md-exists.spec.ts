import { test, expect } from "@playwright/test";

const INDEX = "index.json";

test.describe("TC-DA-0012 — API: Text.md exists for each dictation", () => {
  test("Text.md is reachable and non-empty for every dictation", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

    for (const item of dics) {
      const res = await request.get(`${item.id}/Text.md`);
      expect(res.status(), `Text.md for ${item.id} should return 200`).toBe(200);

      const body = await res.text();
      expect(body.length, `${item.id}: Text.md should not be empty`).toBeGreaterThan(0);
    }
  });
});
