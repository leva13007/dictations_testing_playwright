import { test, expect } from "@playwright/test";

const INDEX = "index.json";

test.describe("TC-DA-0011 — API: No duplicate dictation IDs in index", () => {
  test("All dics[].id values in index.json are unique", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

    const ids = dics.map((d: { id: string }) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size, "Duplicate dictation IDs found").toBe(ids.length);
  });
});
