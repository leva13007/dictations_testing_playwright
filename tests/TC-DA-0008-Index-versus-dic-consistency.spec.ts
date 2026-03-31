import { test, expect } from "@playwright/test";

const INDEX = "index.json";

test.describe("TC-DA-0008 — API: Index metadata should match dic.json", () => {
  test("Shared fields between index.json items and dic.json are identical", async ({ request }) => {
    const indexRes = await request.get(INDEX);
    expect(indexRes.status()).toBe(200);
    const { dics } = await indexRes.json();
    expect(Array.isArray(dics) && dics.length > 0).toBeTruthy();

    for (const item of dics) {
      const res = await request.get(`${item.id}/dic.json`);
      expect(res.status(), `dic.json for ${item.id}`).toBe(200);
      const dic = await res.json();

      expect(dic.id, `${item.id}: id mismatch`).toBe(item.id);
      expect(dic.title, `${item.id}: title mismatch`).toBe(item.title);
      expect(dic.level, `${item.id}: level mismatch`).toBe(item.level);
      expect(dic.sentences, `${item.id}: sentences mismatch`).toBe(item.sentences);
      expect(dic.duration_sec, `${item.id}: duration_sec mismatch`).toBe(item.duration_sec);
      expect(dic.tags, `${item.id}: tags mismatch`).toEqual(item.tags);
      expect(dic.features, `${item.id}: features mismatch`).toEqual(item.features);
    }
  });
});
